from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.user import User, UserRole
from ..schemas.user import UserCreate, AdminLoginRequest, UserResponse, GoogleTokenRequest
from ..core.config import settings
import bcrypt
import secrets
from typing import Optional
import json
from datetime import datetime, timedelta
from urllib.parse import urlencode
import requests

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

# In-memory session store - maps session token to user_id
# This persists across requests but will be cleared on server restart
SESSION_STORE = {}

# OAuth state store for CSRF protection (short-lived, in-memory)
OAUTH_STATE_STORE = {}

def get_current_user(request: Request, db: Session = Depends(get_db)) -> Optional[User]:
    """Get current authenticated user from session cookie"""
    try:
        # Extract session token from cookies
        session_token = request.cookies.get("session_token")
        print(f"DEBUG: Received session token: {session_token[:30] if session_token else 'None'}...")
        print(f"DEBUG: Available sessions: {len(SESSION_STORE)}")
        
        if not session_token:
            print("DEBUG: No session token found in cookies")
            return None
        
        # Check if session exists
        if session_token not in SESSION_STORE:
            print(f"DEBUG: Session token not found in store")
            print(f"DEBUG: Available tokens: {list(SESSION_STORE.keys())[:3]}")  # Show first 3 for debugging
            return None
        
        session_data = SESSION_STORE[session_token]
        print(f"DEBUG: Session data found: {session_data}")
        
        # Check if session is expired
        if datetime.utcnow() > session_data["expires_at"]:
            print("DEBUG: Session expired")
            del SESSION_STORE[session_token]
            return None
        
        # Get user from database
        user = db.query(User).filter(User.id == session_data["user_id"]).first()
        print(f"DEBUG: User found in DB: {user.email if user else 'None'}")
        return user
        
    except Exception as e:
        print(f"DEBUG: Error getting current user: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())

def set_session_cookie(response: Response, user_id: int):
    """Set session cookie with simple token"""
    # Generate a unique session token
    session_token = secrets.token_urlsafe(32)
    
    # Store in memory
    SESSION_STORE[session_token] = {
        "user_id": user_id,
        "created_at": datetime.utcnow(),
        "expires_at": datetime.utcnow() + timedelta(days=30),
    }
    
    print(f"DEBUG: Setting session cookie with token: {session_token}")
    print(f"DEBUG: Session store now has {len(SESSION_STORE)} sessions")
    
    response.set_cookie(
        "session_token",
        session_token,
        max_age=30 * 24 * 60 * 60,
        httponly=False,  # Allow JS access temporarily for cross-origin
        secure=False,  # Set to True in production with HTTPS
        samesite="none",  # Allow cross-site
        domain="localhost",
    )

@router.post("/google", response_model=UserResponse)
def google_login(request: GoogleTokenRequest, response: Response, db: Session = Depends(get_db)):
    """
    Google OAuth login for students
    
    In production: verify token with Google API
    For demo: accept token and extract email safely
    """
    try:
        # Demo: Extract email from token or create unique student
        # In production: call Google API to verify and get user info
        # For now, create a unique student based on token hash
        
        token_hash = hash_password(request.token)[:20]  # Use first 20 chars of hash
        email = f"student-{token_hash}@safeexam.local"
        
        # Check if user exists
        existing_user = db.query(User).filter(User.email == email).first()
        
        if existing_user:
            user = existing_user
        else:
            # Create new student user
            user = User(
                email=email,
                name="Student",
                role=UserRole.STUDENT
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        
        # Set session cookie
        set_session_cookie(response, user.id)
        
        return user
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Google login failed: {str(e)}"
        )

@router.get("/google/login")
def google_oauth_login():
    """
    Initiate Google OAuth flow
    Redirects to Google's OAuth consent screen
    """
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google OAuth not configured"
        )
    
    # Generate state for CSRF protection
    state = secrets.token_urlsafe(32)
    OAUTH_STATE_STORE[state] = {
        "created_at": datetime.utcnow(),
        "expires_at": datetime.utcnow() + timedelta(minutes=10),
    }
    
    # Google OAuth authorization URL
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": "http://localhost:8000/api/v1/auth/google/callback",
        "response_type": "code",
        "scope": "openid email profile",
        "state": state,
        "access_type": "offline",
    }
    
    auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
    return RedirectResponse(url=auth_url)

