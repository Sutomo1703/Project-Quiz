from flask_restful import fields
from app.backend.models.Record_Answer import record_answer_fields
from app.backend.models.Base import BaseModel
from flask_login import current_user
from app import db

record_quiz_fields = {
    "id": fields.Integer,
    "quiz_id": fields.Integer,
    "record_answers": fields.List(fields.Nested(record_answer_fields)),
    "nilai": fields.Float,
    "tanggal_kerja": fields.DateTime(dt_format="iso8601")
}


class RecordQuizModel(BaseModel):
    __tablename__ = 'record_quiz'
    quiz_instance_id = db.Column(db.Integer, db.ForeignKey('quiz_instance.id'))
    pengerja_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    record_answers = db.relationship(
        'RecordAnswerModel',
        backref='record_quiz',
        cascade='all, delete, delete-orphan',
        lazy='joined'
    )
    nilai = db.Column(db.Float)
    tanggal_kerja = db.Column(db.DateTime)

    def __init__(self, quiz_id, pengerja_id, nilai, tanggal_kerja):
        self.quiz_id = quiz_id
        self.pengerja_id = pengerja_id
        self.nilai = nilai
        self.tanggal_kerja = tanggal_kerja
        self.createdBy = current_user.id

    def save(self):
        db.session.add(self)
        db.session.commit()
