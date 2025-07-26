from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename
from app.models.animal import Animal, db
from app.utils.decorators import token_required
from PIL import Image

import os
import io
import uuid

animal_bp = Blueprint('animal_bp', __name__, url_prefix='/animals')

UPLOAD_FOLDER = os.path.join('static', 'uploads', 'animals')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# 🔹 GET ALL animals with filters + pagination
@animal_bp.route('/', methods=['GET'])
def get_animals():
    query = Animal.query

    # Filters
    breed = request.args.get('breed')
    age = request.args.get('age')
    animal_type = request.args.get('type')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))

    if breed:
        query = query.filter_by(breed=breed)
    if age:
        query = query.filter_by(age=int(age))
    if animal_type:
        query = query.filter_by(type=animal_type)

    paginated = query.paginate(page=page, per_page=per_page, error_out=False)
    animals = [animal.to_dict() for animal in paginated.items]

    return jsonify({
        "animals": animals,
        "total": paginated.total,
        "page": page,
        "per_page": per_page
    }), 200

# 🔹 GET single animal
@animal_bp.route('/<int:id>', methods=['GET'])
def get_animal(id):
    animal = Animal.query.get_or_404(id)
    return jsonify(animal.to_dict()), 200

# 🔹 CREATE animal
@animal_bp.route('/', methods=['POST'])
@token_required
def create_animal(current_user):
    if 'picture' not in request.files:
        return jsonify({'error': 'Picture file is required'}), 400

    file = request.files['picture']
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file format'}), 400

    filename = secure_filename(f"{uuid.uuid4().hex}_{file.filename}")
    filepath = os.path.join(UPLOAD_FOLDER, filename)

    try:
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        image = Image.open(file)
        image = image.convert("RGB")
        image = image.resize((600, 400))
        image.save(filepath)

        # Get fields
        name = request.form.get('name')
        breed = request.form.get('breed')
        age = request.form.get('age')
        price = request.form.get('price')
        animal_type = request.form.get('type')

        if not all([name, breed, age, price, animal_type]):
            return jsonify({'error': 'Missing required fields'}), 400

        new_animal = Animal(
            name=name,
            breed=breed,
            age=int(age),
            price=float(price),
            type=animal_type,
            picture_url=f"/{filepath}",
            farmer_id=current_user.id
        )

        db.session.add(new_animal)
        db.session.commit()

        return jsonify(new_animal.to_dict()), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 🔹 UPDATE animal (including image)
@animal_bp.route('/<int:id>', methods=['PATCH'])
@token_required
def update_animal(current_user, id):
    animal = Animal.query.get_or_404(id)

    if animal.farmer_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    # JSON fields
    data = request.form.to_dict()
    for field in ['name', 'breed', 'age', 'price', 'type', 'is_sold']:
        if field in data:
            setattr(animal, field, data[field])

    # New image
    if 'picture' in request.files:
        file = request.files['picture']
        if file and allowed_file(file.filename):
            filename = secure_filename(f"{uuid.uuid4().hex}_{file.filename}")
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            image = Image.open(file)
            image = image.convert("RGB")
            image = image.resize((600, 400))
            image.save(filepath)
            animal.picture_url = f"/{filepath}"

    db.session.commit()
    return jsonify(animal.to_dict()), 200

# 🔹 DELETE animal
@animal_bp.route('/<int:id>', methods=['DELETE'])
@token_required
def delete_animal(current_user, id):
    animal = Animal.query.get_or_404(id)

    if animal.farmer_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    db.session.delete(animal)
    db.session.commit()
    return jsonify({'message': 'Animal deleted successfully'}), 200

# 🔹 Serve uploaded images
@animal_bp.route('/images/<filename>', methods=['GET'])
def get_uploaded_image(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)
