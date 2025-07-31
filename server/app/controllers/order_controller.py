from flask import jsonify
from app.extensions import db
from flask_jwt_extended import get_jwt_identity
from app.models.order import Order, Cart, Animal
from app.utils.core_controllers import CoreController, CoreControllerOne

class OrderController(CoreController):
    def __init__(self):
        super().__init__(Order)

class OrderControllerOne(CoreControllerOne):
    def __init__(self):
        super().__init__(Order)

# Function-based controllers for the routes
order_controller = OrderController()
order_controller_one = OrderControllerOne()

def create_order():
    user_id = get_jwt_identity()

    # Fetch all cart items for the user
    cart_items = Cart.query.filter_by(user_id=user_id).all()
    if not cart_items:
        return jsonify({"error": "Your cart is empty."}), 400

    orders_created = []

    for item in cart_items:
        animal = Animal.query.get(item.animal_id)
        if not animal:
            continue  # Skip missing animals

        total_price = animal.price * item.quantity

        new_order = Order(
            user_id=user_id,
            animal_id=animal.id,
            quantity=item.quantity,
            total_price=total_price,
            status="pending"  # or "processing"
        )

        db.session.add(new_order)
        orders_created.append({
            "animal_id": animal.id,
            "animal_name": animal.name,
            "quantity": item.quantity,
            "total_price": total_price
        })

    # Clear the cart
    Cart.query.filter_by(user_id=user_id).delete()
    db.session.commit()

    return jsonify({
        "message": "Order placed successfully",
        "orders": orders_created
    }), 201

def get_all_orders():
    return order_controller.get()

def get_order(order_id):
    return order_controller_one.get(order_id)

def update_order_status(order_id):
    return order_controller_one.patch(order_id)

def delete_order(order_id):
    return order_controller_one.delete(order_id)
