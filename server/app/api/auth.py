from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.user import User, UserRole
from ..schemas.user import AdminLoginRequest, UserResponse
from ..core.config import settings
import bcrypt
import secrets
from typing import Optional
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
    # Extract session token from cookies
    session_token = request.cookies.get("session_token")

    if not session_token:
        return None

    # Check if session exists
    if session_token not in SESSION_STORE:
        return None

    session_data = SESSION_STORE[session_token]

    # Check if session is expired
    if datetime.utcnow() > session_data["expires_at"]:
        del SESSION_STORE[session_token]
        return None

    # Get user from database
    return db.query(User).filter(User.id == session_data["user_id"]).first()

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
    
    response.set_cookie(
        "session_token",
        session_token,
        max_age=30 * 24 * 60 * 60,
        httponly=True,
        secure=False,
        samesite="lax",
    )

@router.get("/google/login")
def google_oauth_login():
    """Initiate Google OAuth flow and redirect to consent screen."""
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google OAuth is not configured. Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.",
        )

    state = secrets.token_urlsafe(32)
    OAUTH_STATE_STORE[state] = {
        "created_at": datetime.utcnow(),
        "expires_at": datetime.utcnow() + timedelta(minutes=10),
    }

    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": "http://localhost:8000/api/v1/auth/google/callback",
        "response_type": "code",
        "scope": "openid email profile",
        "state": state,
        "access_type": "offline",
        "prompt": "select_account",
    }

    auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
    return RedirectResponse(url=auth_url)


@router.get("/google/callback")
def google_oauth_callback(
    code: str,
    state: str,
    db: Session = Depends(get_db),
):
    """Handle Google callback, create/fetch student, set session cookie, redirect to dashboard."""
    if state not in OAUTH_STATE_STORE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OAuth state",
        )

    state_data = OAUTH_STATE_STORE[state]
    if datetime.utcnow() > state_data["expires_at"]:
        del OAUTH_STATE_STORE[state]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OAuth state expired",
        )

    del OAUTH_STATE_STORE[state]

    try:
        token_response = requests.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": "http://localhost:8000/api/v1/auth/google/callback",
                "grant_type": "authorization_code",
            },
            timeout=15,
        )
        token_response.raise_for_status()
        tokens = token_response.json()

        userinfo_response = requests.get(
            "https://openidconnect.googleapis.com/v1/userinfo",
            headers={"Authorization": f"Bearer {tokens['access_token']}"},
            timeout=15,
        )
        userinfo_response.raise_for_status()
        userinfo = userinfo_response.json()

        email = userinfo.get("email")
        name = userinfo.get("name") or "Student"

        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unable to fetch email from Google profile",
            )

        user = db.query(User).filter(User.email == email).first()
        if user and user.role != UserRole.STUDENT:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This email is registered as admin. Use admin login.",
            )

        if not user:
            user = User(email=email, name=name, role=UserRole.STUDENT)
            db.add(user)
            db.commit()
            db.refresh(user)
        elif user.name != name:
            user.name = name
            db.commit()

        session_token = secrets.token_urlsafe(32)
        SESSION_STORE[session_token] = {
            "user_id": user.id,
            "created_at": datetime.utcnow(),
            "expires_at": datetime.utcnow() + timedelta(days=30),
        }

        redirect = RedirectResponse(url="http://localhost:3000/dashboard")
        redirect.set_cookie(
            "session_token",
            session_token,
            max_age=30 * 24 * 60 * 60,
            httponly=True,
            secure=False,
            samesite="lax",
        )
        return redirect
    except requests.RequestException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google OAuth failed during token/userinfo exchange",
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
def logout(request: Request, response: Response):
    """Logout user and clear session"""
    session_token = request.cookies.get("session_token")
    if session_token and session_token in SESSION_STORE:
        del SESSION_STORE[session_token]

    response.delete_cookie("session_token")
    return {"message": "Logged out successfully"}
