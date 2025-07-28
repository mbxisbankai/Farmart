import os
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from app.models import db, Animal, User

animal_bp = Blueprint("animal_bp", __name__, url_prefix="/api/animals")

UPLOAD_FOLDER = os.path.join("app", "static", "images", "animals")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# 🔍 Get all animals
@animal_bp.route("/", methods=["GET"])
def get_animals():
    animals = Animal.query.all()
    return jsonify([a.to_dict() for a in animals]), 200

# 🔍 Get one animal
@animal_bp.route("/<int:id>", methods=["GET"])
def get_animal(id):
    animal = Animal.query.get_or_404(id)
    return jsonify(animal.to_dict()), 200

# 🐮 Create animal (Farmer only)
@animal_bp.route("/", methods=["POST"])
@jwt_required()
def create_animal():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)

    if user.role != "farmer":
        return jsonify({"error": "Only farmers can upload animals"}), 403

    name = request.form.get("name")
    breed = request.form.get("breed")
    age = request.form.get("age")
    price = request.form.get("price")
    description = request.form.get("description")
    file = request.files.get("image")

    if not all([name, breed, age, price, file]):
        return jsonify({"error": "Missing required fields"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    # Save image
    filename = secure_filename(file.filename)
    image_path = os.path.join(UPLOAD_FOLDER, filename)
    os.makedirs(os.path.dirname(image_path), exist_ok=True)
    file.save(image_path)

    new_animal = Animal(
        name=name,
        breed=breed,
        age=int(age),
        price=float(price),
        description=description,
        image_url=f"/static/images/animals/{filename}",
        farmer_id=user.id,
    )
    db.session.add(new_animal)
    db.session.commit()
    return jsonify(new_animal.to_dict()), 201

# ✏️ Update (Farmer only + owner)
@animal_bp.route("/<int:id>", methods=["PATCH"])
@jwt_required()
def update_animal(id):
    animal = Animal.query.get_or_404(id)
    user_id = get_jwt_identity()

    if animal.farmer_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    name = request.form.get("name", animal.name)
    breed = request.form.get("breed", animal.breed)
    age = request.form.get("age", animal.age)
    price = request.form.get("price", animal.price)
    description = request.form.get("description", animal.description)
    file = request.files.get("image")

    if file:
        if not allowed_file(file.filename):
            return jsonify({"error": "Invalid image format"}), 400
        filename = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        animal.image_url = f"/static/images/animals/{filename}"

    animal.name = name
    animal.breed = breed
    animal.age = int(age)
    animal.price = float(price)
    animal.description = description

    db.session.commit()
    return jsonify(animal.to_dict()), 200

# 🗑️ Delete (Farmer only + owner)
@animal_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_animal(id):
    animal = Animal.query.get_or_404(id)
    user_id = get_jwt_identity()

    if animal.farmer_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(animal)
    db.session.commit()
    return jsonify({"message": "Animal deleted"}), 200
