# Scarlet Hydrangea Backend

Community Tool Library API - Share and borrow tools within your community.

## Quick Start

### Prerequisites
- **Python 3.12+**
- **PostgreSQL 16+**
- **uv** (package manager)
- **pgAdmin 4** (Optional GUI tool)

**Install uv:**
```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# Verify
uv --version
```

**Install PostgreSQL**
 - Download the installer for your OS from [PostgreSQL Downloads](https://www.postgresql.org/download/)
- Verify: `psql --version`

> [!NOTE]
> If you are using Windows, you need to configure your environment variables to use the `psql` command directly inside PowerShell or the Command Prompt.
>
> Navigate to your installation folder, which defaults to `C:\Program Files\PostgreSQL\`. Note the name of the folder inside (e.g., `18`), as this represents your version number.
>
> To configure your environment variables correctly:
> 1. Open Windows Start and search for "Edit system environment variables"
> 2. Click the bottom right rectangle labeled **Environment Variables**
> 3. Navigate to **Path** in the **User variables for 'Username'** section
> 4. Click **Edit**, then **New**
> 5. Add: `C:\Program Files\PostgreSQL\18\bin`
> 6. Click **New** again and add: `C:\Program Files\PostgreSQL\18\lib`
>
> *Note: Replace `18` with your specific PostgreSQL version number if different.*
>
> Click **OK** to save. You can now use `psql` in PowerShell.
---

### Setup

**1. Create Database**

1. Open PostgreSQL command line (psql)

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

    > [!NOTE]
    > - Replace `<user_name>` and `<db_password>` with the credentials you want to use to access the database (notice the quotation marks around the password!).
    > - Special characters in passwords must be URL-encoded (e.g., `@` → `%40`)
    > - `JWT_SECRET_KEY` is generated at startup if not provided (dev only)

4. (optional) open the database list with `\l` and confirm that `scarlet_hydrangea_db` has been created, and its owner is the user you created.

You can escape the database list with `q`, and exit psql with `\q`.

**2. Install Dependencies**

1. Enter the `backend` directory:

    ```bash
    cd backend
    ```

2. Install dependencies:

    ```bash
    uv sync
    ```

**3. Configure Environment**

1. Copy the `.env.example` file and rename the copy to `.env`:

    ```bash
    cp .env.example .env
    ```

2. In the `.env` file, replace `postgres` and `password` with the username and password you used for creating the database.

**4. Run Migrations**

Apply models to the database (creates required tables):

```bash
uv run flask db upgrade
```

**5. Seed the database with example data**

Add users, tools, and borrow requests to the database:

```bash
uv run seeds.py
```

**6. Start Server**

1. Start the backend server:

    ```bash
    uv run run.py
    ```

2. In your browser, open `http://127.0.0.1:5000/health`.  
If you see the response:

    ```json
    {
      "database": "connected",
      "status": "healthy"
    }
    ```

    It means that the backend server is running, and it has access to the database.

After starting the backend service, the API endpoints can be reached under the base URL address: `http://localhost:5000`.

## API endpoints

**For detailed descriptions, and request and response formats, refer to [API.md](/backend/docs/API.md).**

### `/health` (method: `GET`)

- Used to verify the connection between the backend service and the database.

### `/api/users` (methods: `GET`, `POST`)

- `GET` request returns an array of registered users (if any are present in the database), or an empty array if there are no registered users.
- `POST` request accepts an object containing new user data and creates a new `user` entry in the database.

### `/users/<user_id>` (method: `GET`)

- Returns user's profile data (including list of owned and currently borrowed items) if the user with the given id was found in the database, or an error with a status code `404`.

### `/api/tools` (methods: `GET`, `POST`)

- `GET` request returns an array of all tools in the database (including the tool's availability and owner info), or an empty array if there are no registered tools.
- `POST` request accepts an object containing new tool data, and creates a new tool entry in the database. **Requires a valid JWT Bearer token.**

### `/api/auth/login` (method: `POST`)

- `POST` request accepts a JSON object containing registered email and password for authentication.

### `/api/auth/logout` (method: `POST`)

- `POST` request accepts _any_ request body, revokes the current JWT Bearer token. **Requires a valid JWT Bearer token.**

### `/api/tools/<id>` (method: `GET`)

- Returns tool data (including the tool's owner data) if a tool with the given id was found in the database, or an error with a status code `404`.

### `/api/borrows` (methods: `GET`, `POST`)

- `GET` request returns an array of all borrow requests in the database (pending, approved, and returned), or an empty array if there are no borrow requests.
- `POST` request accepts an object containing the tool id; the borrower's identity is securely extracted from the provided authentication token. Creates a new `borrow` entry in the database. **Requires a valid JWT Bearer token.**

### `/api/borrows/own` (methods: `GET`)

- Returns an array of all borrow requests, filtered by the borrower's id (id is extracted from the JWT Bearer token). The response structure is the same as the data returned by `/api/borrows`. **Requires a valid JWT Bearer token.**

### `/api/borrows?user_id=<id>` (method: `GET`)

- Returns an array of all borrow requests, filtered by the borrower's id. The response structure is the same as the data returned by `/api/borrows`.

### `/api/borrows/<id>/approve` (method: `PATCH`)

- Takes an id of an open borrow request, decrements the requested tool's availability, and sets the `due_date` of the borrow request to one week after the request has been approved.

### `/api/borrows/<id>/return` (method: `PATCH`)

- Takes an id of an approved borrow request. It increments the requested tool's availability and sets the `returned_at` date of the borrow request.
---

## Project Structure
``` bash
backend/
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
├── README.md
├── app/
│   ├── api/                    # API endpoints
│   ├── crud/                   # CRUD operations
│   ├── models/                 # SQLAlchemy models
│   └── schemas/                # Data Serialization
|
├── migrations/                 # Flask-Migrate (auto-generated)
├── pyproject.toml              # Dependencies & project metadata
├── run.py                      # Entry point
|
├── src/
│   ├── __init__.py             # App factory
│   ├── config.py               # Environment-based config (Dev/Test/Prod)
│   └── extensions.py           # Third-party extensions (db, ma, migrate, jwt)
├── tests/                      # Unit tests
├── .env                        # Your credentials 
└── uv.lock
```
---

## Architecture

**Layer Separation:**
```
Routes (HTTP) -> Schemas (validation) -> CRUD (business logic) -> Models (DB)
```

**Key Principles:**
- Business logic in CRUD, not routes
- Schemas handle base validation and serialization
- Models define database structure only
- Use blueprints for organizing routes

**For detailed architecture documentation, refer to [ARCHITECTURE.md](/backend/docs/ARCHITECTURE.md).**

---

## Development

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
uv run flask db migrate -m "Add User model"
```

**Apply pending migrations:**

```bash
uv run flask db upgrade
```

**View migration status:**

```bash
flask db current
flask db history
```

**Rollback to the previous migration state:**

```bash
uv run flask db downgrade
```
---

## Troubleshooting

### `ModuleNotFoundError: flask_migrate`

```bash
uv add flask-migrate flask-jwt-extended
```

### `RuntimeError: SQLALCHEMY_DATABASE_URI not set`

Ensure `.env` file exists and `FLASK_ENV` is loaded before importing config.

### `FATAL: password authentication failed`

Check `.env` credentials match your PostgreSQL password. Special characters need URL encoding.

### `psycopg2.ProgrammingError: relation does not exist`

Run migrations: `flask db upgrade` or `uv run flask db upgrade`

---

## Questions?

This is a learning space! Ask in PRs, comments, or on Discord. We're building this together.
