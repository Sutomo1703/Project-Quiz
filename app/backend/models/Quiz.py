from flask_restful import fields
from app.backend.models.Question import question_fields
from app.backend.models.Record_Quiz import record_quiz_fields
from app.backend.models.Base import BaseModel
from flask_login import current_user
from app import db


quiz_fields = {
    "id": fields.Integer,
    "quiz_name": fields.String,
    "questions": fields.List(fields.Nested(question_fields)),
    "record_quizzes": fields.List(fields.Nested(record_quiz_fields))
}


class QuizModel(BaseModel):
    __tablename__ = 'quiz'
    quiz_name = db.Column(db.Text, nullable=False, default='Untitled')
    questions = db.relationship(
        'QuestionModel',
        backref='quiz',
        cascade='all, delete, delete-orphan',
        lazy='joined'
    )
    record_quizzes = db.relationship(
        'RecordQuizModel',
        backref='quiz',
        cascade='all, delete, delete-orphan',
        lazy='joined'
    )

    def __init__(self, quiz_name):
        self.quiz_name = quiz_name
        self.createdBy = current_user.id

    def update(self, quiz_name):
        self.quiz_name = quiz_name
        self.editedBy = current_user.id
        db.session.commit()

    def delete(self):
        #self.active = False
        db.session.delete(self)
        db.session.commit()

    def save(self):
        db.session.add(self)
        db.session.commit()
