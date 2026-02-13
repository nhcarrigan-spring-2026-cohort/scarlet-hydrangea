from src.extensions import db

class Item(db.Model):
    """
    Represents a physical item available for borrowing.
    
    Items are owned by users and can be borrowed by other users.
    Supports quantity tracking for identical items.
    """
    __tablename__ = 'items'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(50), nullable=True, index=True)

    # Links
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)

    # Quantity tracking for identical items
    total_quantity = db.Column(db.Integer, nullable=False, default=1)
    available_quantity = db.Column(db.Integer, nullable=False, default=1)

    created_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now())
    updated_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now(), onupdate=db.func.now())

     # Database constraints
    __table_args__ = (
        db.CheckConstraint('available_quantity >= 0', name='check_available_non_negative'),
        db.CheckConstraint('available_quantity <= total_quantity', name='check_available_lte_total'),
        db.CheckConstraint('total_quantity >= 1', name='check_total_positive'),
    )

    # Relationships
    owner = db.relationship('User', back_populates='owned_items')
    borrows = db.relationship('Borrow', back_populates='item')

    def __repr__(self):
        return f'<Item {self.name} ({self.available_quantity}/{self.total_quantity} available)>'
    
    @property
    def is_available(self):
        """Check availability"""
        return self.available_quantity > 0