from src.extensions import ma
from app.models.revoked_token import RevokedToken

class TokenSchema(ma.SQLAlchemyAutoSchema):
    """
    JWT Token schema for checking if the 
    """
    class Meta:
        model = RevokedToken
        load_instance = False
        fields = ("id", "jti", "revoked_at", "delete_at")
        dump_only = ("jti")
        
    