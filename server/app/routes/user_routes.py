from flask import Blueprint, request, jsonify
from models.user import User
from models import db

user_bp = Blueprint('user_bp', __name__, url_prefix='/users')


@user_bp.route('/', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200


@user_bp.route('/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get_or_404(id)
    return jsonify(user.to_dict()), 200


@user_bp.route('/', methods=['POST'])
def create_user():
    data = request.get_json()
    try:
        new_user = User(
            username=data['username'],
            email=data['email'],
            password=data['password']  
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify(new_user.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@user_bp.route('/<int:id>', methods=['PATCH'])
def update_user(id):
    user = User.query.get_or_404(id)
    data = request.get_json()

    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    user.password = data.get('password', user.password)  

    db.session.commit()
    return jsonify(user.to_dict()), 200


@user_bp.route('/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted'}), 200
