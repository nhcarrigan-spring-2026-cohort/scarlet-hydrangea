from src.extensions import db
from app.models.item import Item
from sqlalchemy import select

def add_item(**item_data):
    """
    Creates a new item (tool).
    Expects kwargs containing item fields
    """
    available = item_data['total_quantity']
    item = Item(
        **item_data,
        available_quantity = available
    )
    db.session.add(item)
    db.session.commit()
    return item

def get_item_by_id(item_id: int):
    """Return item by ID"""
    return db.session.get(Item, item_id)

def get_all_items():
    """Return a list of all items"""
    stmt = select(Item)
    return db.session.execute(stmt).scalars().all()