from app.models.payment import Payment
from app.models.order import Order
from app.extensions import db
from app.services.email_service import send_order_confirmation
from datetime import datetime

def pay_order(order_id, payment_data):
    order = Order.query.get(order_id)

    if not order:
        return {"error": "Order not found"}, 404

    if order.status == "paid":
        return {"error": "Order already paid"}, 400

    if payment_data.get("amount") != order.total_amount:
        return {"error": "Incorrect payment amount"}, 400

    payment = Payment(
        amount=payment_data.get("amount"),
        method=payment_data.get("method"),
        order_id=order.id,
        paid_at=datetime.now()
    )

    order.status = "paid"

    db.session.add(payment)
    db.session.commit()

    # Send email after successful payment
    subject = f"Order #{order.id} Confirmation"
    html_content = f"""
        <h2>Hi {order.user.username},</h2>
        <p>Thank you for your payment of KES {order.total_amount:.2f}.</p>
        <p>Your order #{order.id} has been confirmed and is being processed.</p>
        <p>We'll notify you once it's ready for delivery.</p>
    """
    send_order_confirmation(order.user.email, subject, html_content)

    return payment.to_dict(), 201
