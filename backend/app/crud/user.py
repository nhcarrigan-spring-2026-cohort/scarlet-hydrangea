from src.extensions import db
from app.models import User
from app.schemas import UserSchema, UserProfileSchema

def get_all_users():
    all_users = db.session.query(User).all()
    multiple_users_schema = UserSchema(many = True)
    return multiple_users_schema.dump(all_users)

def get_user(user_id):
    user = db.session.get(User, user_id)
    user_schema = UserProfileSchema()
    return user_schema.dump(user)
