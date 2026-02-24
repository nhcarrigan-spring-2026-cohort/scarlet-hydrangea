# scarlet-hydrangea Community Tool Library - backend

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

## First time setup

### Database

1. Open PosgtreSQL command line (psql)

    - Linux: `sudo -u postgres psql -d postgres`
    - Windows: open `SQL Shell (psql)`, leave `Server`, `Database`, `Port` and `Username` fields blank to use default values and use the password you entered during the installation

2. Create a new user:

    ```sql
    CREATE USER <user_name> WITH PASSWORD '<db_password>';
    ```

3. Create the database:

    ```sql
    CREATE DATABASE scarlet_hydrangea_db OWNER <user_name>;
    ```

    >[!NOTE]
    > - Replace `<user_name>` and `<db_password>` with the credentials you want to use to access the database (notice the quotation marks around the password!).
    > - Special characters in passwords must be URL-encoded (e.g., `@` → `%40`)
    > - `JWT_SECRET_KEY` is generated at startup if not provided (dev only)

4. (optional) open the database list with `\l` and confirm that `scarlet_hydrangea_db` has been created, and its owner is the user you created.

You can escape the database list with `q`, and exit psql with `\q`.

### Backend server

1. Enter the `backend` directory,

2. Install dependencies:

    ```bash
    uv sync
    ```

3. Configure the environment:

    1. copy the `.env.example` file and rename the copy to `.env`,
    2. in the `.env` file, replace `postgres` `password`, with the username and password you used for creating the database.
  
4. Apply models to the database (creates required tables):

    ```bash
    uv run flask db upgrade
    ```

5. Start the backend server:

    ```bash
    uv run run.py
    ```

6. In your browser, open `http://127.0.0.1:5000/health`.  
If you see the response:

    ```bash
    {
      "database": "connected",
      "status": "healthy"`
    }
    ```

    It means that the backend server is running, and it has access to the database.

After starting the backend service, the API endpoints can be reached under the base URL address: `http://localhost:5000`.

---

## API endpoints

### `/health`

Used to verify the connection between the backend service and the database. If the connection is working properly, the response to a `GET` request should be:

```JSON
{
  "database": "connected",
  "status": "healthy"
}
```

### `/api/users` (method: `GET`)

Returns an array of registered users (if any are present in the database), or an empty array if there are no registered users.

Returned user information:

```JSON
{
  "created_at": String (example: "2026-02-17T08:20:23.748394+01:00"),
  "email": String,
  "full_name": String,
  "id": Integer,
  "username": String
}
```

### `/api/users` (method: `POST`)

Accepts an object containing new user data - creates a new `user` entry in the database.

Expected object structure:

```JSON
{
  "email": String (must be a valid email address*),
  "username": String (between 3 and 50 characters),
  "full_name": String (between 1 and 100 characters),
  "password": String (at least 8 characters)
}
```

>[!NOTE]
>
> - `email` and `username` **MUST BE UNIQUE** (not already in use by another registered user).  
> - \* A "valid email address consists of at least one alphanumeric character followed by `@`, at least one alphanumeric character followed by `.`, and at least two alphanumeric characters.

If valid (new) user data is provided, a new user will be added to the database, and the request response (with a status code `201`) will be:

```JSON
{
  "created_at": String,
  "email": String,
  "full_name": String,
  "id": Integer,
  "username": String
}
```

User's password gets hashed before being stored in the database.

### `/users/<user_id>` (method: `GET`)

Returns user's profile data (including list of owned and currently borrowed items) if the user with the given id was found in the database, or an error with a status code `404`.

Returned user information:

```JSON
{
  "borrows": Array,
  "created_at": String,
  "email": String,
  "full_name": String,
  "id": Integer,
  "owned_items": Array,
  "username": String
}
```

### `/api/tools` (method: `GET`)

