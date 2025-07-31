from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.cart import Cart
from app.models.animal import Animal
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
            "image": animal.picture_url,  # static path
            "price": animal.price,
        })

    return jsonify(result), 200

# === ADD animal to cart ===
@cart_bp.route("/", methods=["POST"])
@jwt_required()
def add_to_cart():
    data = request.get_json()
    user_id = get_jwt_identity()
    animal_id = data.get("animal_id")

    if not animal_id:
        return jsonify({"error": "Animal ID is required"}), 400

    if not Animal.query.get(animal_id):
        return jsonify({"error": "Animal not found"}), 404

    # Check if already in cart
    existing = Cart.query.filter_by(user_id=user_id, animal_id=animal_id).first()
    if existing:
        return jsonify({"message": "Animal already in cart"}), 200

    new_item = Cart(user_id=user_id, animal_id=animal_id)
    db.session.add(new_item)
    db.session.commit()

    return jsonify({"message": "Animal added to cart"}), 201

# === REMOVE from cart by animal_id ===
@cart_bp.route("/", methods=["DELETE"])
@jwt_required()
def remove_from_cart():
    user_id = get_jwt_identity()
    data = request.get_json()
    animal_id = data.get("animal_id")

    if not animal_id:
        return jsonify({"error": "Animal ID is required"}), 400

    cart_item = Cart.query.filter_by(user_id=user_id, animal_id=animal_id).first()

    if not cart_item:
        return jsonify({"error": "Cart item not found"}), 404

    db.session.delete(cart_item)
    db.session.commit()
    return jsonify({"message": "Animal removed from cart"}), 200


# === CLEAR entire cart ===
@cart_bp.route("/clear", methods=["DELETE"])
@jwt_required()
def clear_cart():
    user_id = get_jwt_identity()
    Cart.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    return jsonify({"message": "Cart cleared"}), 200
