from app.extensions import db


class Farmer(db.Model):
    __tablename__ = 'farmers'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    farm_name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(120), nullable=True)
    farm_type = db.Column(db.String(100), nullable=True)

    # Relationships
    user = db.relationship("User", back_populates="farmer")
    animals = db.relationship("Animal", back_populates="farmer", cascade="all, delete-orphan")
    payments = db.relationship("Payment", back_populates="farmer", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "username": self.user.username if self.user else None,
            "email": self.user.email if self.user else None,
            "farm_name": self.farm_name,
            "location": self.location,
            "farm_type": self.farm_type,
            "animals": [animal.to_dict() for animal in self.animals],
            "payments": [payment.to_dict() for payment in self.payments]
        }