Returns an array of all tools in the database, (including the tool's availability & owner info), or an empty array if there are no registered tools.

Returned tool information:

```JSON
{
  "available_quantity": Integer,
  "category": String or null,
  "condition": String,
  "created_at": String (example: "2026-02-18T16:27:43.573186+01:00"),
  "description": String,
  "id": Integer,
  "is_available": Boolean,
  "name": String,
  "owner": {
    "full_name": String,
    "id": Integer,
    "username": String
  },
    "total_quantity": Integer
},
```

### `/api/tools/` (method: `POST`)

Accepts an object containing new tool - creates a new tool entry in the database. Expected object structure:

```JSON
{
  "condition": String (one of: "new", "like_new", "good", "fair", "poor"),
  "name": String (between 3 and 100 characters),
  "owner_id": Integer (a valid user id),
  "total_quantity": Integer (minimum 1),
  "category": String (not required),
  "description": String (not required),
}
```

If valid tool data is provided, a new tool will be added to the database, and the request response (with a status code `201`) will be the same as any of the tool data returned by `/api/tools`.

### `/api/tools/<id>` (method: `GET`)

Returns tool data (the tool's owner data) if a tool with the given id was found in the database, or an error with a status code `404`. The request response (with a status code `201`) will be the same as any of the tool data returned by `/api/tools`.

### `/api/borrows` (method: `GET`)

Returns an array of all\* borrow requests in the database (pending, approved, and returned), or an empty array if there are no borrow request.

Returned "borrow" information:

```JSON
{
  "approved_at": String ( example: "2026-02-21T16:32:33.241968+01:00") or null,
  "borrowed_at": String or null,
  "borrower": {
    "full_name": String,
    "id": Integer,
    "username": String
  },
  "due_date": String or null,
  "id": Integer,
  "item": {
    "category": String or null,
    "condition": String,
    "id": Integer,
    "name": String
  },
  "requested_at": String,
  "returned_at": String or null,
  "status": String: "approved"
  }
```

### `/api/borrows?user_id=<id>` (method: `GET`)

Returns an array of all borrow requests, filtered with a "borrower" id. The response structure is the same as the data returned by `/api/borrows`.

### `/api/borrows` (method: `POST`)

Accepts an object containing a id of a user requesting to borrow a tool and the tool id; creates a new `borrow` entry in the database.

Expected object structure:

```JSON
{
  "borrower_id": integer,
  "item_id": integer
}
```

If both the user and tool id's are valid, and the tool is available, the request response (with a status code `201`) will be:

```JSON
{
  "approved_at": null,
  "borrowed_at": null,
  "borrower": {
    "full_name": String,
    "id": Integer,
    "username": String
  },
  "due_date": null,
  "id": Integer,
  "item": {
    "category": String or null,
    "condition": String,
    "id": Integer,
    "name": String
  },
  "requested_at": String (example: "2026-02-22T03:50:14.977311+01:00"),
  "returned_at": null,
  "status": "pending"
}
```

> [!NOTE]
>
> - The `approved_at`, `borrowed_at`, and `due_date` fields will **not** have values until the borrow status gets changed to `approved` with an `approve` `PATCH` request.
> - Until the borrow request is approved, the tool and can be requested by other users.
> - The `returned_at` field fill not have a value until the borrow status gets changed to `returned` with a `return` `PATCH` request.

### `/api/borrows/<id>/approve` (method: `PATCH`)

Takes an id of an open borrow request, decrements the requested tool's availability, and sets the `due_date` of the borrow request to the week after the request has been approved.

The request response (with a status code `200`) will be the same as for the `/api/borrows`, except the `approved_at`, `borrowed_at` and `due_date` fields will now be filled, and the borrow `status` will be set to `pending`.

### `/api/borrows/<id>/return` (method: `PATCH`)

Takes an id of a `pending` borrow request. It increments the requested tool's availability, and sets the `returned_at` of the borrow request.

The request response (with a status code `200`) will be the same as for the `/api/borrows`, except the `returned_at` field will include the date of the `return` `PATCH` request, and the `status` will be set to `returned`.

---

## Project Structure

```bash
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
│   ├── crud/                    # CRUD operations
│   ├── models/                  # SQLAlchemy models
│   └── schemas/                 # Data Serialization
│
├── migrations/                  # Flask-Migrate (auto-generated)
├── tests/                       # Unit tests
├── .env                         # Environment variables (git-ignored)
├── .env.example                 # Template for .env
├── .gitignore
├── pyproject.toml               # Dependencies & project metadata
├── run.py                       # Entry point
└── README.md
```

### Important Files

| File | Purpose |
| ------ | --------- |
| `src/__init__.py` | App factory |
| `src/config.py` | Configuration classes |
| `src/extensions.py` | DB, Migrate, JWT setup |
| `app/api/health.py` | Example blueprint |
| `.env` | Your credentials (git-ignored) |
| `migrations/` | Database version control |

### Architecture Decisions

#### 1. **App Factory Pattern**

```python
# src/__init__.py
def create_app(config=None):
    """Creates and configures Flask app"""
```

**Why?** Allows multiple app instances (testing, staging, prod) without globals.

#### 2. **Extensions Initialization**

```python
# src/extensions.py
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def init_extensions(app):
    """Ties extensions to a specific app instance"""
```

**Why?** Prevents circular imports when models import `from src.extensions import db`.

#### 3. **Environment-Based Config**

```python
# src/config.py
class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
```

**Why?** Single source of truth. Easy to switch environments without code changes.

#### 4. **Blueprint Organization**

```python
# app/api/health.py
health_bp = Blueprint('health', __name__)
```

**Why?** As we add borrowing, user, and book routes, we keep them separate and organized.

#### 5. **Migration Management**

```bash
flask db init      # Create migrations folder (one-time)
flask db migrate   # Auto-detect model changes
flask db upgrade   # Apply to database
```

**Why?** Team members don't need to manually write SQL. Version-controlled schema.

---

### Architecture Rules

1. **Business logic in CRUD, not routes**
   - Routes: Handle HTTP only
   - CRUD: Handle database logic
   - Models: Define data structure

2. **Import extensions from `src.extensions`**
   - `from src.extensions import db`
   - Never create your own SQLAlchemy instance

3. **Use blueprints for routes**
   - Don't write routes in `src/__init__.py`
   - Put them in `app/api/your_feature.py`

4. **Config from environment**
   - Credentials in `.env`
   - Never hardcode secrets

5. **Migrations for schema changes**
   - Always run `flask db migrate` after model changes
   - Commit migration files to Git

---

### Adding a New Feature

1. **Create model** in `app/models/your_model.py`
2. **Create CRUD** in `app/crud/your_crud.py`
3. **Create routes** in `app/api/your_routes.py`
4. **Register blueprint** in `src/__init__.py`
5. **Create migration:** `flask db migrate -m "Add your feature"`
6. **Apply migration:** `flask db upgrade`

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

**Rollback to the previous migration state:**

```bash
flask db downgrade
```

### Run Tests

```bash
pytest
```

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
