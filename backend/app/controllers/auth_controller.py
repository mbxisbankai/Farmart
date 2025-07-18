from flask import request, jsonify
from app.models.user import User
from app import db
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required


# REGISTER
def register_user():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    is_admin = data.get("is_admin", False)  # 👈 Optional admin flag

    # Validation
    if not all([username, email, password]):
        return jsonify({"error": "Missing fields"}), 400

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({"error": "Username or email already taken"}), 409

    # Create user
    user = User(username=username, email=email, is_admin=is_admin)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


# LOGIN
def login_user():
    data = request.get_json()
    username_or_email = data.get("username_or_email")
    password = data.get("password")

    if not username_or_email or not password:
        return jsonify({"error": "Missing credentials"}), 400

    # Find user
    user = User.query.filter(
        (User.username == username_or_email) | (User.email == username_or_email)
    ).first()

    # Validate password
    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id)
        return jsonify({
            "message": "Login successful",
            "token": access_token,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_admin": user.is_admin
            }
        }), 200

    return jsonify({"error": "Invalid credentials"}), 401


@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_admin": user.is_admin
    }), 200