from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.user import User, UserRole
from ..models.exam import Exam
from ..schemas.exam import ExamCreate, ExamResponse, JoinExamRequest, ExamDetailResponse
from ..core.utils import generate_exam_code
from .auth import get_current_user

router = APIRouter(prefix="/api/v1/exams", tags=["exams"])

@router.post("", response_model=ExamResponse)
def create_exam(
    exam: ExamCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new exam (Admin only)"""
    
    if not current_user or current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create exams"
        )
    
    exam_code = generate_exam_code()
    
    new_exam = Exam(
        title=exam.title,
        duration=exam.duration,
        exam_code=exam_code,
        created_by=current_user.id
    )
    
    db.add(new_exam)
    db.commit()
    db.refresh(new_exam)
    
    return new_exam

@router.get("", response_model=List[ExamResponse])
def list_exams(db: Session = Depends(get_db)):
    """Get all exams"""
    exams = db.query(Exam).all()
    return exams

@router.get("/{exam_id}", response_model=ExamDetailResponse)
def get_exam(exam_id: int, db: Session = Depends(get_db)):
    """Get exam details by ID"""
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    
    return exam

@router.post("/join", response_model=ExamDetailResponse)
def join_exam(
    request: JoinExamRequest,
    db: Session = Depends(get_db)
):
    """Join exam using exam code (Student)"""
    
    exam = db.query(Exam).filter(Exam.exam_code == request.exam_code).first()
    
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found. Please check the exam code."
        )
    
    return exam

@router.get("/code/{exam_code}", response_model=ExamDetailResponse)
def get_exam_by_code(exam_code: str, db: Session = Depends(get_db)):
    """Get exam by code"""
    exam = db.query(Exam).filter(Exam.exam_code == exam_code).first()
    
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    
    return exam
