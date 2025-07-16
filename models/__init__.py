from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


from .user import User
from .farmer import Farmer
from .animal import Animal
from .cart import Cart


__all__ = ['db', 'User', 'Farmer', 'Animal', 'Cart']
