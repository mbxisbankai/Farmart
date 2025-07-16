from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

class Farmer(db.Model):
    __tablename__ = 'farmers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(120), nullable=False, unique=True)
    phone = db.Column(db.String(15), nullable=False, unique=True)

    animals = db.relationship('Animal', backref='farmer', lazy=True)
