from app import create_app
from app.extensions import db
from app.models import User, Animal, Order

def create_test_order():
    print("🛒 Creating test order for existing animals...")

    buyer = User.query.filter_by(role="buyer").first()
    if not buyer:
        print("❌ No buyer found.")
        return

    animal = Animal.query.first()
    if not animal:
        print("❌ No animals found.")
        return

    order = Order(
        total_amount=animal.price,
        status="pending",
        user_id=buyer.id
    )
    order.animals.append(animal)

    db.session.add(order)
    db.session.commit()
    print("✅ Order created and animal linked.")

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        create_test_order()
