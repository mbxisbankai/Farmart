from flask import Blueprint, request, jsonify
from models.farmer import Farmer
from models import db

farmer_bp = Blueprint('farmer_bp', __name__, url_prefix='/farmers')


@farmer_bp.route('/', methods=['GET'])
def get_farmers():
    farmers = Farmer.query.all()
    return jsonify([f.to_dict() for f in farmers]), 200


@farmer_bp.route('/<int:id>', methods=['GET'])
def get_farmer(id):
    farmer = Farmer.query.get_or_404(id)
    return jsonify(farmer.to_dict()), 200


@farmer_bp.route('/', methods=['POST'])
def create_farmer():
    data = request.get_json()
    try:
        new_farmer = Farmer(
            name=data['name'],
            email=data['email'],
            phone=data['phone']
        )
        db.session.add(new_farmer)
        db.session.commit()
        return jsonify(new_farmer.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@farmer_bp.route('/<int:id>', methods=['PATCH'])
def update_farmer(id):
    farmer = Farmer.query.get_or_404(id)
    data = request.get_json()

    farmer.name = data.get('name', farmer.name)
    farmer.email = data.get('email', farmer.email)
    farmer.phone = data.get('phone', farmer.phone)

    db.session.commit()
    return jsonify(farmer.to_dict()), 200

@farmer_bp.route('/<int:id>', methods=['DELETE'])
def delete_farmer(id):
    farmer = Farmer.query.get_or_404(id)
    db.session.delete(farmer)
    db.session.commit()
    return jsonify({'message': 'Farmer deleted'}), 200
