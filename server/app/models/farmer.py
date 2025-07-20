from sqlalchemy_serializer import SerializerMixin
from app.config import db

class Farmer(db.Model, SerializerMixin):
    __tablename__ = 'farmers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(120), nullable=False, unique=True)
    phone = db.Column(db.String(15), nullable=False, unique=True)

    animals = db.relationship('Animal', back_populates='farmer', lazy=True)
