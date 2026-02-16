import os
from flask import Flask

from src.config import get_config
from src.extensions import db, migrate, jwt, init_extensions


def create_app(config=None):
    """Application factory
    
    Args:
        config: Config class to use. If None, uses FLASK_ENV to determine config.
    
    Returns:
        Flask app instance with all extensions initialized
    """
    app = Flask(__name__)
    
    # Load config
    if config is None:
        config = get_config()
    app.config.from_object(config)
    
    # Initialize extensions
    init_extensions(app)

    # Register models
    from app import models
    
    # Home endpoint
    @app.route('/')
    def home():
        return {'message': 'Scarlet Hydrangea Backend API'}, 200
    
    # Register blueprints
    from app.api import health_bp
    app.register_blueprint(health_bp)
    
    return app


def create_tables(config=None):
    """Initialize tables
    
    Creates items, users and borrows tables
    """
    app = Flask(__name__)
    
    # Load config
    if config is None:
        config = get_config()
    app.config.from_object(config)
    
    # Initialize extensions
    init_extensions(app)
    
    with app.app_context():
        db.create_all()
        print("Database tables created.")
    
    os._exit(0)
    
    return app