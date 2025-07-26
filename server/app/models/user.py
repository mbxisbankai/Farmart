from app.extensions import db

from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    _password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='customer')

    # Relationships (if you have them)
    payments = db.relationship("Payment", back_populates="user", cascade="all, delete")
    carts = db.relationship('Cart', back_populates='user', cascade="all, delete-orphan")

    def __init__(self, username, email, password, role='customer'):
        self.username = username
        self.email = email
        self.password = password
        self.role = role

    @property
    def password(self):
        raise AttributeError("Password is write-only.")

    @password.setter
    def password(self, plaintext):
        self._password_hash = generate_password_hash(plaintext)

    def check_password(self, password):
        return check_password_hash(self._password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role
        }
