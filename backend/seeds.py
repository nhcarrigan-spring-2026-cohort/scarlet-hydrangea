from dotenv import dotenv_values
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session
from app.models.borrow import Borrow
from app.models.user import User
from app.models.item import Item

from werkzeug.security import generate_password_hash

from app.schemas import UserSchema, UserProfileSchema, UserRegistrationSchema

postgres_url = dotenv_values(".env")["DATABASE_URL"]
engine = create_engine(postgres_url)

sample_users = [
    {
        "is_admin": True,
        "username": "admin",
        "full_name": "Admin Admin",
        "email": "admin@email.com",
        "password" : "12345678",
        "owned_items": []
    },
    {
        "is_admin": False,
        "username": "user01",
        "full_name": "First User",
        "email": "user01@email.com",
        "password" : "12345678",
        "owned_items": [
            {
                "name": "Power Drill",
                "condition": "Good",
                "category": "Tools",
                "total_quantity": 1
            },
            {
                "name": "Hammer",
                "condition": "Fair",
                "category": "Tools",
                "total_quantity": 1
            }
        ]
    },
    {
        "is_admin": False,
        "username": "user02",
        "full_name": "Second User",
        "email": "user02@email.com",
        "password": "12345678",
        "owned_items": [
            {
                "name": "Ladder",
                "condition": "Good",
                "category": "Equipment",
                "total_quantity": 1
            },
            {
                "name": "Camping Tent",
                "condition": "Fair",
                "category": "Camping",
                "total_quantity": 1
            },
            {
                "name": "Electric Saw",
                "condition": "Fair",
                "category": "Good",
                "total_quantity": 1
            }
        ]
    },
]

if __name__ == "__main__":
    with Session(engine) as session:
    # Delete borrows, items, and users
        session.query(Borrow).delete()
        session.query(Item).delete()
        session.query(User).delete()
        session.commit()
    
    # Create 3 sample users (one admin, and two regular)
        for sample_user in sample_users: 
            user = User(
                is_admin=sample_user["is_admin"],
                username=sample_user["username"],
                full_name=sample_user["full_name"],
                email=sample_user["email"],
                password_hash=generate_password_hash(sample_user["password"])
            )   
            session.add(user)
            # Add tools to the users
            if sample_user["owned_items"]:
                current_user_id = session.execute(select(User.id).where(User.username == sample_user["username"])).scalar_one_or_none()
                for sample_item in sample_user["owned_items"]:
                    item = Item(
                        **sample_item,
                        owner_id = current_user_id
                    )
                    session.add(item)
        session.commit()
    session.close()