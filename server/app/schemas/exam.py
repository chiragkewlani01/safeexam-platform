from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ExamCreate(BaseModel):
    title: str
    duration: int  # in minutes

class ExamResponse(BaseModel):
    id: int
    title: str
    duration: int
    exam_code: str
    created_by: int
    created_at: datetime

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
