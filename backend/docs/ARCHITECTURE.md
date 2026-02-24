# Architecture Guide

This document explains key design decisions and patterns used in the backend.

---

## Core Patterns

### 1. App Factory (`src/__init__.py`)
```python
def create_app(config=None):
    """Create and configure Flask app"""
    app = Flask(__name__)
    app.config.from_object(get_config())
    init_extensions(app)
    .....

    return app
```

**Benefits:**
- Multiple app instances for testing/production
- No global state
- Easy to pass configs

---

### 2. Extensions (`src/extensions.py`)
```python
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
ma = Marshmallow()

def init_extensions(app):
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    .....
```

**Why separate?**
- Models can import `from src.extensions import db` without circular imports
- Extensions are initialized once per app

---

### 3. Configuration Management

**Location:** `src/config.py`

```python
class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'  # Fast, isolated
```

**Pattern:**
1. Base `Config` class with shared settings
2. Environment-specific classes override as needed
3. `get_config()` returns the right class based on `FLASK_ENV`

---

### 4. Blueprints (Organized Routes)
```python
# app/api/users.py
users_bp = Blueprint('users', __name__)

# Registered in src/__init__.py
from app.api import users_bp
app.register_blueprint(users_bp, url_prefix='/api/users')
```

---

### 5. Layer Separation
```
Route (HTTP) -> Schema (validate) -> CRUD (business logic) -> Model (DB)
```

**Example:**
```python
# Route handles HTTP
@users_bp.route('/users/')
def get_user_endpoint(user_id):
    user = get_user(user_id)  # Call CRUD
    return jsonify(UserSchema().dump(user)), 200

# CRUD handles business logic
def get_user(user_id):
    return db.session.get(User, user_id)

# Model defines structure
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
```

---

## Adding New Features

1. **Create Model** in `app/models/`
2. **Generate Migration:** `flask db migrate -m "Add Feature"`
3. **Apply Migration:** `flask db upgrade`
4. **Create Schema** in `app/schemas/`
5. **Create CRUD** in `app/crud/`
6. **Create Routes** in `app/api/`
7. **Register Blueprint** in `src/__init__.py`
8. **Test** with Postman/cURL

---

## Testing Strategy

- Unit tests for CRUD functions
- Integration tests for full request/response cycle
- Use in-memory SQLite for test database (`TestingConfig`)

```python
# tests/test_users.py
import pytest
from src import create_app
from src.config import TestingConfig

@pytest.fixture
def app():
    app = create_app(TestingConfig)
    with app.app_context():
        from src.extensions import db
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

def test_create_user(app):
    client = app.test_client()
    response = client.post('/api/users', json={'email': 'test@example.com'})
    assert response.status_code == 201
```

---

## Common Patterns

### Validation Error Handling
```python
try:
    data = schema.load(request.get_json())
except ValidationError as err:
    return jsonify({'error': err.messages}), 400
```

### Business Rule Violations
```python
try:
    result = crud_function()
except ValueError as e:
    return jsonify({'error': str(e)}), 400
```
---

## Questions?

See main [README](/backend/README.md) for setup instructions.
