## Prerequisites
1. **Python 3.12**
2. **Install `uv` package manager**
   - macOS/Linux: `curl -LsSf https://astral.sh/uv/install.sh | sh`
   - Windows: `powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"`
   - Verify: `uv --version`
3. **Install PostgreSQL**
   - Download the installer for your OS from [PostgreSQL Downloads](https://www.postgresql.org/download/)
   - Verify: `psql --version`
4. **pgAdmin 4** (Optional GUI tool)

## Database Setup
Before running the app, create the local database and user.

1. **Open PostgreSQL command line (psql)**
2. **Create a new user:**
```sql
   CREATE USER user_name WITH PASSWORD 'db_password';
```
3. **Create the database:**
```sql
   CREATE DATABASE db_name OWNER user_name;
```
   
   *(Replace `user_name`, `db_password`, and `db_name` with your desired credentials)*

## Application Setup
1. **Install dependencies:** `uv sync`
2. **Configure environment:**
   - Copy `.env.example` to a new `.env` file in the `backend` directory
   - Update `DATABASE_URL` in `.env` with your database credentials:

## Running the Server
1. **Start the server:** `uv run run.py`
2. **Verify it's running:**
   - Home page: `http://127.0.0.1:5000`
   - Database connection test: `http://127.0.0.1:5000/test-db`
# Scarlet Hydrangea Backend API

A clean, scalable Flask + PostgreSQL backend skeleton built for team collaboration.

## Quick Start

### Prerequisites
- Python 3.12+
- PostgreSQL 16+
- pip or uv (package manager)

### Setup (First Time)

1. **Clone and enter directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**

### Using pip (standard Python)
```bash
pip install -e .

### Using  uv(faster dependency resolver)
uv sync
   ```

4. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your PostgreSQL credentials
   ```

5. **Initialize database migrations:**
   ```bash
   flask db init
   ```

6. **Initialize migrations:**
   ```bash
   flask db init
   ```

7. **Run the app:**
### With pip
   ```bash
   python run.py

### With uv
   ```bash
   uv run run.py
   ```

Visit `http://localhost:5000/health` to verify setup.

---

## Project Structure

```
backend/
├── src/
│   ├── __init__.py              # App factory (create_app)
│   ├── config.py                # Environment-based config (Dev/Test/Prod)
│   ├── extensions.py            # Third-party extensions (db, migrate, jwt)
│   └── [Week 2+: models/]
│
├── app/
│   ├── api/
│   │   ├── __init__.py
│   │   └── health.py            # Health check endpoint
│   ├── crud/                    # [Week 2+: CRUD operations]
│   ├── models/                  # [Week 2+: SQLAlchemy models]
│   └── schemas/                 # [Week 2+: Serialization]
│
├── migrations/                  # Flask-Migrate (auto-generated)
├── tests/                       # [Week 2+: Unit tests]
├── .env                         # Environment variables (git-ignored)
├── .env.example                 # Template for .env
├── .gitignore
├── pyproject.toml               # Dependencies & project metadata
├── run.py                       # Entry point
└── README.md
```

### Folder Responsibilities

| Folder | Purpose | Status |
|--------|---------|--------|
| `src/` | Core app setup | ✅ Done |
| `app/api/` | Route blueprints | ✅ Health only |
| `app/models/` | SQLAlchemy models | ⏳ Week 2 |
| `app/crud/` | Database operations | ⏳ Week 2 |
| `app/schemas/` | Data validation/serialization | ⏳ Week 2 |
| `migrations/` | Database version control | ✅ Ready |

---

## Architecture Decisions

### 1. **App Factory Pattern**
```python
# src/__init__.py
def create_app(config=None):
    """Creates and configures Flask app"""
```
**Why?** Allows multiple app instances (testing, staging, prod) without globals.

### 2. **Extensions Initialization**
```python
# src/extensions.py
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def init_extensions(app):
    """Ties extensions to a specific app instance"""
```
**Why?** Prevents circular imports when models import `from src.extensions import db`.

### 3. **Environment-Based Config**
```python
# src/config.py
class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
```
**Why?** Single source of truth. Easy to switch environments without code changes.

### 4. **Blueprint Organization**
```python
# app/api/health.py
health_bp = Blueprint('health', __name__)
```
**Why?** As we add borrowing, user, and book routes, we keep them separate and organized.

### 5. **Migration Management**
```bash
flask db init      # Create migrations folder (one-time)
flask db migrate   # Auto-detect model changes
flask db upgrade   # Apply to database
```
**Why?** Team members don't need to manually write SQL. Version-controlled schema.

---

## Development Commands

### Run the Application
```bash
python run.py
```
Starts Flask dev server at `http://localhost:5000`

### Check Health
```bash
curl http://localhost:5000/health
```
Response:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

### Database Migrations

**Create a migration after adding models:**
```bash
flask db migrate -m "Add User model"
```

**Apply pending migrations:**
```bash
flask db upgrade
```

**View migration status:**
```bash
flask db current
flask db history
```

### Run Tests (Week 2+)
```bash
pytest
```

---

## Environment Variables

Required in `.env`:

```env
FLASK_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/scarlet_hydrangea_db
JWT_SECRET_KEY=your-secret-key-change-in-production
```

**Notes:**
- Special characters in passwords must be URL-encoded (e.g., `@` → `%40`)
- `JWT_SECRET_KEY` is generated at startup if not provided (dev only)
- Never commit `.env` to Git

---

## Next Steps (Week 2)

- [ ] Create `User` model in `app/models/`
- [ ] Create `Book` and `Borrow` models
- [ ] Add Flask-Migrate version control to Git
- [ ] Build CRUD operations in `app/crud/`
- [ ] Create API routes in `app/api/`
- [ ] Add input validation with Pydantic/Marshmallow

---

## Troubleshooting

### `ModuleNotFoundError: flask_migrate`
```bash
pip install flask-migrate flask-jwt-extended
```

### `RuntimeError: SQLALCHEMY_DATABASE_URI not set`
Ensure `.env` file exists and `FLASK_ENV` is loaded before importing config.

### `FATAL: password authentication failed`
Check `.env` credentials match your PostgreSQL password. Special chars need URL encoding.

### `psycopg2.ProgrammingError: relation does not exist`
Run migrations: `flask db upgrade`

---

## Questions?

This is a learning space! Ask in PRs, comments, or slack. We're building this together.

**Remember:** Week 1 is infrastructure. Features come later. 🚀
