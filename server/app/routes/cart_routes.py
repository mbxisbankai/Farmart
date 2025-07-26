from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.cart import Cart
from app.models.animal import Animal
from app.models.user import User
from app.extensions import db

cart_bp = Blueprint("cart_bp", __name__, url_prefix="/api/cart")

# === GET all cart items for current user ===
@cart_bp.route("/", methods=["GET"])
@jwt_required()
def get_cart_items():
    user_id = get_jwt_identity()
    cart_items = Cart.query.filter_by(user_id=user_id).all()

    result = []
    for item in cart_items:
        animal = Animal.query.get(item.animal_id)
        result.append({
            "cart_id": item.id,
            "animal_id": animal.id,
            "animal_name": animal.name,
            "image": animal.image,  # static path
            "price": animal.price,
            "quantity": item.quantity
        })

    return jsonify(result), 200

# === ADD animal to cart ===
@cart_bp.route("/", methods=["POST"])
@jwt_required()
def add_to_cart():
    data = request.get_json()
    user_id = get_jwt_identity()
    animal_id = data.get("animal_id")
    quantity = data.get("quantity", 1)

    if not animal_id:
        return jsonify({"error": "Animal ID is required"}), 400

    if not Animal.query.get(animal_id):
        return jsonify({"error": "Animal not found"}), 404

    # Check if already in cart
    existing = Cart.query.filter_by(user_id=user_id, animal_id=animal_id).first()
    if existing:
        existing.quantity += quantity
    else:
        new_item = Cart(user_id=user_id, animal_id=animal_id, quantity=quantity)
        db.session.add(new_item)

    db.session.commit()
    return jsonify({"message": "Animal added to cart"}), 201

# === UPDATE cart item quantity ===
@cart_bp.route("/<int:cart_id>", methods=["PATCH"])
@jwt_required()
def update_cart_item(cart_id):
    user_id = get_jwt_identity()
    cart_item = Cart.query.get(cart_id)

    if not cart_item or cart_item.user_id != user_id:
        return jsonify({"error": "Cart item not found"}), 404

    data = request.get_json()
    quantity = data.get("quantity")

    if quantity is None or quantity < 1:
        return jsonify({"error": "Invalid quantity"}), 400

    cart_item.quantity = quantity
    db.session.commit()

    return jsonify({"message": "Cart item updated"}), 200

# === DELETE item from cart ===
@cart_bp.route("/<int:cart_id>", methods=["DELETE"])
@jwt_required()
def delete_cart_item(cart_id):
    user_id = get_jwt_identity()
    cart_item = Cart.query.get(cart_id)

    if not cart_item or cart_item.user_id != user_id:
        return jsonify({"error": "Cart item not found"}), 404

    db.session.delete(cart_item)
    db.session.commit()
    return jsonify({"message": "Cart item deleted"}), 200

# === CLEAR entire cart ===
@cart_bp.route("/clear", methods=["DELETE"])
@jwt_required()
def clear_cart():
    user_id = get_jwt_identity()
    Cart.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    return jsonify({"message": "Cart cleared"}), 200
