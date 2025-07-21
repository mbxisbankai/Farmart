from app.config import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

class Order(db.Model, SerializerMixin):
    __tablename__ = "orders"
    serialize_rules = ("-user.orders", "-animals.order", "-payment.order")
    
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    user = db.relationship("User", back_populates="orders")
    animals = db.relationship("Animal", back_populates="order")
    payment = db.relationship("Payment", back_populates="order", uselist=False, cascade="all, delete")
