from flask import Blueprint, jsonify, request
from app.crud import create_user, get_all_users, get_user

users_bp = Blueprint('users', __name__)

@users_bp.route('/users', methods=['GET'])
def get_users_endpoint():
    print("!1")
    users = get_all_users()
    response = [
        {
            'id': user.id,
            'username': user.username,
        } for user in users]
    if not users:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(response), 200
    
@users_bp.route('/users', methods=['POST'])
def create_user_endpoint():
    data = request.get_json()
    user = create_user(data['username'], data['full_name'], data['email'], data['password'])
    return jsonify({
        'id': user.id, 'email': user.email
    }), 201


@users_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user_endpoint(user_id):
    print("!2")
    user = get_user(user_id)
    print(user)
    if not user:
        print("correct path")
        return jsonify({'error': 'Not found'}), 404
    return jsonify({'id': user.id, 'email': user.email}), 200
