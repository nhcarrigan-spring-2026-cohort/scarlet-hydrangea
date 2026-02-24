from flask import Blueprint, jsonify, request
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError
from src.extensions import db
from app.crud import get_all_items, add_item, get_item_by_id
from app.schemas import ItemSchema

items_bp = Blueprint('items', __name__)

'''
/api/tools route
'''
@items_bp.route('/tools', methods=['GET'])
def get_items_endpoint():
    items = get_all_items()
    schema = ItemSchema(many=True)
    return jsonify(schema.dump(items)), 200

@items_bp.route('/tools', methods=['POST'])
def add_item_endpoint():
    raw_data = request.get_json()
    
    if not raw_data:
        return jsonify({'error': 'Request body is required'}), 400      # Bad Request
    
    schema = ItemSchema()
    try:
        data = schema.load(raw_data)
    except ValidationError as err:
        return jsonify({'error': err.messages}), 400
    
    try:
        item = add_item(**data)     # Unpacking data dictionary to function kwargs
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Invalid owner_id - user does not exist'}), 400      # Bad Request - user id not found
    
    return jsonify(ItemSchema().dump(item)), 201

@items_bp.route('/tools/<int:item_id>', methods=['GET'])
def get_item_endpoint(item_id):
    item = get_item_by_id(item_id)
    if not item:
        return jsonify({'error': 'Tool not found'}), 404
    schema = ItemSchema()
    return jsonify(schema.dump(item)), 200