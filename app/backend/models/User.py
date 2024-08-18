from flask_login import UserMixin
from flask_restful import fields
from app.backend.models.Base import BaseModel
from app import db

user_fields = {
    "id": fields.Integer,
    "nrp": fields.String,
    "nama": fields.String,
    "password": fields.String,
    "is_authenticated": fields.Boolean
}

res_fields = {
    "data": fields.Nested(user_fields)
}


class UserModel(BaseModel, UserMixin):
    __tablename__ = 'user'
    nrp = db.Column(db.Text, nullable=False, unique=True)
    nama = db.Column(db.Text, nullable=False)
    password = db.Column(db.Text, nullable=False)


    def __init__(self, nrp, nama, password):
        self.nrp = nrp
        self.nama = nama
        self.password = password

    def save(self):
        db.session.add(self)
        db.session.commit()
