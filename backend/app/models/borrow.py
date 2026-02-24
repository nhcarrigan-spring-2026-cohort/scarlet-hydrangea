from src.extensions import db

class Borrow(db.Model):
    """
    Represents a borrowing transaction between a user and item.
    
    Tracks the complete lifecycle: request -> approval -> checkout -> return.
    
    Status values:
        - 'pending': Request submitted, awaiting owner approval
        - 'approved': Owner approved, awaiting physical handoff
        - 'active': Item checked out to borrower
        - 'returned': Item returned by borrower
        - 'declined': Owner declined the request
    """
    __tablename__ = 'borrows'

    id = db.Column(db.Integer, primary_key=True)

    # Links
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    borrower_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Workflow status 
    status = db.Column(db.String(20), nullable=False, default='pending')

    # Stage-wise timestamp tracking
    requested_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now())
    approved_at = db.Column(db.DateTime(timezone=True), nullable=True)
    borrowed_at = db.Column(db.DateTime(timezone=True), nullable=True)
    due_date = db.Column(db.DateTime(timezone=True), nullable=True)
    returned_at = db.Column(db.DateTime(timezone=True), nullable=True)

    created_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now())
    updated_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now(), onupdate=db.func.now())

    # Relationships
    item = db.relationship('Item', back_populates='borrows')
    borrower = db.relationship('User', back_populates='borrows', foreign_keys=[borrower_id])

    def __repr__(self):
        return f'<Borrow {self.id}: {self.status}>'