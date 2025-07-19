# utils/decorators.py
from functools import wraps
from flask_jwt_extended import verify_jwt_in_request
from flask import jsonify
from app.models.user import User
from flask_jwt_extended import get_jwt_identity

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        user = User.query.get(get_jwt_identity())
        if not user or not user.is_admin:
            return jsonify({"error": "Admins only"}), 403
        return fn(*args, **kwargs)
    return wrapper
