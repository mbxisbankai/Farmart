from flask import Blueprint, request, make_response
from flask_jwt_extended import jwt_required

from app.controllers.admin_controller import (
    get_all_users,
    get_user_by_id,
    toggle_admin
)
from app.utils.decorators import admin_required

admin_bp = Blueprint("admin_bp", __name__, url_prefix="/api/admin")

# ✅ GET /api/admin/users — Get all users
@admin_bp.route("/users", methods=["GET", "OPTIONS"])
def all_users():
    if request.method == "OPTIONS":
        return make_response("", 200)
    
@jwt_required()
@admin_required
def all_users():
    return get_all_users()

# ✅ GET /api/admin/users/<id> — Get a single user by ID
@admin_bp.route("/users/<int:user_id>", methods=["GET", "OPTIONS"])
def single_user(user_id):
    if request.method == "OPTIONS":
        return make_response("", 200)
    
@jwt_required()
@admin_required
def single_user(user_id):
    return get_user_by_id(user_id)

# ✅ PATCH /api/admin/users/<id>/toggle-admin — Promote or demote user to/from admin
@admin_bp.route("/users/<int:user_id>/toggle-admin", methods=["PATCH", "OPTIONS"])
def make_admin(user_id):
    if request.method == "OPTIONS":
        return make_response("", 200)
    
@jwt_required()
@admin_required
def make_admin(user_id):
    return toggle_admin(user_id)
