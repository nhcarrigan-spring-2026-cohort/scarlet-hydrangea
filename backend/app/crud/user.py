from src.extensions import db
from app.models import User
from app.schemas import UserSchema
from werkzeug.security import generate_password_hash

def get_all_users():
    all_users = db.session.query(User).all()
    multiple_users_schema = UserSchema(many = True)
    return multiple_users_schema.dump(all_users)

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