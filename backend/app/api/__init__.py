"""API blueprints"""
from app.api.health import health_bp
from app.api.users import users_bp
from app.api.items import items_bp

__all__ = ['health_bp', 'users_bp', 'items_bp']
