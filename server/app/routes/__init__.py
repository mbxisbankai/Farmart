from flask import Flask
from app.routes.auth_routes import auth_bp
from app.routes.animal_routes import animal_bp
from app.routes.cart_routes import cart_bp
from app.routes.farmer_routes import farmer_bp
from app.routes.order_routes import order_bp
from app.routes.payment_routes import payment_bp
from app.routes.user_routes import user_bp

def register_blueprints(app: Flask):
    app.register_blueprint(auth_bp)
    app.register_blueprint(animal_bp)
    app.register_blueprint(cart_bp)
    # app.register_blueprint(farmer_bp)
    app.register_blueprint(order_bp)
    app.register_blueprint(payment_bp)
    app.register_blueprint(user_bp)
