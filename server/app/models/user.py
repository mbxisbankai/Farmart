from app.extensions import db  # Changed from 'from app import db'
from sqlalchemy_serializer import SerializerMixin
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    _password_hash = db.Column(db.String(512), nullable=False)
    role = db.Column(db.String(20), default="buyer")

    # Relationships
    animals = db.relationship("Animal", back_populates="user", cascade="all, delete-orphan")
    carts = db.relationship("Cart", back_populates="user", cascade="all, delete-orphan")
    orders = db.relationship("Order", back_populates="user", cascade="all, delete-orphan")
    payments = db.relationship("Payment", back_populates="user", cascade="all, delete-orphan")
    farmer = db.relationship("Farmer", back_populates="user", uselist=False)

    # Serializer rules
    serialize_rules = (
        "-_password_hash",
        "-animals.user",
        "-carts.user",
        "-orders.user",
        "-payments.user",
        "-farmer.user"
    )

    @property
    def password(self):
        raise AttributeError("Password is write-only")

    @password.setter
    def password(self, raw_password):
        self._password_hash = generate_password_hash(raw_password)

    def check_password(self, password_input):
        return check_password_hash(self._password_hash, password_input)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role
        }