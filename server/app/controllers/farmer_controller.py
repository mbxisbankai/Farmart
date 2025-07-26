# filepath: /home/elder/Farmart-backup/server/app/controllers/farmer_controller.py
from flask import jsonify

def create_farmer():
    return jsonify({"message": "Create farmer"}), 201

def get_all_farmers():
    return jsonify([]), 200

def get_farmer(farmer_id):
    return jsonify({"id": farmer_id}), 200

def update_farmer(farmer_id):
    return jsonify({"message": "Update farmer"}), 200

def delete_farmer(farmer_id):
    return jsonify({"message": "Delete farmer"}), 200