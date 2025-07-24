from app import create_app
from app.config import Config
from app.models import user, cart, animal, order, payment, farmer

from app.controllers.order_controller import OrderController, OrderControllerOne
from app.routes import (
    animal_bp, user_bp, cart_bp, farmer_bp, order_bp,
    PaymentController, PaymentControllerOne
)
from app.routes.auth_routes import auth_bp
from flask_restful import Api

app = create_app()
app.config.from_object(Config)

api = Api(app)

app.register_blueprint(animal_bp)
app.register_blueprint(user_bp)
app.register_blueprint(cart_bp)
app.register_blueprint(farmer_bp)
app.register_blueprint(order_bp)
app.register_blueprint(auth_bp)


api.add_resource(OrderController, '/orders')
api.add_resource(OrderControllerOne, '/order/<int:id>')
api.add_resource(PaymentController, '/payments')
api.add_resource(PaymentControllerOne, '/payment/<int:id>')

if __name__ == "__main__":
    app.run(debug=True, port=5000)
