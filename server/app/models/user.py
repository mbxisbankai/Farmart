from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

from app import db
from sqlalchemy.ext.hybrid import hybrid_property
from app.config import db, bcrypt


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(512), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)

    def __init__(self, username, email, is_admin=False):
        self.username = username
        self.email = email
        self.is_admin = is_admin


    @hybrid_property
    def password(self):
        return "Password hashes may not be viewed directly"
    
    @password.setter
    def password(self, plain_password):
        password_hash = bcrypt.generate_password_hash(plain_password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, plain_password):
        return bcrypt.check_password_hash(self._password_hash, plain_password.encode('utf-8'))
    
    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
        }

    carts = db.relationship('Cart', back_populates='user', lazy=True)
    orders = db.relationship("Order", back_populates="user", cascade="all, delete")
    payments = db.relationship("Payment", back_populates="user", cascade="all, delete")

