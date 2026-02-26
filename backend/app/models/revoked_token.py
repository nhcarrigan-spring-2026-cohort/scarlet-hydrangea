from src.extensions import db

class RevokedToken(db.Model):
    """
    Represents JWT token revoked by logging out.
    """
    
    __tablename__ = 'revoked_tokens'
    
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False)
    revoked_at = db.Column(db.DateTime(timezone=True), nullable=False)
    delete_at = db.Column(db.DateTime(timezone=True), nullable=False)
    
    def __repr__(self):
        return f'<Token {self.jti}>'