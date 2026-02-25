from dotenv import load_dotenv
load_dotenv()
from src import create_app
from src.extensions import db
from app.models import User, Item, Borrow
import app.crud.user as user_crud
import app.crud.item as item_crud
import app.crud.borrow as borrow_crud
from sqlalchemy import delete
from faker import Faker

TOTAL_USERS = 5
ITEMS_PER_USER = 3

CATEGORIES = ["power_tools", "cutting", "gardening", "cleaning", "measuring"]
CONDITIONS = ["new", "like_new", "good", "fair", "poor"]


app = create_app()
Faker.seed(123)
fake = Faker()


with app.app_context():
    
    # Delete exisitng data (Bottom up approach due to FKs)
    db.session.execute(delete(Borrow))
    db.session.execute(delete(Item))
    db.session.execute(delete(User))
    db.session.commit()
    print("Cleared existing data.")
    
    # Seed admin
    admin = user_crud.create_user(
        username="admin",
        full_name="Admin User",
        email="admin@hydrangea.com",
        password="admin123",
        is_admin=True
    )
    print(f"Created admin: {admin.username}")
    
    
    # Seed regular users
    users = []
    for _ in range(TOTAL_USERS):
        user = user_crud.create_user(
            username=fake.user_name(),
            full_name=fake.name(),
            email=fake.email(),
            password="password123"
        )
        users.append(user)
    print(f"Created {len(users)} users.")
    
    
    # Seed items (2 per user)
    items = []
    for user in users:
        for _ in range(ITEMS_PER_USER):
            item = item_crud.add_item(
                name=fake.bs().title(),
                description=fake.sentence(),
                category=fake.random_element(CATEGORIES),
                condition=fake.random_element(CONDITIONS),
                owner_id=user.id,
                total_quantity=fake.random_int(min=1, max=3)
            )
            items.append(item)
    print(f"Created {len(items)} items.")
    
    
    # Seed sample borrows with different statuses
    # User ownership: user[0] owns items[0:3], user[1] owns items[3:6], etc.
    
    # Pending: user[0] borrows from user[1]
    pending = borrow_crud.create_borrow_request(
            item_id=items[3].id,  # First item of user[1]
            borrower_id=users[0].id,
            due_date=None
    )
    print(f"Created pending borrow: id={pending.id}")

    # Approved: user[1] borrows from user[2]
    approved = borrow_crud.create_borrow_request(
            item_id=items[6].id,  # First item of user[2]
            borrower_id=users[1].id,
            due_date=None
    )
    borrow_crud.approve_borrow(approved.id)
    print(f"Created approved borrow: id={approved.id}")

    # Returned: user[2] borrows item owned by user[0], then returns it
    returned = borrow_crud.create_borrow_request(
            item_id=items[0].id,  # First item of user[0]
            borrower_id=users[2].id,
            due_date=None
    )
    borrow_crud.approve_borrow(returned.id)
    borrow_crud.return_borrow(returned.id)
    print(f"Created returned borrow: id={returned.id}")

    # Extra borrow for frontend testing: user[1] borrows from user[0]
    test_borrow = borrow_crud.create_borrow_request(
        item_id=items[0].id,
        borrower_id=users[1].id,
        due_date=None
    )
    print(f"Created extra borrow for dev testing: id={test_borrow.id}")

    print("\nSeeding complete.")
