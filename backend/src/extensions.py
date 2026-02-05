from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

# Initialize extensions (no app reference yet - prevents circular imports)
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()


def init_extensions(app):
    """Register all extensions with the app"""
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
