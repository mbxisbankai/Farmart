from flask import Blueprint
from app.controllers.auth_controller import register_user, login_user, get_profile

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

auth_bp.route("/register", methods=["POST"])(register_user)
auth_bp.route("/login", methods=["POST"])(login_user)
auth_bp.route("/user/profile", methods=["GET"])(get_profile)
