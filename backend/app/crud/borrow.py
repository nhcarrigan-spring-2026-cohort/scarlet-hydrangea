from src.extensions import db
from app.models import Borrow, Item, User
from sqlalchemy import select
from datetime import datetime, timezone

def create_borrow_request(item_id, borrower_id, due_date) -> Borrow:
    """
    Creates a 'pending' borrow request

    Args:
        item_id (int): ID of the item to borrow
        borrower_id (int): ID of the user requesting to borrow
        due_date (datetime): When the item should be returned

    Raises:
        ValueError: If item/user not found, borrowing own item, or active borrow already exists
    
    Returns:
        Borrow: Created borrow object with status='pending'
    """
    # Validate item exists
    item = db.session.get(Item, item_id)
    if not item:
        raise ValueError('Item not found')
    
    # Validate borrower exists
    borrower = db.session.get(User, borrower_id)
    if not borrower:
        raise ValueError("User not found")
    
    # Check if borrowing own item
    if item.owner_id == borrower.id:
        raise ValueError("Cannot borrow your own item")
    
    # Check for duplicate borrow request
    stmt = select(Borrow).where(Borrow.item_id == item_id,
                                Borrow.borrower_id == borrower_id,
                                Borrow.status.in_(['pending', 'approved', 'active']))
    existing = db.session.execute(stmt).scalar_one_or_none()
    
    if existing:
        raise ValueError("You already have an active borrow request for this item")
    
    borrow = Borrow(
        item_id=item_id,
        borrower_id=borrower_id,
        due_date=due_date,
        status = 'pending'
    )
    db.session.add(borrow)
    db.session.commit()
    return borrow



def get_all_borrows() -> list[Borrow]:
    """
    Returns all borrow records (admin view)

    Returns:
        list[Borrow]: All borrow records in the system
    """
    stmt=select(Borrow)
    return db.session.execute(stmt).scalars().all()



def get_borrows_by_user(user_id) -> list[Borrow]:
    """
    Returns all borrow records for a specific user

    Args:
        user_id (int): ID of the user

    Returns:
        list[Borrow]: All borrows where user is the borrower
    """
    stmt=select(Borrow).where(Borrow.borrower_id == user_id)
    return db.session.execute(stmt).scalars().all()



def get_borrow(borrow_id) -> Borrow | None:
    """
    Returns a single borrow by ID.

    Args:
        borrow_id (int): ID of the borrow record

    Returns:
        Borrow or None: Borrow object if found, None otherwise
    """
    return db.session.get(Borrow, borrow_id)    # retrieve based on primary key - id
  
    
    
def approve_borrow(borrow_id) -> Borrow:
    """
    Approves a pending borrow request and decrements item inventory.

    Args:
        borrow_id (int): ID of the borrow to be approved

    Raises:
        ValueError: If borrow not found, not pending, or item out of stock

    Returns:
        Borrow: Updated borrow with status='approved'
    """
    borrow=db.session.get(Borrow,borrow_id)
    if not borrow:
        raise ValueError("Borrow request not found")
    
    if borrow.status != "pending":
        raise ValueError(f"Cannot approve a borrow request that is {borrow.status} (must be pending)")
    
    item = db.session.get(Item, borrow.item_id)
    
    # Check Stock
    if item.available_quantity < 1:
        raise ValueError(f"Item '{item.name}' is currently out of stock.")
    
    # Update transaction
    item.available_quantity -= 1
    borrow.status = "approved"
    borrow.approved_at = datetime.now(timezone.utc)
    borrow.borrowed_at = datetime.now(timezone.utc)     # Assuming immediate handoff
    
    db.session.commit()
    return borrow



def return_borrow(borrow_id) -> Borrow:
    """
    Marks a borrow as returned and restocks the item.

    Args:
        borrow_id (int ): ID of the borrow to return

    Raises:
        ValueError: If borrow not found or status isn't 'approved'

    Returns:
        Borrow: Updated borrow with status='returned'
    """
    borrow = db.session.get(Borrow, borrow_id)
    if not borrow:
        raise ValueError("Borrow record not found")
    
    if borrow.status != "approved":
        raise ValueError(f"Cannot return a borrow that is {borrow.status} (must be 'approved')")
    
    item = db.session.get(Item, borrow.item_id)
    
    # Restock item
    item.available_quantity += 1 
    
    # Update Transaction
    borrow.status = "returned"
    borrow.returned_at = datetime.now(timezone.utc)
    
    db.session.commit()
    return borrow