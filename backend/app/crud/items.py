from src.extensions import db
from app.models import Item
from app.schemas import ItemSchema

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
    item = db.session.get(Item, id)
    item_schema = ItemSchema()
    return item_schema.dump(item)
    
def get_all_items():
    all_items = db.session.query(Item).all()
    all_items_schema = ItemSchema(many = True)
    return all_items_schema.dump(all_items)