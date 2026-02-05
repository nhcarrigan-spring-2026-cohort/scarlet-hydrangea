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
    
    # Home endpoint
    @app.route('/')
    def home():
        return {'message': 'Scarlet Hydrangea Backend API'}, 200
    
    # Register blueprints
    from app.api import health_bp
    app.register_blueprint(health_bp)
    
    return app
