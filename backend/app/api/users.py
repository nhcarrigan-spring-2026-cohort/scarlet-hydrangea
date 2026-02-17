from flask import Blueprint, jsonify, request
from app.crud import get_all_users, get_user, create_user

users_bp = Blueprint('users', __name__)

'''
/api/users route
'''
@users_bp.route('/users', methods=['GET'])
def get_users_endpoint():
    users = get_all_users()
    return jsonify(users), 200

@users_bp.route('/users', methods=['POST'])
def create_user_endpoint():
    data = request.get_json()
    user = create_user(data)
    if type(user) == int:
        return jsonify({'error': 'something went wrong'}), 400
    return jsonify(user), 201

@users_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user_endpoint(user_id):
    user = get_user(user_id)
    if not user:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(user), 200
