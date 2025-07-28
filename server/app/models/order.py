from app.extensions import db
from datetime import datetime

class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    user = db.relationship("User", back_populates="orders")
    animals = db.relationship("Animal", back_populates="order", cascade="all, delete")
    payment = db.relationship("Payment", back_populates="order", uselist=False, cascade="all, delete")

    def to_dict(self):
        return {
            "id": self.id,
            "total_amount": self.total_amount,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "user_id": self.user_id
        }