@router.get("/google/callback")
def google_oauth_callback(
    code: str,
    state: str,
    response: Response,
    db: Session = Depends(get_db)
):
    """
    Handle Google OAuth callback
    Exchanges authorization code for tokens and creates/updates user
    """
    
    # Verify state for CSRF protection
    if state not in OAUTH_STATE_STORE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OAuth state"
        )
    
    state_data = OAUTH_STATE_STORE[state]
    if datetime.utcnow() > state_data["expires_at"]:
        del OAUTH_STATE_STORE[state]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OAuth state expired"
        )
    
    del OAUTH_STATE_STORE[state]
    
    try:
        # Exchange authorization code for tokens
        token_url = "https://oauth2.googleapis.com/token"
        token_data = {
            "code": code,
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": "http://localhost:8000/api/v1/auth/google/callback",
            "grant_type": "authorization_code",
        }
        
        token_response = requests.post(token_url, data=token_data)
        token_response.raise_for_status()
        tokens = token_response.json()
        
        # Get user info from Google
        userinfo_url = "https://openidconnect.googleapis.com/v1/userinfo"
        headers = {"Authorization": f"Bearer {tokens['access_token']}"}
        userinfo_response = requests.get(userinfo_url, headers=headers)
        userinfo_response.raise_for_status()
        userinfo = userinfo_response.json()
        
        # Extract user data
        email = userinfo.get("email")
        name = userinfo.get("name", "Student")
        google_id = userinfo.get("sub")  # Google's unique user ID
        
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not get email from Google"
            )
        
        # Check if user exists
        existing_user = db.query(User).filter(User.email == email).first()
        
        if existing_user:
            user = existing_user
            # Update name if it changed
            if name and user.name != name:
                user.name = name
                db.commit()
                db.refresh(user)
        else:
            # Create new student user from Google
            user = User(
                email=email,
                name=name,
                role=UserRole.STUDENT
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        
        # Set session cookie
        session_token = secrets.token_urlsafe(32)
        SESSION_STORE[session_token] = {
            "user_id": user.id,
            "created_at": datetime.utcnow(),
            "expires_at": datetime.utcnow() + timedelta(days=30),
        }
        
        print(f"DEBUG: Created session: {session_token}")
        
        # Build a redirect URL with session token in query string
        redirect_url = f"http://localhost:3000/dashboard?session_token={session_token}"
        response.set_cookie(
            "session_token",
            session_token,
            max_age=30 * 24 * 60 * 60,
            httponly=False,
            secure=False,
            samesite="lax",
            domain="localhost",
        )
        return RedirectResponse(url=redirect_url)
        
    except requests.RequestException as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Failed to exchange OAuth code: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Google OAuth failed: {str(e)}"
        )

@router.post("/admin-login", response_model=UserResponse)
def admin_login(request: AdminLoginRequest, response: Response, db: Session = Depends(get_db)):
    """Admin email + password login"""
    
    # Find admin user by email
    user = db.query(User).filter(
        User.email == request.email,
        User.role == UserRole.ADMIN
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Verify password
    if not user.password_hash or not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Set session cookie
    set_session_cookie(response, user.id)
    
    return user

@router.post("/admin-register", response_model=UserResponse)
def admin_register(request: AdminLoginRequest, response: Response, db: Session = Depends(get_db)):
    """Register new admin account"""
    
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new admin user with hashed password
    new_user = User(
        email=request.email,
        password_hash=hash_password(request.password),
        role=UserRole.ADMIN,
        name="Admin"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Set session cookie
    set_session_cookie(response, new_user.id)
    
    return new_user

@router.get("/me", response_model=UserResponse)
def get_me(request: Request, db: Session = Depends(get_db)):
    """Get current logged-in user"""
    current_user = get_current_user(request, db)
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    return current_user

@router.post("/logout")
def logout(response: Response):
    """Logout user and clear session"""
    response.delete_cookie("session_token")
    return {"message": "Logged out successfully"}
