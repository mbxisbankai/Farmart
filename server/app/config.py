import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask core config
    SECRET_KEY = os.getenv('SECRET_KEY', 'default-secret-key')
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    DEBUG = os.getenv('DEBUG', True)

    # SQLAlchemy config
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_URI', 'sqlite:///dev.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT config
    JWT_SECRET_KEY = os.getenv("JWT_SECRET", "super-secret-jwt-key")
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # seconds (1 hour)

    # Upload config
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'app', 'static', 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # Max file size: 16MB
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

    # CORS
    CORS_HEADERS = 'Content-Type'
