from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError
from src.extensions import db
from app.crud.user import get_all_users, get_user, create_user
from app.schemas import UserSchema, UserProfileSchema, UserRegistrationSchema

users_bp = Blueprint('users', __name__)

'''
/api/users route
'''
@users_bp.route('/users', methods=['GET'])
def get_users_endpoint():
    users = get_all_users()
    schema = UserSchema(many=True)                  # many=True when dealing with iterable collections of objects.
    return jsonify(schema.dump(users)), 200     

@users_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user_endpoint(user_id):
    user = get_user(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    schema = UserProfileSchema()
    return jsonify(schema.dump(user)), 200

@users_bp.route('/users', methods=['POST'])
def create_user_endpoint():
    raw_data = request.get_json()

    if not raw_data:
        return jsonify({'error': 'Request body is required'}), 400      # Bad Request  
    
    schema = UserRegistrationSchema()
    try:
        data = schema.load(raw_data)
    except ValidationError as err:
        return jsonify({'error': err.messages}), 400
    
    try:
        user = create_user(username=data['username'], full_name=data['full_name'], 
                           email=data['email'], password=data['password'])
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Username or email already exists'}), 409      # Conflict
    
    return jsonify(UserSchema().dump(user)), 201        # Created       