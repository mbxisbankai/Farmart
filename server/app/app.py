from flask import Flask
from app.models.order import Order
from app.models.payment import Payment
from app.config import db, migrate, Config

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
migrate.init_app(app, db)

if __name__ == "__main__":
    app.run(debug=True, port=5555)
