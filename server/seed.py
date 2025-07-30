from app import create_app
from app.extensions import db
from app.models import User, Farmer, Animal, Cart, Order, Payment

def seed_data():
    print("🌱 Seeding database...")

    # Drop and create tables
    db.drop_all()
    db.create_all()

    # Create users
    farmer_user = User(username="farmerjoe", email="joe@farm.com", role="farmer")
    farmer_user.password = "password123"

    buyer_user = User(username="janedoe", email="jane@buyer.com", role="buyer")
    buyer_user.password = "securepass"

    db.session.add_all([farmer_user, buyer_user])
    db.session.commit()

    # Create farmer profile
    farmer_profile = Farmer(
        user_id=farmer_user.id,
        farm_name="Green Pastures",
        location="Nairobi, Kenya",
        farm_type="Dairy"
    )
    db.session.add(farmer_profile)
    db.session.commit()

    # Create animal
    animal = Animal(
        name="Bella",
        breed="Friesian",
        age=3,
        price=75000,
        type="Cow",
        description="Healthy and fully vaccinated",
        picture_url="https://cdn.britannica.com/55/174255-050-526314B6/brown-Guernsey-cow.jpg",
        farmer_id=farmer_profile.id,
        user_id=None,  # not sold yet
        is_sold=False
    )
    db.session.add(animal)
    db.session.commit()

    # Add to cart
    cart = Cart(user_id=buyer_user.id, animal_id=animal.id)
    db.session.add(cart)
    db.session.commit()

    # Create order
    order = Order(
        total_amount=animal.price,
        status="pending",
        user_id=buyer_user.id
    )
    db.session.add(order)
    db.session.commit()

    # Link animal to order
    animal.order_id = order.id
    db.session.commit()

    # Create payment
    payment = Payment(
        order_id=order.id,
        user_id=buyer_user.id,
        farmer_id=farmer_profile.id,
        amount=animal.price,
        method="M-Pesa",
        status="paid"
    )
    db.session.add(payment)
    db.session.commit()

    print("✅ Done seeding!")


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        seed_data()
