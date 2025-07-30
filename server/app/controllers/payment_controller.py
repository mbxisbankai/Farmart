from flask import request, jsonify
from app.models import Payment  # Ensure this model is defined correctly
from app.extensions import db     # Ensure `db` is the SQLAlchemy instance from config
from datetime import datetime, UTC
from flask_jwt_extended import jwt_required, get_jwt_identity

# Create a new payment
def make_payment():
    data = request.get_json()
    try:
        new_payment = Payment(
            user_id=data["user_id"],
            amount=data["amount"],
            method=data["method"],
            status="pending",
            timestamp=datetime.now(UTC)
        )
        db.session.add(new_payment)
        db.session.commit()
        return jsonify({"message": "Payment created", "payment": new_payment.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# Get all payments
def get_all_payments():
    payments = Payment.query.all()
    return jsonify([payment.to_dict() for payment in payments]), 200


# Get payment by ID
def get_payment_by_id(payment_id):
    payment = Payment.query.get(payment_id)
    if not payment:
        return jsonify({"error": "Payment not found"}), 404
    return jsonify(payment.to_dict()), 200


@jwt_required()
def checkout_payment():
    data = request.get_json()
    user_id = get_jwt_identity()
    try:
        new_payment = Payment(
            user_id=user_id,
            amount=data["amount"],
            method=data["method"],
            status="completed",
            timestamp=datetime.now(UTC)
        )
        db.session.add(new_payment)
        db.session.commit()
        return jsonify({"message": "Checkout successful", "payment": new_payment.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
