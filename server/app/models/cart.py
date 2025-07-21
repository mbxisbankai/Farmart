from app.config import db

class Cart(db.Model):
    __tablename__ = 'carts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    animal_id = db.Column(db.Integer, db.ForeignKey('animals.id'), nullable=False)

    user = db.relationship('User', back_populates='carts')
    animal = db.relationship('Animal', back_populates='carts')

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "animal_id": self.animal_id,
            "animal": self.animal.to_dict() if self.animal else None
    }

    __table_args__ = (
        db.UniqueConstraint('user_id', 'animal_id', name='unique_cart_item'),
    )