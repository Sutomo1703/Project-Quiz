from flask_restful import fields
from app.backend.models.Choice import choice_fields
from app.backend.models.Base import BaseModel
from flask_login import current_user
from app import db

question_fields = {
    "id": fields.Integer,
    "quiz_id": fields.Integer,
    "question": fields.String,
    "choices": fields.List(fields.Nested(choice_fields))
}


class QuestionModel(BaseModel):
    __tablename__ = 'question'
    question = db.Column(db.Text)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'))
    choices = db.relationship(
        'ChoiceModel',
        backref='question',
        cascade='all, delete, delete-orphan',
        lazy='joined'
    )
    record_answers = db.relationship(
        'RecordAnswerModel',
        backref='question',
        cascade='all, delete, delete-orphan',
        lazy='joined'
    )

    def __init__(self, question, quiz):
        self.question = question
        self.quiz = quiz
        self.createdBy = current_user.id

    def update(self, question):
        self.question = question
        self.editedBy = current_user.id
        db.session.commit()

    def delete(self):
        #self.active = False
        db.session.delete(self)
        db.session.commit()

    def save(self):
        db.session.add(self)
        db.session.commit()
