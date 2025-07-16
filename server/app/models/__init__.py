from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


from .user import User
from .farmer import Farmer
from .animal import Animal
from .cart import Cart
from .order import Order
from .payment import Payment


__all__ = ['db', 'User', 'Farmer', 'Animal', 'Cart', 'Order', 'Payment']
