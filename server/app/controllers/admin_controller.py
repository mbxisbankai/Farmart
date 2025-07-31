from flask import Blueprint, jsonify
from app.models import User, Animal, Order  # adjust if model is Purchase or Booking instead
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User
from app.config import db

admin_bp = Blueprint("admin_bp", __name__, url_prefix="/api/admin")


# GET all users
def get_all_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200

# GET a user by ID
def get_user_by_id(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict()), 200

# PATCH: Toggle admin role
def toggle_admin(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    user.role = "admin" if user.role != "admin" else "farmer"
    db.session.commit()
    return jsonify({"message": "User role updated", "role": user.role}), 200

# Optional admin-only decorator
def admin_required(func):
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or user.role != "admin":
            return jsonify({"error": "Admin access required"}), 403
        return func(*args, **kwargs)
    wrapper.__name__ = func.__name__
    return wrapper

@admin_bp.route("/summary", methods=["GET"])
@admin_required
def admin_summary():
    total_users = User.query.count()
    total_animals = Animal.query.count()
    total_orders = Order.query.count()  

    return jsonify({
        "total_users": total_users,
        "total_animals": total_animals,
        "total_orders": total_orders
    }), 200
