from flask import Flask
from app.config import db, migrate, Config
from app.models import user, cart, animal, order, payment, farmer

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
migrate.init_app(app, db)

if __name__ == "__main__":
    app.run(debug=True, port=5555)
