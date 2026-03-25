from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from ..core.database import Base


class Question(Base):
	__tablename__ = "questions"

	id = Column(Integer, primary_key=True, index=True)
	exam_id = Column(Integer, ForeignKey("exams.id"), nullable=False, index=True)
	question_text = Column(String, nullable=False)
	option_a = Column(String, nullable=False)
	option_b = Column(String, nullable=False)
	option_c = Column(String, nullable=False)
	option_d = Column(String, nullable=False)
	correct_option = Column(String, nullable=False)  # A/B/C/D
	created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

	def __repr__(self):
		return f"<Question {self.id} exam={self.exam_id}>"
