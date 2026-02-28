from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from app.crud import borrow as borrow_crud
from app.schemas.borrow import BorrowSchema
from app.utils.decorators import admin_required
from flask_jwt_extended import jwt_required, get_jwt_identity

borrows_bp = Blueprint('borrows', __name__, url_prefix='/api/borrows')

@borrows_bp.route('/', methods=['GET'])
@admin_required()
def get_borrows_endpoint():
    """Get all borrows, optionally filtered by user."""
    user_id = request.args.get('user_id', type=int)
    
    if user_id:
        borrows = borrow_crud.get_borrows_by_user(user_id)
    else: 
        # TODO: Require admin auth for viewing all borrows
        borrows = borrow_crud.get_all_borrows()
        
    schema = BorrowSchema(many=True)
    return jsonify(schema.dump(borrows)), 200

@borrows_bp.route('/own', methods=['GET'])
@jwt_required()
def get_own_borrows():
    user_id = int(get_jwt_identity())
    
    borrows = borrow_crud.get_borrows_by_user(user_id)
    schema = BorrowSchema(many=True)
    return jsonify(schema.dump(borrows)), 200

@borrows_bp.route('/<int:borrow_id>', methods=['GET'])
def get_borrow_endpoint(borrow_id):
    """Get a single borrow by ID"""
    borrow = borrow_crud.get_borrow(borrow_id)
    if not borrow:
        return jsonify({'error': 'Borrow not found'}), 404
    
    schema = BorrowSchema()
    return jsonify(schema.dump(borrow)), 200



@borrows_bp.route('/', methods=['POST'])
@jwt_required()
def create_borrow_endpoint():
    """Create a new borrow request"""
    raw_data = request.get_json()
    
    if not raw_data:
        return jsonify({'error': 'Request body is required'}), 400
    
    schema = BorrowSchema()
    try:
        data = schema.load(raw_data)
    except ValidationError as err:
        return jsonify({'error': err.messages}), 400
    
    try:
        borrow = borrow_crud.create_borrow_request(
            item_id=data['item_id'],
            borrower_id=int(get_jwt_identity()),
            due_date=None
        )
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    
    schema = BorrowSchema()
    return jsonify(schema.dump(borrow)), 201



@borrows_bp.route('/<int:borrow_id>/approve', methods=['PATCH'])
@admin_required()
def approve_borrow_endpoint(borrow_id):
    """Approve a pending borrow request"""
    try:
        borrow = borrow_crud.approve_borrow(borrow_id)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    
    schema = BorrowSchema()
    return jsonify(schema.dump(borrow)), 200



@borrows_bp.route('/<int:borrow_id>/return', methods=['PATCH'])
@admin_required()
def return_borrow_endpoint(borrow_id):
    try:
        borrow = borrow_crud.return_borrow(borrow_id)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    
    schema = BorrowSchema()
    return jsonify(schema.dump(borrow)), 200