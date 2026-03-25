from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List, Literal


class QuestionCreate(BaseModel):
    question_text: str = Field(min_length=3)
    option_a: str = Field(min_length=1)
    option_b: str = Field(min_length=1)
    option_c: str = Field(min_length=1)
    option_d: str = Field(min_length=1)
    correct_option: Literal["A", "B", "C", "D"]

class ExamCreate(BaseModel):
    title: str
    duration: int  # in minutes
    questions: List[QuestionCreate] = Field(default_factory=list)

class ExamResponse(BaseModel):
    id: int
    title: str
    duration: int
    exam_code: str
    created_by: int
    created_at: datetime
    questions_count: Optional[int] = 0

    class Config:
        from_attributes = True

class JoinExamRequest(BaseModel):
    exam_code: str

class ExamDetailResponse(BaseModel):
    id: int
    title: str
    duration: int
    exam_code: str

    class Config:
        from_attributes = True


class QuestionPublicResponse(BaseModel):
    id: int
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str

    class Config:
        from_attributes = True


class ExamQuestionsResponse(BaseModel):
    exam: ExamDetailResponse
    questions: List[QuestionPublicResponse]


class SubmitAnswer(BaseModel):
    question_id: int
    selected_option: Literal["A", "B", "C", "D"]


class ExamSubmitRequest(BaseModel):
    answers: List[SubmitAnswer]


class ExamSubmitResponse(BaseModel):
    exam_id: int
    total_questions: int
    attempted: int
    correct_answers: int
    score_percent: float
