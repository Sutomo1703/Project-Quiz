from app.backend.models.Base import BaseModel
from app import db


class QuizInstance(BaseModel):
    __tablename__ = 'quiz_instance'
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'))
    status = db.Column(db.Text, nullable=False)
    start_date = db.Column(db.DateTime(timezone=True), nullable=False)
    end_date = db.Column(db.DateTime(timezone=True), nullable=False)