from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from flask import jsonify
from app.models.user import User

def role_required(*allowed_roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = User.query.get(user_id)

            if not user:
                return jsonify({"error": "Unauthorized"}), 401

            if user.role not in allowed_roles:
                return jsonify({"error": f"Access forbidden for role '{user.role}'"}), 403

            return fn(*args, **kwargs)
        return wrapper
    return decorator

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'message': 'Token is missing or invalid'}), 401
    return decorated
