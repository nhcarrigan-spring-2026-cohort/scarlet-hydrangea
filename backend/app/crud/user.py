from src.extensions import db
from app.models.user import User
from werkzeug.security import generate_password_hash
from sqlalchemy import select

def create_user(username, full_name, email, password):
    """
    Creates a new user. 
    Hashes the password before saving to the database.
    """
    user = User(
        username=username,
        full_name=full_name,
        email=email,
        password_hash=generate_password_hash(password)
    )
    db.session.add(user)
    db.session.commit()
    return user

def get_all_users():
    """Returns list of all users"""
    stmt=select(User)
    return db.session.execute(stmt).scalars().all()

def get_user(user_id: int):
    """Returns user by ID"""
    return db.session.get(User, user_id)

def get_user_by_username(username: str):
    """Returns user by username or None"""
    stmt = select(User).where(User.username == username)
    return db.session.execute(stmt).scalar_one_or_none()

def get_user_by_email(email: str):
    """Returns user by email or None"""
    stmt = select(User).where(User.email == email)
    return db.session.execute(stmt).scalar_one_or_none()