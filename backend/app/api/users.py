from flask import Blueprint, jsonify
from app.crud import get_all_users, get_user

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
