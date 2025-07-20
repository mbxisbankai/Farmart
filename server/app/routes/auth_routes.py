from flask import Blueprint
from app.controllers.auth_controller import register_user, login_user, get_profile

auth_bp = Blueprint("auth", __name__)

auth_bp.route("/api/register", methods=["POST"])(register_user)
auth_bp.route("/api/login", methods=["POST"])(login_user)
auth_bp.route("/api/user/profile", methods=["GET"])(get_profile)