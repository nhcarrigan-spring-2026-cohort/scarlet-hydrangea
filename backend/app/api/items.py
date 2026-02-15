from flask import Blueprint, jsonify, request
from app.crud import get_all_items, add_item, get_item_by_id

items_bp = Blueprint('items', __name__)

@items_bp.route('/tools', methods=['GET'])
def get_items_endpoint():
    items = get_all_items()
    response = {'tools': [
        {
            'id': item.id,
            'name':item.name,
            'description': item.description,
            'category': item.category,
            'owner_id': item.owner_id,
            'available': item.is_available,
            'total_quantity': item.total_quantity,
            'available_quantity': item.available_quantity,
            'condition': item.condition,
            'created_at': item.created_at,
            'updated_at': item.updated_at
        } for item in items]
    }
    print(response, items)
    if not items:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(response), 200

@items_bp.route('/tools', methods=['POST'])
def add_item_endpoint():
    data = request.get_json()
    item = add_item(
        data['name'],
        data['description'],
        data['category'],
        data['owner_id'],
        data['quantity'],
        data['condition']
    )
    return jsonify({
        'id': item.id,
        'name': item.name,
        'category': item.category,
        'owner_id': item.owner_id,
        'condition': item.condition
    })

@items_bp.route('/tools/<int:item_id>', methods=['GET'])
def get_item_endpoint(item_id):
    item = get_item_by_id(item_id)
    if not item:
        return jsonify({'error': 'Not found'}), 404
    return jsonify({
        'id': item.id,
        'name': item.name,
        'description': item.description,
        'category': item.category,
        'available': item.is_available,
        'condition': item.condition,
        'owner_id': item.owner_id
        }), 200
    