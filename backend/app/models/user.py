from src.extensions import db

class User(db.Model):
    """
    Represents a user in the community tool library system.
    
    Users can own items and borrow items from others.
    """
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False, index=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)

    created_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now())
    updated_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now(), onupdate=db.func.now())

    # Relationships
    owned_items = db.relationship('Item', back_populates='owner', foreign_keys='Item.owner_id')
    borrows = db.relationship('Borrow', back_populates='borrower', foreign_keys='Borrow.borrower_id')

    def __repr__(self):
        return f'<User {self.username}>'