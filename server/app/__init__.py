from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .config import Config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    from app.models import user  # This ensures models are registered
    from app.controllers.auth_controller import auth_bp
    from app.routes.admin_routes import admin_bp  # ✅ Correct
    app.register_blueprint(admin_bp)
    app.register_blueprint(auth_bp)

    return app
