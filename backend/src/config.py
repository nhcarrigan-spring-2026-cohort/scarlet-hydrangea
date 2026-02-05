import os
from datetime import timedelta


class Config:
    """Base config - shared across all environments"""
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JSON_SORT_KEYS = False
    
    # JWT (setup only, no enforcement yet)
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'dev-secret-change-in-prod')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=30)


class DevelopmentConfig(Config):
    """Local development"""
    DEBUG = True
    TESTING = False
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')


class TestingConfig(Config):
    """Unit tests"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    JWT_SECRET_KEY = 'test-secret'


class ProductionConfig(Config):
    """Production"""
    DEBUG = False
    TESTING = False
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')


def get_config():
    """Return config based on FLASK_ENV"""
    env = os.getenv('FLASK_ENV', 'development')
    configs = {
        'development': DevelopmentConfig,
        'testing': TestingConfig,
        'production': ProductionConfig,
    }
    return configs.get(env, DevelopmentConfig)
