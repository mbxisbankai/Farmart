from app.extensions import db

from datetime import datetime

class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    farmer_id = db.Column(db.Integer, db.ForeignKey("farmers.id"))  # NEW
    amount = db.Column(db.Float, nullable=False)
    method = db.Column(db.String, nullable=False)
    status = db.Column(db.String, nullable=False, default="unpaid")
    created_at = db.Column(db.DateTime, default=datetime.now)

    user = db.relationship("User", back_populates="payments")
    order = db.relationship("Order", back_populates="payment")
    farmer = db.relationship("Farmer", back_populates="payments")  # NEW

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "user_id": self.user_id,
            "farmer_id": self.farmer_id,
            "amount": self.amount,
            "method": self.method,
            "status": self.status,
            "created_at": self.created_at.isoformat()
        }
