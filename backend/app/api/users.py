from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token, get_jwt, jwt_required
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError
from src.extensions import db
from app.crud.user import get_all_users, get_user, create_user, get_user_by_email
from app.crud.revoked_token import add_revoked_token
from app.schemas import UserSchema, UserProfileSchema, UserRegistrationSchema, UserLoginSchema
from datetime import datetime, timezone

users_bp = Blueprint('users', __name__)
auth_bp = Blueprint('auth', __name__)

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


@auth_bp.route('/auth/login', methods=['POST'])  
def login_user_endpoint():
    raw_data = request.get_json()
    
    if not raw_data:
        return jsonify({'error': 'Request body is required'}), 400
    
    schema = UserLoginSchema()
    try:
        data = schema.load(raw_data)
    except ValidationError as err:
        return jsonify({'error': err.messages}), 400
    
    user = get_user_by_email(data['email'])
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # generate token
    token = create_access_token(identity=str(user.id))
    return jsonify({'access_token': token}), 200

@auth_bp.route('/auth/logout', methods=['POST'])
@jwt_required()
def logout_user_endpoint():
    jwt_payload = get_jwt()
    jti = jwt_payload["jti"]
    expires_at = datetime.fromtimestamp(timestamp=jwt_payload["exp"], tz=timezone.utc)
    add_revoked_token(jti=jti, expires_at=expires_at)
    return jsonify({"message": "User successfully logged off"}), 200
    additional_claims = {"is_admin": user.is_admin}
    token = create_access_token(identity=str(user.id), additional_claims=additional_claims)
    return jsonify({'access_token': token}), 200
