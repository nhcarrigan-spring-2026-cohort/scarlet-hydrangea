from src.extensions import db

class RevokedToken(db.Model):
    """
    Represents JWT token revoked by logging out.
    """
    
    __tablename__ = 'revoked_tokens'
    
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    revoked_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=db.func.now())
    expires_at = db.Column(db.DateTime(timezone=True), nullable=False)
    
    def __repr__(self):
        return f'<Token {self.jti}>'