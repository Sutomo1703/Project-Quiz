from flask_restful import fields
from app.backend.models.Base import BaseModel
from flask_login import current_user
from app import db

record_answer_fields = {
    "id": fields.Integer,
    "record_quiz_id": fields.Integer,
    "question_id": fields.Integer,
    "choice_id":  fields.Integer
}


class RecordAnswerModel(BaseModel):
    __tablename__ = 'record_answer'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    record_quiz_id = db.Column(db.Integer, db.ForeignKey('record_quiz.id'))
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'))
    choice_id = db.Column(db.Integer, db.ForeignKey('choice.id'))

    def __init__(self, record_quiz_id, question_id, choice_id):
        self.record_quiz_id = record_quiz_id
        self.question_id = question_id
        self.choice_id = choice_id
        self.createdBy = current_user.id

    def save(self):
        db.session.add(self)
        db.session.commit()
