# docs/database-design.md

# Database Design — SafeExam

---

## 📊 Tables

### Users

* id
* name
* email
* role

### Exams

* id
* title
* duration

### Questions

* id
* exam_id
* question_text

### Responses

* id
* student_id
* answers

### Results

* id
* score
* student_id

---

## 🎯 Goal

Efficient data storage and retrieval.
