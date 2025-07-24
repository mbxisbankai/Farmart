import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db

from app.models import User, Farmer, Animal, Order, Payment, Cart

app = create_app()

with app.app_context():
    print("Dropping and creating tables...")
    db.drop_all()
    db.create_all()

    print("Seeding farmers...")
    farmer1 = Farmer(name="John Doe", email="john@farm.com", phone="0712345678")
    farmer2 = Farmer(name="Jane Smith", email="jane@farm.com", phone="0798765432")
    db.session.add_all([farmer1, farmer2])
    db.session.commit()

    print("Seeding users...")
    user1 = User(username="user1", email="user1@example.com")
    user1.password = "hashedpassword1"
    user2 = User(username="user2", email="user2@example.com")
    user2.password = "hashedpassword2"
    db.session.add_all([user1, user2])
    db.session.commit()

    print("Seeding animals...")
    animal1 = Animal(name="Bessie", breed="Holstein", age=3, price=1000.0, type="Cow", farmer_id=farmer1.id)
    animal2 = Animal(name="Clucky", breed="Leghorn", age=1, price=100.0, type="Chicken", farmer_id=farmer2.id)
    db.session.add_all([animal1, animal2])
    db.session.commit()

    print("Seeding orders...")
    order1 = Order(user_id=user1.id, total_amount=1100.0, status="Processing")
    db.session.add(order1)
    db.session.commit()

    print("Linking animals to orders...")
    animal1.order_id = order1.id
    db.session.commit()

    print("Seeding payments...")
    payment1 = Payment(user_id=order1.user.id, order_id=order1.id, amount=100, method="M-Pesa", status="Paid")
    db.session.add(payment1)
    db.session.commit()

    print("Seeding carts...")
    cart1 = Cart(user_id=user2.id, animal_id=animal2.id)
    db.session.add(cart1)
    db.session.commit()

    print("Adding user with ID 3 and cart item...")
    user3 = User(username="Pauline", email="user3@example.com")
    user3.password = "testing"
    db.session.add(user3)
    db.session.commit()

    # Add a cart item for user3
    animal_for_cart = Animal.query.filter_by(is_sold=False).first()
    if animal_for_cart:
        cart_for_user3 = Cart(user_id=user3.id, animal_id=animal_for_cart.id)
        db.session.add(cart_for_user3)
        db.session.commit()

    print("Seeding complete ✅")
