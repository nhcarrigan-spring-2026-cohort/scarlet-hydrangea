from src.extensions import db
from app.models.item import Item
from sqlalchemy import select

def add_item(name, description, category, owner_id, total_quantity, condition):
    """
    Creates a new item (tool)
    """
    item = Item(
        name = name,
        description = description,
        category = category,
        owner_id = owner_id,
        total_quantity = total_quantity,
        available_quantity = total_quantity,
        condition = condition
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
