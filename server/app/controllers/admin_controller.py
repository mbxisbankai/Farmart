from flask import Blueprint, jsonify
from app.models import User, Animal, Order  # adjust if model is Purchase or Booking instead
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User

admin_bp = Blueprint("admin_bp", __name__, url_prefix="/api/admin")

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
