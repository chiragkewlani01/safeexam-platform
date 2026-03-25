from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
from ..core.database import get_db
from ..models.user import User, UserRole
from ..models.exam import Exam
from ..models.question import Question
from ..schemas.exam import (
    ExamCreate,
    ExamResponse,
    JoinExamRequest,
    ExamDetailResponse,
    QuestionPublicResponse,
    ExamQuestionsResponse,
    ExamSubmitRequest,
    ExamSubmitResponse,
)
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

    created_questions = 0
    for question in exam.questions:
        new_question = Question(
            exam_id=new_exam.id,
            question_text=question.question_text,
            option_a=question.option_a,
            option_b=question.option_b,
            option_c=question.option_c,
            option_d=question.option_d,
            correct_option=question.correct_option,
        )
        db.add(new_question)
        created_questions += 1

    if created_questions > 0:
        db.commit()

    exam_response = ExamResponse.model_validate(new_exam)
    exam_response.questions_count = created_questions
    return exam_response

@router.get("", response_model=List[ExamResponse])
def list_exams(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get exams. Admin sees own exams, student sees all exams."""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    if current_user.role == UserRole.ADMIN:
        exams = db.query(Exam).filter(Exam.created_by == current_user.id).order_by(Exam.created_at.desc()).all()
    else:
        exams = db.query(Exam).order_by(Exam.created_at.desc()).all()

    result = []
    for exam in exams:
        exam_obj = ExamResponse.model_validate(exam)
        exam_obj.questions_count = db.query(Question).filter(Question.exam_id == exam.id).count()
        result.append(exam_obj)

    return result

@router.post("/join", response_model=ExamDetailResponse)
def join_exam(
    request: JoinExamRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Join exam using exam code (Student)"""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    if current_user.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can join exams"
        )
    
    exam = db.query(Exam).filter(Exam.exam_code == request.exam_code).first()
    
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found. Please check the exam code."
        )
    
    return exam

@router.delete("/{exam_id}")
def delete_exam(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete exam (Admin only, owner only)."""
    if not current_user or current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete exams"
        )

    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )

    if exam.created_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own exams"
        )

    # Remove dependent rows first to satisfy FK constraints.
    db.query(Question).filter(Question.exam_id == exam.id).delete(synchronize_session=False)
    db.delete(exam)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot delete exam because it still has dependent records"
        )

    return {"message": "Exam deleted successfully"}


@router.get("/{exam_id}/questions", response_model=ExamQuestionsResponse)
def get_exam_questions(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return exam metadata and MCQ questions for students."""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    if current_user.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can attempt exams",
        )

    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found",
        )

    questions = db.query(Question).filter(Question.exam_id == exam.id).order_by(Question.id.asc()).all()

    return ExamQuestionsResponse(
        exam=ExamDetailResponse.model_validate(exam),
        questions=[QuestionPublicResponse.model_validate(q) for q in questions],
    )


@router.post("/{exam_id}/submit", response_model=ExamSubmitResponse)
def submit_exam(
    exam_id: int,
    payload: ExamSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Submit student answers and return score summary (demo mode, no persistence)."""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    if current_user.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can submit exams",
        )

    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found",
        )

    questions = db.query(Question).filter(Question.exam_id == exam.id).all()
    if not questions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This exam has no questions",
        )

    correct_map = {q.id: q.correct_option for q in questions}
    submitted_map = {a.question_id: a.selected_option for a in payload.answers}

    correct_answers = 0
    for qid, correct_option in correct_map.items():
        if submitted_map.get(qid) == correct_option:
            correct_answers += 1

    total_questions = len(questions)
    attempted = len([qid for qid in correct_map.keys() if qid in submitted_map])
    score_percent = round((correct_answers / total_questions) * 100, 2)

    return ExamSubmitResponse(
        exam_id=exam.id,
        total_questions=total_questions,
        attempted=attempted,
        correct_answers=correct_answers,
        score_percent=score_percent,
    )
