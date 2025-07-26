from flask import jsonify
from app.models import User  # Adjust the import if your User model is elsewhere
from app.extensions import db    # Ensure this points to your SQLAlchemy instance

def get_all_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200

def get_user_by_id(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict()), 200

def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200
