from src.extensions import ma
from app.models.item import Item
from marshmallow import validates, ValidationError, validate

class ItemSchema(ma.SQLAlchemyAutoSchema):
    """
    Item schema for tool listing and detail views.
    Includes nested owner info for display purposes.
    """
    class Meta:
        model = Item
        load_instance = False  # returns a dict
        fields = ("id", "name", "description", "category", "condition","total_quantity", "available_quantity",
                  "is_available", "created_at", "owner", "owner_id")
        dump_only = ("id", "is_available", "available_quantity", "created_at")

    # Validated Fields
    name = ma.String(required=True, validate=validate.Length(min=3, max=100))
    description = ma.String(validate=validate.Length(max=1000))
    category = ma.String(validate=validate.Length(max=50))
    condition = ma.String(required=True, validate=validate.OneOf(
        ["new", "like_new", "good", "fair", "poor"],
        error="Condition must be one of: new, like_new, good, fair, poor"
    ))
    total_quantity = ma.Integer(required=True, strict=True, 
                                validate=validate.Range(min=1, error="Total quantity must be at least 1"))
    
    # Input only
    owner_id = ma.Integer(required=True, load_only=True)

    # System controlled
    available_quantity = ma.Integer(dump_only=True, validate=validate.Range(min=0))
    is_available = ma.Boolean(dump_only=True)

    # Display only
    owner = ma.Nested("UserSchema", only=("id", "username", "full_name"), dump_only=True)