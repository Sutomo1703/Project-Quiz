from flask_restful import fields
from app.backend.models.Base import BaseModel
from flask_login import current_user
from app import db

choice_fields = {
    "id": fields.Integer,
    "question_id": fields.Integer,
    "answer":  fields.String,
    "is_correct": fields.Boolean
}


class ChoiceModel(BaseModel):
    __tablename__ = 'choice'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    answer = db.Column(db.Text)
    is_correct = db.Column(db.Boolean, nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'))
    record_answers = db.relationship(
        'RecordAnswerModel',
        backref='choice',
        cascade='all, delete, delete-orphan',
        lazy='joined'
    )

    def __init__(self, answer, question, is_correct):
        self.answer = answer
        self.question = question
        self.is_correct = is_correct
        self.createdBy = current_user.id

    def update(self, answer, is_correct):
        self.answer = answer
        self.is_correct = is_correct
        self.editedBy = current_user.id
        db.session.commit()

    def delete(self):
        #self.active = False
        db.session.delete(self)
        db.session.commit()

    def save(self):
        db.session.add(self)
        db.session.commit()
