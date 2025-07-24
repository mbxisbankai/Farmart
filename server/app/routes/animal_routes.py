from flask import Blueprint, request, jsonify
from app.models.animal import Animal, db
from PIL import Image
import cloudinary.uploader
import io
from werkzeug.utils import secure_filename 

animal_bp = Blueprint('animal_bp', __name__, url_prefix='/animals')

@animal_bp.route('/', methods=['GET'])
def get_animals():
    query = Animal.query
    breed = request.args.get('breed')
    age = request.args.get('age')
    animal_type = request.args.get('type')

    if breed:
        query = query.filter_by(breed=breed)
    if age:
        query = query.filter_by(age=int(age))
    if animal_type:
        query = query.filter_by(type=animal_type)

    animals = [animal.to_dict() for animal in query.all()]
    return jsonify(animals), 200

@animal_bp.route('/<int:id>', methods=['GET'])
def get_animal(id):
    animal = Animal.query.get_or_404(id)
    return jsonify(animal.to_dict()), 200


@animal_bp.route('/', methods=['POST'])
def create_animal():
    if 'picture' not in request.files:
        return jsonify({'error': 'Picture file is required'}), 400

    file = request.files['picture']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        
        image = Image.open(file)
        image = image.convert("RGB")
        image = image.resize((600, 400))

        buffer = io.BytesIO()
        image.save(buffer, format='JPEG')
        buffer.seek(0)

    
        upload_result = cloudinary.uploader.upload(
            buffer,
            folder="farmart/animals",
            public_id=secure_filename(file.filename.rsplit('.', 1)[0]),
            overwrite=True,
            resource_type="image"
        )

    
        name = request.form.get('name')
        breed = request.form.get('breed')
        age = request.form.get('age')
        price = request.form.get('price')
        animal_type = request.form.get('type')
        farmer_id = request.form.get('farmer_id')

        if not all([name, breed, age, price, animal_type, farmer_id]):
            return jsonify({'error': 'Missing required fields'}), 400

        new_animal = Animal(
            name=name,
            breed=breed,
            age=int(age),
            price=float(price),
            type=animal_type,
            farmer_id=int(farmer_id),
            picture_url=upload_result['secure_url']
        )
        db.session.add(new_animal)
        db.session.commit()

        return jsonify(new_animal.to_dict()), 201

    except Exception as e:
        return jsonify({'error': f'Image processing failed: {str(e)}'}), 500


@animal_bp.route('/<int:id>', methods=['PATCH'])
def update_animal(id):
    animal = Animal.query.get_or_404(id)
    data = request.get_json()

    for field in ['name', 'breed', 'age', 'price', 'type', 'is_sold']:
        if field in data:
            setattr(animal, field, data[field])

    db.session.commit()
    return jsonify(animal.to_dict()), 200


@animal_bp.route('/<int:id>', methods=['DELETE'])
def delete_animal(id):
    animal = Animal.query.get_or_404(id)
    db.session.delete(animal)
    db.session.commit()
    return jsonify({'message': 'Animal deleted successfully'}), 200
