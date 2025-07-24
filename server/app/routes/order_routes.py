from flask import Blueprint, jsonify, session, request
from app.models import db, Cart, Order, Payment
from datetime import datetime
from app.services.payment_service import pay_order
from app.utils.email import send_order_confirmation

order_bp = Blueprint('order_bp', __name__)

@order_bp.route("/checkout", methods=["POST"])
def checkout_order():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    cart_items = Cart.query.filter_by(user_id=user_id).all()
    if not cart_items:
        return jsonify({"error": "Your cart is empty."}), 400

    total = sum(item.animal.price for item in cart_items)

    new_order = Order(
        total_amount=total,
        status="pending",
        user_id=user_id,
        created_at=datetime.now()
    )
    db.session.add(new_order)
    db.session.flush()

    summary_lines = []
    for item in cart_items:
        item.animal.order_id = new_order.id
        summary_lines.append(f"- {item.animal.name}: ${item.animal.price}")
        db.session.delete(item)

    order_summary = f"""
    Order ID: {new_order.id}
    Date: {new_order.created_at.strftime('%Y-%m-%d %H:%M')}
    Items:
    {chr(10).join(summary_lines)}
    
    Total: ${total}
    """

    payment = Payment(
        order_id=new_order.id,
        user_id=user_id,
        method="M-Pesa",
        status="unpaid"
    )
    db.session.add(payment)
    db.session.commit()

    from app.models import User
    user = User.query.get(user_id)
    if user and user.email:
        send_order_confirmation(user.email, order_summary)

    return jsonify({"message": "Order successfully created", "order_id": new_order.id}), 201

@order_bp.route("/my-orders", methods=["GET"])
def get_my_orders():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    orders = Order.query.filter_by(user_id=user_id).all()
    return jsonify([order.to_dict() for order in orders]), 200

@order_bp.route("/orders/<int:order_id>/pay", methods=["POST"])
def pay_order_route(order_id):
    data = request.get_json()
    return pay_order(order_id, data)

