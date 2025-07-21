from app.models.cart import Cart
from app.models.order import Order
from app.config import db

def checkout_cart(user_id):
    cart = Cart.query.filter_by(user_id=user_id).first()
    if not cart or not cart.animals:
        raise Exception("Cart is empty")

    total_amount = sum(animal.price for animal in cart.animals)

    order = Order(
        user_id=user_id,
        total_amount=total_amount,
        status="pending"
    )
    db.session.add(order)
    db.session.flush()

    for animal in cart.animals:
        animal.order = order

    cart.animals.clear()
    db.session.commit()
    return order
