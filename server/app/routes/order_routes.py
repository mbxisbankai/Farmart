from flask import Blueprint
from app.controllers.order_controller import (
    create_order, get_all_orders, get_order, update_order_status, delete_order
)
from app.auth_middleware import jwt_required

order_bp = Blueprint("order", __name__, url_prefix="/api/orders")

order_bp.route("/", methods=["POST"])(jwt_required(create_order))
order_bp.route("/", methods=["GET"])(jwt_required(get_all_orders))
order_bp.route("/<int:order_id>", methods=["GET"])(jwt_required(get_order))
order_bp.route("/<int:order_id>", methods=["PATCH"])(jwt_required(update_order_status))
order_bp.route("/<int:order_id>", methods=["DELETE"])(jwt_required(delete_order))
