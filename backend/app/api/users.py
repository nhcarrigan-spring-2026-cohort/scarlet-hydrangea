from flask import Blueprint, jsonify, request
from app.crud import create_user, get_all_users, get_user

users_bp = Blueprint('users', __name__)

'''
/api/users route
'''
@users_bp.route('/users', methods=['GET'])
def get_users_endpoint():
    users = get_all_users()
    return jsonify(users), 200

@users_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user_endpoint(user_id):
    user = get_user(user_id)
    if not user:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(user), 200

@users_bp.route('/users', methods=['POST'])
def create_user_endpoint():
    data = request.get_json()
    user = create_user(data['username'], data['full_name'], data['email'], data['password'])
    return jsonify({
        'id': user.id, 'email': user.email
    }), 201

