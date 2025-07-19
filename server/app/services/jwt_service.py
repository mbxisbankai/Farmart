# services/jwt_service.py
from flask_jwt_extended import create_access_token, get_jwt_identity
from app.models.user import User

def generate_token(user_id):
    return create_access_token(identity=user_id)

def get_current_user():
    user_id = get_jwt_identity()
    return User.query.get(user_id)
