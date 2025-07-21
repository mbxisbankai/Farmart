from app.config import db

class Animal(db.Model):
    __tablename__ = 'animals'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    breed = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer)
    price = db.Column(db.Float)
    type = db.Column(db.String(50)) 
    is_sold = db.Column(db.Boolean, default=False)
    picture_url = db.Column(db.String(255)) 

    farmer_id = db.Column(db.Integer, db.ForeignKey("farmers.id"), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=True)

    carts = db.relationship('Cart', back_populates='animal', cascade='all, delete')
    farmer = db.relationship("Farmer", back_populates="animals")
    order = db.relationship("Order", back_populates="animals")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "breed": self.breed,
            "age": self.age,
            "price": self.price,
            "type": self.type,
            "is_sold": self.is_sold,
            "picture_url": self.picture_url,
            "farmer_id": self.farmer_id,
            "order_id": self.order_id,
            "farmer": {"id": self.farmer.id, "name": self.farmer.name} if self.farmer else None
    }

