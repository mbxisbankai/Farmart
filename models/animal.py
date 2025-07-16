from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

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

    farmer_id = db.Column(db.Integer, db.ForeignKey('farmers.id'), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "breed": self.breed,
            "age": self.age,
            "price": self.price,
            "type": self.type,
            "is_sold": self.is_sold,
            "farmer_id": self.farmer_id,
            "picture_url": self.picture_url  
        }
