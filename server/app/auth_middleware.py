from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from functools import wraps
from flask import jsonify
from app.models.user import User

def jwt_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            return func(*args, **kwargs)
        except Exception:
            return jsonify({"error": "Token is missing or invalid"}), 401
    return wrapper

def role_required(required_role):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                verify_jwt_in_request()
                user_id = get_jwt_identity()
                user = User.query.get(user_id)
                if not user:
                    return jsonify({"error": "User not found"}), 404
                if user.role != required_role:
                    return jsonify({"error": f"{required_role.capitalize()} access required"}), 403
                return func(*args, **kwargs)
            except Exception as e:
                return jsonify({"error": str(e)}), 401
        return wrapper
    return decorator

def admin_required(func):
    return role_required("admin")(func)
