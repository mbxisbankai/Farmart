from app.config import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime
from app.models.order import Order

class Payment(db.Model, SerializerMixin):
    __tablename__ = "payments"
    serialize_rules = ("-order.payment",)

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    method = db.Column(db.String, nullable=False)
    status = db.Column(db.String, nullable=False, default="unpaid")
    created_at = db.Column(db.DateTime, default=datetime.now)

    order = db.relationship("Order", backref="payment")