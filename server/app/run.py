from flask import Flask
from app.config import db, migrate, jwt, Config, Api
from app.models import user, cart, animal, order, payment, farmer
from app.controllers.order_controller import OrderController, OrderControllerOne
from app.routes import auth_bp, animal_bp, user_bp, cart_bp, farmer_bp, order_bp, PaymentController, PaymentControllerOne

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
migrate.init_app(app, db)
api = Api(app)
jwt.init_app(app)

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
    app.run(debug=True, port=5555)

