from src.extensions import db
from app.models.borrow import Borrow
from sqlalchemy import select

def create_borrow_request(item_id, borrower_id, due_date):
    """creates a simple 'pending' request

    Args:
        item_id (int)
        borrower_id (int)
        due_date (datetime)

    Returns:
        Borrow: object of Model Borrow
    """
    borrow = Borrow(
        item_id=item_id,
        borrower_id=borrower_id,
        due_date=due_date
    )
    db.session.add(borrow)
    db.session.commit()
    return borrow

def get_all_borrows():
    """Admin View: view all Borrows

    Returns:
        list[Borrow]: list of all Borrows
    """
    stmt=select(Borrow)
    return db.session.execute(stmt).scalars().all()

def get_borrows_by_user(user_id):
    """Profile View: view borrows of specific user

    Args:
        user_id (int)

    Returns:
        list[Borrow]
    """
    stmt=select(Borrow).where(Borrow.borrower_id == user_id)
    return db.session.execute(stmt).scalars().all()