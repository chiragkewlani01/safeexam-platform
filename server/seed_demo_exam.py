from datetime import datetime

from app.core.database import SessionLocal, Base, engine
from app.models.user import User, UserRole
from app.models.exam import Exam
from app.models.question import Question
from app.core.utils import generate_exam_code


DEMO_ADMIN_EMAIL = "demoadmin@safeexam.local"
DEMO_EXAM_TITLE = "C Programming Demo Test"
DEMO_EXAM_DURATION = 30


DEMO_QUESTIONS = [
    {
        "question_text": "What is the correct output of: printf(\"%d\", 5 + 3 * 2);",
        "option_a": "16",
        "option_b": "11",
        "option_c": "13",
        "option_d": "10",
        "correct_option": "B",
    },
    {
        "question_text": "Which data type is used to store a single character in C?",
        "option_a": "string",
        "option_b": "character",
        "option_c": "char",
        "option_d": "text",
        "correct_option": "C",
    },
    {
        "question_text": "Which header file is required for printf() and scanf()?",
        "option_a": "<conio.h>",
        "option_b": "<stdio.h>",
        "option_c": "<stdlib.h>",
        "option_d": "<math.h>",
        "correct_option": "B",
    },
    {
        "question_text": "What does this print? int a = 10; printf(\"%d\", a++);",
        "option_a": "11",
        "option_b": "10",
        "option_c": "9",
        "option_d": "Error",
        "correct_option": "B",
    },
    {
        "question_text": "Which loop is guaranteed to execute at least once?",
        "option_a": "for",
        "option_b": "while",
        "option_c": "do...while",
        "option_d": "None",
        "correct_option": "C",
    },
    {
        "question_text": "What is the index of the first element in a C array?",
        "option_a": "1",
        "option_b": "-1",
        "option_c": "0",
        "option_d": "Depends on compiler",
        "correct_option": "C",
    },
    {
        "question_text": "Which operator is used to access the value at a pointer address?",
        "option_a": "&",
        "option_b": "*",
        "option_c": "->",
        "option_d": "%",
        "correct_option": "B",
    },
    {
        "question_text": "What is the correct way to declare an integer pointer?",
        "option_a": "int ptr;",
        "option_b": "int *ptr;",
        "option_c": "pointer int ptr;",
        "option_d": "int &ptr;",
        "correct_option": "B",
    },
    {
        "question_text": "What will be the output? printf(\"%d\", sizeof(int));",
        "option_a": "Always 2",
        "option_b": "Always 4",
        "option_c": "Depends on system/compiler",
        "option_d": "Compilation error",
        "correct_option": "C",
    },
    {
        "question_text": "Which keyword is used to stop a loop immediately?",
        "option_a": "stop",
        "option_b": "exit",
        "option_c": "continue",
        "option_d": "break",
        "correct_option": "D",
    },
]

def main():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        admin = db.query(User).filter(User.email == DEMO_ADMIN_EMAIL, User.role == UserRole.ADMIN).first()
        if not admin:
            admin = db.query(User).filter(User.role == UserRole.ADMIN).first()

        if not admin:
            print("❌ No admin account found.")
            print("   Please create an admin account first from the UI, then run this script again.")
            return

        exam = Exam(
            title=DEMO_EXAM_TITLE,
            duration=DEMO_EXAM_DURATION,
            exam_code=generate_exam_code(),
            created_by=admin.id,
            created_at=datetime.utcnow(),
        )
        db.add(exam)
        db.commit()
        db.refresh(exam)

        for q in DEMO_QUESTIONS:
            db.add(
                Question(
                    exam_id=exam.id,
                    question_text=q["question_text"],
                    option_a=q["option_a"],
                    option_b=q["option_b"],
                    option_c=q["option_c"],
                    option_d=q["option_d"],
                    correct_option=q["correct_option"],
                )
            )

        db.commit()

        print("✅ Demo exam created successfully")
        print(f"   Title: {exam.title}")
        print(f"   Exam Code: {exam.exam_code}")
        print(f"   Questions: {len(DEMO_QUESTIONS)}")
        print(f"   Created By Admin: {admin.email}")

    finally:
        db.close()


if __name__ == "__main__":
    main()
