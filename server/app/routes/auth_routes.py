from flask import Blueprint
from app.controllers.auth_controller import register_user, login_user, get_profile
from flask_jwt_extended import jwt_required

auth_bp = Blueprint("auth_bp", __name__, url_prefix="/api/auth")

# Register route
@auth_bp.route("/register", methods=["POST"])
def register():
    return register_user()

# Login route
@auth_bp.route("/login", methods=["POST"])
def login():
    return login_user()

# Get user profile (protected)
@auth_bp.route("/user/profile", methods=["GET"])
@jwt_required()
def profile():
    return get_profile()
