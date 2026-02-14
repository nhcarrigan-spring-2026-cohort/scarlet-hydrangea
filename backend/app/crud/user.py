from src.extensions import db
from app.models import User
from werkzeug.security import generate_password_hash

def get_all_users():
    return User.query.all()

def get_user(user_id):
    return User.query.get(user_id)

def create_user(username, full_name, email, password):
    user = User(
        username = username,
        full_name = full_name,
        email = email,
        password_hash = generate_password_hash(password)
    )
    db.session.add(user)
    db.session.commit()
    return user