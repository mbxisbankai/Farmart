from app.config import db
from sqlalchemy_serializer import SerializerMixin

class Animal(db.Model, SerializerMixin):
    __tablename__ = 'animals'
    serialize_rules = ("-farmer.animals", "-order.animals", "-carts.animal")

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
