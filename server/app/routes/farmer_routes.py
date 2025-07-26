from flask import Blueprint, jsonify
from app.controllers.farmer_controller import get_all_farmers, create_farmer
from flask_jwt_extended import jwt_required
from app.auth_middleware import role_required

farmer_bp = Blueprint("farmer", __name__)

@farmer_bp.route("/test")
def test():
    return jsonify({"message": "farmer test"})

@farmer_bp.route("/", methods=["GET"])
def get_all():
    return get_all_farmers()

@farmer_bp.route("/", methods=["POST"])
@jwt_required
@role_required('farmer')
def create():
    return create_farmer()
