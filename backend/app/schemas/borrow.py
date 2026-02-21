from src.extensions import ma
from app.models.borrow import Borrow
from marshmallow import validates, ValidationError, validate

class BorrowSchema(ma.SQLAlchemyAutoSchema):
    """
    Borrow schema for borrowing transaction views.
    item_id and borrower_id are accepted on input.
    Includes nested item and borrower info for display purposes.
    """
    class Meta:
        model = Borrow
        load_instance = False
        fields = (
            "id", "item_id", "borrower_id", "status", "requested_at", "approved_at", "borrowed_at", "due_date", "returned_at",
            "item", "borrower"
        )
        dump_only = ("id", "requested_at", "approved_at", "borrowed_at", "due_date", "returned_at")

    # Input Fields
    item_id = ma.Integer(required=True, load_only=True)
    borrower_id = ma.Integer(required=True, load_only=True)

    # System controlled
    status = ma.String(dump_only=True)
    
    # Display only
    item = ma.Nested("ItemSchema", only=("id", "name", "category", "condition"), dump_only=True)
    borrower = ma.Nested("UserSchema", only=("id", "username", "full_name"), dump_only=True)
