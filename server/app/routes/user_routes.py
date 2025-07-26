from flask import Blueprint
from app.controllers.user_controller import (
    get_all_users, get_user_by_id, delete_user
)
from app.auth_middleware import admin_required

user_bp = Blueprint("user", __name__, url_prefix="/api/users")

@user_bp.route("/", methods=["GET"])
@admin_required
def get_all_users_route():
    return get_all_users()

@user_bp.route("/<int:user_id>", methods=["GET"])
@admin_required
def get_user_by_id_route(user_id):
    return get_user_by_id(user_id)

@user_bp.route("/<int:user_id>", methods=["DELETE"])
@admin_required
def delete_user_route(user_id):
    return delete_user(user_id)
