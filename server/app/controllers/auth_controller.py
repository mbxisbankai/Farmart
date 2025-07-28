from flask import request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
    unset_jwt_cookies,
    set_access_cookies
)
from datetime import timedelta
from app.models.user import User
from app.extensions import db  # Fixed import
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


def register_user():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
            
        logger.debug(f"Registration data received: {data}")
        
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        role = data.get("role", "farmer")

        # Input validation
        if not all([username, email, password]):
            return jsonify({"error": "Missing required fields: username, email, and password"}), 400
        
        if len(password) < 6:
            return jsonify({"error": "Password must be at least 6 characters long"}), 400
            
        # Email format validation (basic)
        if "@" not in email or "." not in email:
            return jsonify({"error": "Invalid email format"}), 400

        # Check if user already exists
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Email already registered"}), 400
            
        if User.query.filter_by(username=username).first():
            return jsonify({"error": "Username already taken"}), 400

        # Create user and set password using the property setter
        user = User(username=username, email=email, role=role)
        user.password = password  # This triggers the @password.setter
        
        logger.debug(f"Password set via property. _password_hash exists: {user._password_hash is not None}")
        
        db.session.add(user)
        db.session.commit()
        
        logger.info(f"User registered successfully: {email}")
        return jsonify({
            "message": "User registered successfully",
            "user": user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Registration failed: {str(e)}")
        return jsonify({"error": "Registration failed. Please try again."}), 500


def login_user():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
            
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        user = User.query.filter_by(email=email).first()

        if not user or not user.check_password(password):
            logger.warning(f"Failed login attempt for email: {email}")
            return jsonify({"error": "Invalid credentials"}), 401

        # Create access token
        access_token = create_access_token(
            identity=str(user.id), 
            expires_delta=timedelta(days=1)
        )
        
        logger.info(f"User {user.email} logged in successfully")

        response = jsonify({
            "message": "Login successful",
            "user": user.to_dict()
        })
        set_access_cookies(response, access_token, max_age=86400)
        return response, 200
        
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({"error": "Login failed. Please try again."}), 500


@jwt_required()
def check_session():
    try:
        user_id_str = get_jwt_identity()
        logger.debug(f"Session check for user_id: {user_id_str}")
        
        if not user_id_str:
            return jsonify({"error": "Invalid token"}), 401
            
        user_id = int(user_id_str)
        user = User.query.get(user_id)
        
        if not user:
            logger.warning(f"Session check failed - user not found: {user_id}")
            return jsonify({"error": "User not found"}), 401
            
        return jsonify({
            "message": "Session valid",
            "user": user.to_dict()
        }), 200
        
    except ValueError:
        logger.error(f"Invalid user ID in token: {user_id_str}")
        return jsonify({"error": "Invalid token format"}), 401
    except Exception as e:
        logger.error(f"Session check error: {str(e)}")
        return jsonify({"error": "Session validation failed"}), 500


@jwt_required()
def logout_user():
    try:
        user_id = get_jwt_identity()
        logger.info(f"Logout request from user_id: {user_id}")

        response = jsonify({"message": "Logout successful"})
        unset_jwt_cookies(response)
        return response, 200
        
    except Exception as e:
        logger.error(f"Logout error: {str(e)}")
        return jsonify({"error": "Logout failed"}), 500

