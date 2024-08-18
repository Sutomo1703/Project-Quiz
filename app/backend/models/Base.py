from datetime import datetime
from app import db


class BaseModel(db.Model):
    __abstract__ = True
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    createdBy = db.Column(db.Integer)
    createdAt = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    editedBy = db.Column(db.Integer)
    editdedAt = db.Column(db.DateTime(timezone=True), onupdate=datetime.utcnow)
