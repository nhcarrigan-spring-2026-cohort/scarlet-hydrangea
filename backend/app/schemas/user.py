from src.extensions import ma
from app.models.user import User
from marshmallow import validates, ValidationError, validate

# READ SCHEMAS (output only)
class UserSchema(ma.SQLAlchemyAutoSchema):
    """
    Serializes User model for API responses.
    """
    class Meta:
        model = User
        load_instance = False  # returns a dict
        fields = ("id", "username", "is_admin", "email", "full_name", "created_at")
        dump_only = fields

class UserProfileSchema(ma.SQLAlchemyAutoSchema):
    """
    Extended user schema for specific profile views.
    """
    class Meta:
        model = User
        load_instance = False
        fields = ("id", "username", "email", "full_name", "created_at", "owned_items", "borrows")
        dump_only = fields
    
    # Nested display fields
    owned_items = ma.Nested(
        "ItemSchema",
        many=True,
        dump_only=True,
        only=("id", "name", "category", "condition", "is_available", "available_quantity"),
        )
    
    borrows = ma.Nested(
        "BorrowSchema",
        many=True, 
        dump_only=True,
        only=("id", "status", "requested_at", "borrowed_at", "due_date", "returned_at")
        )

class UserRegistrationSchema(ma.Schema):
    """
    Validates Registration Data (POST /api/users)
    """
    username = ma.String(required=True, validate=validate.Length(min=3, max=50))
    email = ma.Email(required=True)
    full_name = ma.String(required=True,validate=validate.Length(min=1, max=100))
    password = ma.String(required=True, load_only=True,
                         validate=validate.Length(min=8, error="Password must be at least 8 characters"))


class UserLoginSchema(ma.Schema):
    """
    Validates POST api/auth/login request body.
    """
    email = ma.Email(required=True)
    password = ma.String(required=True, load_only=True)

