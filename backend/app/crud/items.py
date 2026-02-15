from app.models.item import Item
from src.extensions import db

def add_item(name, description, category, owner_id, quantity, condition):
    item = Item(
        name = name,
        description = description,
        category = category,
        owner_id = owner_id,
        total_quantity = quantity,
        available_quantity = quantity,
        condition = condition
    )
    db.session.add(item)
    db.session.commit()
    return item

def get_item_by_id(id):
    return Item.query.get(id)

def get_all_items():
    return Item.query.all()
