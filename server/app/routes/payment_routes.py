from flask import Blueprint
from app.controllers.payment_controller import (
    make_payment, get_all_payments, get_payment_by_id, checkout_payment
)
from app.auth_middleware import jwt_required

payment_bp = Blueprint("payment", __name__, url_prefix="/api/payments")

payment_bp.route("/", methods=["POST"])(jwt_required(make_payment))
payment_bp.route("/", methods=["GET"])(jwt_required(get_all_payments))
payment_bp.route("/<int:payment_id>", methods=["GET"])(jwt_required(get_payment_by_id))
payment_bp.route("/checkout", methods=["POST"])(jwt_required(checkout_payment))