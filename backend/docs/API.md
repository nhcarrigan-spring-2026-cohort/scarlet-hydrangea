# API Documentation

**Base URL:** `http://localhost:5000`

**Common Status Codes:**
- `200` - OK
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (duplicate information)

## Health Check

### `GET /health` 

Used to verify the connection between the backend service and the database.

Successful response (Response Code: 200) should return:

```json
{
  "database": "connected",
  "status": "healthy"
}
```
---

## Users API

### `GET /api/users`

Returns an array of registered users or an empty array if there are no registered users.

Successful response (Response Code: 200) returns data formatted like this:

```json
[
  {
    "created_at": Date, // example: "2026-02-17T08:20:23.748394+01:00"
    "email": String,
    "full_name": String,
    "id": Integer,
    "username": String
  }
]
```
---
### `POST /api/users`

Creates a new `user` entry in the database.

Expected JSON Request body:

```json
{
  "email": String,  // must be unique & valid email address
  "username": String,  // between 3 and 50 characters, must be unique
  "full_name": String, // between 1 and 100 characters
  "password": String  // at least 8 characters
}
```

>[!NOTE] 
> - A valid email address consists of at least one alphanumeric character followed by `@`, at least one alphanumeric character followed by `.`, and at least two alphanumeric characters.

Successful response (Response Code: 201) returns data formatted like this:

```json
{
  "created_at": DateTime,
  "email": String,
  "full_name": String,
  "id": Integer,
  "username": String
}
```
> [!NOTE]
> 
> User's password gets hashed before being stored in the database.
---

### `GET /api/users/<user_id>` 

Returns user's profile data including list of owned items and borrow history. Returns `404` if user not found.

Successful response (Response Code: 200) returns data formatted like this:

```json
{
  "borrows": [
    {
      "borrowed_at": String (Date) or null,
      "due_date": String (Date) or null,
      "id": Integer,
      "requested_at": String,
      "returned_at": String (Date) or null,
      "status": String // possible values: "pending", "approved", "active", "returned", "declined"
    }
  ],
  "created_at": String (Date),
  "email": String,
  "full_name": String,
  "id": Integer,
  "owned_items": [
    {
      "available_quantity": Integer,
      "category": String or null,
      "condition": String, // possible values: "new", "like_new", "good", "fair", "poor"
      "id": Integer,
      "is_available": Boolean,
      "name": String
    }
  ],
  "username": String
}
```
---

### `POST /api/auth/login`

Authenticates a user and returns an access token for subsequent API requests

Expected JSON Request body:

```json
{
  "email": String,
  "password": String
}
```

Successful response (Response Code: 201) returns data formatted like this:

```json
{
  "access_token": String
}
```
---

## Tools API

### `GET /api/tools`

Returns an array of all tools in the database, (including availability & owner info), or an empty array if there are no registered tools.

Successful response (Response Code: 200) returns data formatted like this:

```json
[
  {
    "available_quantity": Integer,
    "category": String or null,
    "condition": String,  // possible values: "new", "like_new", "good", "fair", "poor"
    "created_at": Date,
    "description": String or null,
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
]
```
---

### `POST /api/tools/`

Creates a new tool entry in the database.

Expected JSON request body:

```json
{
  "condition": String, // valid values: "new", "like_new", "good", "fair", "poor"
  "name": String, // between 3 and 100 characters
  "owner_id": Integer, // valid user id
  "total_quantity": Integer ,// minimum :1
  "category": String, // not required
  "description": String, // not required
}
```

If valid tool data is provided, a new tool will be added to the database.

Successful response (Response Code: 201) returns data formatted like this:

```JSON
{
  "available_quantity": Integer,
  "category": String or null,
  "condition": String,
  "created_at": String (Date),
  "description": String or null,
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
---

### `GET /api/tools/<id>` 

Returns tool data including owner information. Returns a `404` error if tool not found.

Successful response (Response Code: 200) returns data formatted like this:

```json
{
  "available_quantity": Integer,
  "category": String or null,
  "condition": String,
  "created_at": Date,
  "description": String or null,
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

## Borrows API

### `GET /api/borrows` 

Returns an array of all borrow requests in the database (pending, approved, and returned), or an empty array if there are no borrow requests.

Successful response (Response Code: 200) returns data formatted like this:

```json
[
  {
    "approved_at": Date or null,
    "borrowed_at": Date or null,
    "borrower": {
      "full_name": String,
      "id": Integer,
      "username": String
    },
    "due_date": Date or null,
    "id": Integer,
    "item": {
      "category": String or null,
      "condition": String,  // possible values: "new", "like_new", "good", "fair", "poor"
      "id": Integer,
      "name": String
    },
    "requested_at": Date,
    "returned_at": Date or null,
    "status": String  // possible values: "pending", "approved", "active", "returned", "declined"
  }
]
```
---

### `POST /api/borrows` 

Creates a new `borrow` entry in the database.

Expected JSON request body:

```json
{
  "borrower_id": integer,
  "item_id": integer
}
```

Successful response (Response Code: 201) returns data formatted like this:

```json
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
  "requested_at": String,
  "returned_at": null,
  "status": "pending"
}
```

> [!NOTE]
>
> - Both `item_id` and `borrower_id` must reference existing records.
> - Tool must have `available_quantity > 0`
> - The `approved_at`, `borrowed_at`, and `due_date` fields will be `null` until the borrow is `approved` via `PATCH /api/borrows/<id>/approve`
> - Until the borrow request is approved, the tool and can be requested by other users.
> - The `returned_at` field will be `null` until the borrow is marked as `returned` via `PATCH /api/borrows/<id>/return`
---

### `GET /api/borrows?user_id=<id>` 

Returns an array of all borrow requests, filtered by borrower ID.

Successful response (Response Code: 200) returns data formatted like this:

```json
[
  {
    "approved_at": Date or null,
    "borrowed_at": Date or null,
    "borrower": {
      "full_name": String,
      "id": Integer,
      "username": String
    },
    "due_date": Date or null,
    "id": Integer,
    "item": {
      "category": String or null,
      "condition": String,
      "id": Integer,
      "name": String
    },
    "requested_at": Date,
    "returned_at": Date or null,
    "status": String
  }
]
```
---

### `PATCH /api/borrows/<id>/approve` 

Approves a pending borrow request. Decrements the tool's `available_quantity` and sets the `due_date` to one week from approval.

The response (with a status code `200`) will be the same structure as borrow objects, with `approved_at`, `borrowed_at`, and `due_date` now populated, and `status` changed to `"approved"`.

---

### `PATCH /api/borrows/<id>/return`

Marks an approved borrow as returned. Increments the tool's `available_quantity` and records the return timestamp.

The response (with a status code `200`) will be the same structure as borrow objects, with `returned_at` now populated and `status` changed to `"returned"`.

---
