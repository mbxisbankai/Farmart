from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.extensions import db, migrate, jwt  # <-- Confirm these are defined in extensions.py

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)

    # Import models to register them with SQLAlchemy
    from app.models import (
    User, Animal, Cart,
    Farmer, Order, Payment
)
    # Register blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.animal_routes import animal_bp
    from app.routes.cart_routes import cart_bp
    from app.routes.farmer_routes import farmer_bp
    from app.routes.order_routes import order_bp
    from app.routes.payment_routes import payment_bp
    from app.routes.user_routes import user_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(animal_bp, url_prefix='/api/animals')
    app.register_blueprint(cart_bp, url_prefix='/api/cart')
    app.register_blueprint(farmer_bp, url_prefix="/api/farmers")
    app.register_blueprint(order_bp, url_prefix='/api/orders')
    app.register_blueprint(payment_bp, url_prefix='/api/payments')
    app.register_blueprint(user_bp, url_prefix='/api/users')

    return app
