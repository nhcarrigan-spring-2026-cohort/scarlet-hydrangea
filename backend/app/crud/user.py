from src.extensions import db
from app.models import User
from app.schemas import UserSchema, UserProfileSchema, UserRegistrationSchema

def get_all_users():
    all_users = db.session.query(User).all()
    multiple_users_schema = UserSchema(many = True)
    return multiple_users_schema.dump(all_users)

def get_user(user_id):
    user = db.session.get(User, user_id)
    user_schema = UserProfileSchema()
    return user_schema.dump(user)

def create_user(data):
    user_schema = UserRegistrationSchema()
    try:
        new_user = user_schema.load(data)
        return new_user
    except:
        return False
