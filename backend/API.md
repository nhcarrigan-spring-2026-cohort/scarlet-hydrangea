# scarlet-hydrangea Community Tool Library - API routes

## `/health` (method: `GET`)

Used to verify the connection between the backend service and the database.

Successful response (Response Code: 200) should return:

```JSON
{
  "database": "connected",
  "status": "healthy"
}
```

## `/api/users`

### `/api/users` (method: `GET`)

Returns an array of registered users (if any are present in the database), or an empty array if there are no registered users.

Successful response (Response Code: 200) returns data formatted like this:

```JSON
[
  {
    "created_at": String (Date), // example: "2026-02-17T08:20:23.748394+01:00"
    "email": String,
    "full_name": String,
    "id": Integer,
    "username": String
  }
]
```

### `/api/users` (method: `POST`)

Accepts an object containing new user data - creates a new `user` entry in the database.

Expected JSON object structure:

```JSON
{
  "email": String,  // must be a valid email address*
  "username": String,  // between 3 and 50 characters
  "full_name": String, // between 1 and 100 characters
  "password": String  // at least 8 characters
}
```

>[!NOTE]
>
> - `email` and `username` **MUST BE UNIQUE** (not already in use by another registered user).  
> - \* A "valid email address consists of at least one alphanumeric character followed by `@`, at least one alphanumeric character followed by `.`, and at least two alphanumeric characters.
> - User's password gets hashed before being stored in the database.

Successful response (Response Code: 201) returns data formatted like this:

```JSON
{
  "created_at": String (Date),
  "email": String,
  "full_name": String,
  "id": Integer,
  "username": String
}
```

### `/api/users/<user_id>` (method: `GET`)

Returns user's profile data (including list of owned and currently borrowed items) if the user with the given id was found in the database, or an error with a status code `404`.

Successful response (Response Code: 200) returns data formatted like this:

```JSON
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

## `/api/tools`

### `/api/tools` (method: `GET`)

Returns an array of all tools in the database, (including the tool's availability & owner info), or an empty array if there are no registered tools.

Successful response (Response Code: 200) returns data formatted like this:

```JSON
[
  {
    "available_quantity": Integer,
    "category": String or null,
    "condition": String,  // possible values: "new", "like_new", "good", "fair", "poor"
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
]
```

### `/api/tools/` (method: `POST`)

Accepts an object containing new tool - creates a new tool entry in the database.

Expected JSON object structure:

```JSON
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

### `/api/tools/<id>` (method: `GET`)

Returns tool data (the tool's owner data) if a tool with the given id was found in the database, or an error with a status code `404`.

Successful response (Response Code: 200) returns data formatted like this:

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

## `/api/borrows`

### `/api/borrows` (method: `GET`)

Returns an array of all\* borrow requests in the database (pending, approved, and returned), or an empty array if there are no borrow requests.

Successful response (Response Code: 200) returns data formatted like this:

```JSON
[
  {
    "approved_at": String (Date) or null,
    "borrowed_at": String (Date) or null,
    "borrower": {
      "full_name": String,
      "id": Integer,
      "username": String
    },
    "due_date": String (Date) or null,
    "id": Integer,
    "item": {
      "category": String or null,
      "condition": String,  // possible values: "new", "like_new", "good", "fair", "poor"
      "id": Integer,
      "name": String
    },
    "requested_at": String (Date),
    "returned_at": String (Date) or null,
    "status": String  // possible values: "pending", "approved", "active", "returned", "declined"
  }
]
```

### `/api/borrows` (method: `POST`)

Accepts an object containing a id of a user requesting to borrow a tool and the tool id; creates a new `borrow` entry in the database.

Expected object structure:

```JSON
{
  "borrower_id": integer,
  "item_id": integer
}
```

Successful response (Response Code: 201) returns data formatted like this:

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
  "requested_at": String,
  "returned_at": null,
  "status": "pending"
}
```

> [!NOTE]
>
> - The `approved_at`, `borrowed_at`, and `due_date` fields will **not** have values until the borrow status gets changed to `approved` with an `approve` `PATCH` request.
> - Until the borrow request is approved, the tool and can be requested by other users.
> - The `returned_at` field fill not have a value until the borrow status gets changed to `returned` with a `return` `PATCH` request.

### `/api/borrows?user_id=<id>` (method: `GET`)

Returns an array of all borrow requests, filtered with a "borrower" id.

Successful response (Response Code: 200) returns data formatted like this:

```JSON
[
  {
    "approved_at": String (Date) or null,
    "borrowed_at": String (Date) or null,
    "borrower": {
      "full_name": String,
      "id": Integer,
      "username": String
    },
    "due_date": String (Date) or null,
    "id": Integer,
    "item": {
      "category": String or null,
      "condition": String,
      "id": Integer,
      "name": String
    },
    "requested_at": String (Date),
    "returned_at": String (Date) or null,
    "status": String
  }
]
```

### `/api/borrows/<id>/approve` (method: `PATCH`)

Takes an id of an open borrow request, decrements the requested tool's availability, and sets the `due_date` of the borrow request to the week after the request has been approved.

The request response (with a status code `200`) will be the same as for the `/api/borrows`, except the `approved_at`, `borrowed_at` and `due_date` fields will now be filled, and the borrow `status` will be set to `pending`.

Successful response (Response Code: 200) returns data formatted like this:

```JSON
[
  {
    "approved_at": String (Date),
    "borrowed_at": String (Date),
    "borrower": {
      "full_name": String,
      "id": Integer,
      "username": String
    },
    "due_date": String (Date) or null,
    "id": Integer,
    "item": {
      "category": String or null,
      "condition": String,
      "id": Integer,
      "name": String
    },
    "requested_at": String (Date),
    "returned_at": null,
    "status": "approved"
  }
]
```

The `due_date` will be the the week after the `approved_at` date.

Currently, the `approved_at` and `borrowed_at` dates are the same.

### `/api/borrows/<id>/return` (method: `PATCH`)

Takes an id of a `pending` borrow request. It increments the requested tool's availability, and sets the `returned_at` of the borrow request.

Successful response (Response Code: 200) returns data formatted like this:

```JSON
[
  {
    "approved_at": String (Date),
    "borrowed_at": String (Date),
    "borrower": {
      "full_name": String,
      "id": Integer,
      "username": String
    },
    "due_date": String (Date) or null,
    "id": Integer,
    "item": {
      "category": String or null,
      "condition": String,
      "id": Integer,
      "name": String
    },
    "requested_at": String (Date),
    "returned_at": String (Date),
    "status": "returned"
  }
]
```
