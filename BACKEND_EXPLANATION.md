# Backend Files Explanation

## 📁 File Structure Overview

```
backend/
├── main.go              # Application entry point, sets up HTTP server
├── database.go          # Database connection and schema initialization
├── schema.sql           # SQL table definitions
├── handlers/
│   ├── user.go         # User authentication handlers (login/register)
│   └── post.go         # Post CRUD operation handlers
└── models/
    ├── user.go         # User data structure
    └── post.go         # Post data structure
```

---

## 📄 **main.go** - Application Entry Point

**Purpose**: This is the main entry point that starts the HTTP server and sets up all routes.

### Functions Called:

#### `main()` - Entry Point Function
- **What it does**: 
  - Initializes the database connection
  - Creates an HTTP router
  - Sets up middleware (logging, error recovery, CORS)
  - Registers all API routes
  - Starts the HTTP server on port 8080

- **Functions it calls**:
  - `InitDB()` - Connects to database
  - `db.Close()` - Closes database connection when program exits (deferred)
  - `chi.NewRouter()` - Creates a new Chi router instance
  - `r.Use(middleware.Logger)` - Adds request logging middleware
  - `r.Use(middleware.Recoverer)` - Adds panic recovery middleware
  - `r.Use(cors.Handler(...))` - Adds CORS (Cross-Origin Resource Sharing) middleware
  - `r.Get("/", ...)` - Registers a GET route for the root path
  - `r.Post("/api/login", ...)` - Registers POST route for login
  - `r.Post("/api/register", ...)` - Registers POST route for registration
  - `r.Get("/api/posts", ...)` - Registers GET route to fetch posts
  - `r.Post("/api/posts", ...)` - Registers POST route to create posts
  - `r.Put("/api/posts/{id}", ...)` - Registers PUT route to update posts
  - `r.Delete("/api/posts/{id}", ...)` - Registers DELETE route to delete posts
  - `log.Println(...)` - Logs server startup message
  - `http.ListenAndServe(":8080", r)` - Starts HTTP server on port 8080

#### Route Handler Functions (from handlers package):
- `handlers.LoginHandler(db)` - Returns handler function for login
- `handlers.RegisterHandler(db)` - Returns handler function for registration
- `handlers.GetPostsHandler(db)` - Returns handler function to get posts
- `handlers.CreatePostHandler(db)` - Returns handler function to create posts
- `handlers.UpdatePostHandler(db)` - Returns handler function to update posts
- `handlers.DeletePostHandler(db)` - Returns handler function to delete posts

---

## 📄 **database.go** - Database Connection Management

**Purpose**: Handles database connection setup and schema initialization.

### Functions:

#### `InitDB() *sql.DB`
- **What it does**: 
  - Establishes connection to PostgreSQL database
  - Tests the connection with a ping
  - Initializes database schema (creates tables)
  - Returns the database connection object

- **Functions it calls**:
  - `sql.Open("postgres", connStr)` - Opens a database connection (doesn't actually connect yet)
  - `log.Fatal(err)` - Logs error and exits program if connection fails
  - `db.Ping()` - Actually connects to database and verifies it's working
  - `initSchema(db)` - Initializes database tables

#### `initSchema(db *sql.DB) error`
- **What it does**: 
  - Reads the `schema.sql` file from disk
  - Executes the SQL to create tables if they don't exist
  - Handles multiple possible file paths (for different run contexts)

- **Functions it calls**:
  - `os.ReadFile(path)` - Reads file contents from disk
  - `log.Printf(...)` - Logs warning if schema file not found
  - `db.Exec(string(schemaSQL))` - Executes SQL statements to create tables
  - `log.Println(...)` - Logs success message

---

## 📄 **handlers/user.go** - User Authentication Handlers

**Purpose**: Handles user login and registration operations.

### Types:

#### `UserRequest struct`
- **What it is**: Request body structure for user operations
- **Fields**: `Username string` - The username from JSON request

### Functions:

#### `LoginHandler(db *sql.DB) http.HandlerFunc`
- **What it does**: 
  - Handles POST requests to `/api/login`
  - If user exists, returns user data
  - If user doesn't exist, creates new user automatically (auto-registration)
  - Validates username (not empty, max 255 chars)

- **Functions it calls**:
  - `json.NewDecoder(r.Body).Decode(&req)` - Parses JSON request body into UserRequest struct
  - `http.Error(...)` - Sends HTTP error response
  - `db.QueryRow(...).Scan(...)` - Executes SQL query and scans result into variables
  - `w.Header().Set(...)` - Sets HTTP response header
  - `json.NewEncoder(w).Encode(user)` - Converts Go struct to JSON and writes to response

- **SQL Operations**:
  - `SELECT id, username, created_at FROM users WHERE username = $1` - Finds existing user
  - `INSERT INTO users (username) VALUES ($1) RETURNING ...` - Creates new user if not found

#### `RegisterHandler(db *sql.DB) http.HandlerFunc`
- **What it does**: 
  - Handles POST requests to `/api/register`
  - Checks if username already exists
  - Creates new user if username is available
  - Returns error if username already taken

- **Functions it calls**:
  - `json.NewDecoder(r.Body).Decode(&req)` - Parses JSON request body
  - `http.Error(...)` - Sends HTTP error response
  - `db.QueryRow(...).Scan(...)` - Executes SQL queries
  - `w.Header().Set(...)` - Sets response header
  - `json.NewEncoder(w).Encode(user)` - Encodes response to JSON

- **SQL Operations**:
  - `SELECT id FROM users WHERE username = $1` - Checks if user exists
  - `INSERT INTO users (username) VALUES ($1) RETURNING ...` - Creates new user

---

## 📄 **handlers/post.go** - Post CRUD Handlers

**Purpose**: Handles all post-related operations (Create, Read, Update, Delete).

### Types:

#### `CreatePostRequest struct`
- **What it is**: Request body for creating posts
- **Fields**: `Title`, `Body`, `Topic`, `UserID`

#### `UpdatePostRequest struct`
- **What it is**: Request body for updating posts
- **Fields**: `Title`, `Body`, `Topic`

### Functions:

#### `GetPostsHandler(db *sql.DB) http.HandlerFunc`
- **What it does**: 
  - Handles GET requests to `/api/posts?user_id=X`
  - Fetches all posts for a specific user
  - Returns posts ordered by creation date (newest first)
  - Validates that user exists before querying

- **Functions it calls**:
  - `r.URL.Query().Get("user_id")` - Extracts query parameter from URL
  - `strconv.ParseInt(...)` - Converts string to integer
  - `http.Error(...)` - Sends error responses
  - `db.QueryRow(...).Scan(...)` - Checks if user exists
  - `db.Query(...)` - Executes query that returns multiple rows
  - `rows.Close()` - Closes database rows (deferred)
  - `rows.Next()` - Iterates through result rows
  - `rows.Scan(...)` - Scans row data into struct
  - `rows.Err()` - Checks for iteration errors
  - `json.NewEncoder(w).Encode(posts)` - Encodes array to JSON

- **SQL Operations**:
  - `SELECT EXISTS(SELECT 1 FROM users WHERE id = $1)` - Verifies user exists
  - `SELECT ... FROM posts WHERE user_id = $1 ORDER BY created_at DESC` - Gets user's posts

#### `CreatePostHandler(db *sql.DB) http.HandlerFunc`
- **What it does**: 
  - Handles POST requests to `/api/posts`
  - Creates a new post in the database
  - Validates all required fields (title, body, topic, user_id)
  - Validates field lengths (title/topic max 255 chars)
  - Verifies user exists before creating post

- **Functions it calls**:
  - `json.NewDecoder(r.Body).Decode(&req)` - Parses request body
  - `http.Error(...)` - Sends validation errors
  - `db.QueryRow(...).Scan(...)` - Verifies user exists and creates post
  - `w.Header().Set(...)` - Sets response header
  - `json.NewEncoder(w).Encode(post)` - Returns created post as JSON

- **SQL Operations**:
  - `SELECT EXISTS(SELECT 1 FROM users WHERE id = $1)` - Verifies user exists
  - `INSERT INTO posts (...) VALUES (...) RETURNING ...` - Creates new post

#### `UpdatePostHandler(db *sql.DB) http.HandlerFunc`
- **What it does**: 
  - Handles PUT requests to `/api/posts/{id}?user_id=X`
  - Updates an existing post
  - Only allows update if post belongs to the requesting user (security)
  - Validates all fields
  - Updates the `updated_at` timestamp

- **Functions it calls**:
  - `chi.URLParam(r, "id")` - Extracts ID from URL path
  - `strconv.ParseInt(...)` - Converts string to integer
  - `json.NewDecoder(r.Body).Decode(&req)` - Parses request body
  - `r.URL.Query().Get("user_id")` - Gets user_id from query string
  - `http.Error(...)` - Sends error responses
  - `db.QueryRow(...).Scan(...)` - Updates post and returns updated data
  - `w.Header().Set(...)` - Sets response header
  - `json.NewEncoder(w).Encode(post)` - Returns updated post

- **SQL Operations**:
  - `UPDATE posts SET ... WHERE id = $4 AND user_id = $5 RETURNING ...` - Updates post (only if owned by user)

#### `DeletePostHandler(db *sql.DB) http.HandlerFunc`
- **What it does**: 
  - Handles DELETE requests to `/api/posts/{id}?user_id=X`
  - Deletes a post from database
  - Only allows deletion if post belongs to requesting user (security)
  - Returns 204 No Content on success

- **Functions it calls**:
  - `chi.URLParam(r, "id")` - Extracts ID from URL
  - `strconv.ParseInt(...)` - Converts to integer
  - `r.URL.Query().Get("user_id")` - Gets user_id from query
  - `http.Error(...)` - Sends error responses
  - `db.Exec(...)` - Executes DELETE SQL statement
  - `result.RowsAffected()` - Checks how many rows were deleted
  - `w.WriteHeader(http.StatusNoContent)` - Sends 204 status code

- **SQL Operations**:
  - `DELETE FROM posts WHERE id = $1 AND user_id = $2` - Deletes post (only if owned by user)

---

## 📄 **models/user.go** - User Data Model

**Purpose**: Defines the User data structure used throughout the application.

### Type:

#### `User struct`
- **What it is**: Go struct representing a user in the database
- **Fields**:
  - `ID int64` - User's unique identifier (maps to `id` in JSON)
  - `Username string` - User's username (maps to `username` in JSON)
  - `CreatedAt time.Time` - When user was created (maps to `created_at` in JSON)
- **JSON Tags**: Used for serialization/deserialization when sending/receiving JSON

---

## 📄 **models/post.go** - Post Data Model

**Purpose**: Defines the Post data structure used throughout the application.

### Type:

#### `Post struct`
- **What it is**: Go struct representing a post in the database
- **Fields**:
  - `ID int64` - Post's unique identifier
  - `Title string` - Post title
  - `Body string` - Post content/body
  - `Topic string` - Post topic/category
  - `UserID int64` - ID of user who created the post
  - `CreatedAt time.Time` - When post was created
  - `UpdatedAt time.Time` - When post was last updated

---

## 📄 **schema.sql** - Database Schema

**Purpose**: SQL definitions for database tables.

### Tables:

#### `users` table
- **Columns**:
  - `id SERIAL PRIMARY KEY` - Auto-incrementing unique ID
  - `username VARCHAR(255) UNIQUE NOT NULL` - Unique username, max 255 chars
  - `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP` - Auto-set creation time

#### `posts` table
- **Columns**:
  - `id SERIAL PRIMARY KEY` - Auto-incrementing unique ID
  - `title VARCHAR(255) NOT NULL` - Post title, max 255 chars
  - `body TEXT NOT NULL` - Post content (unlimited length)
  - `topic VARCHAR(255) NOT NULL` - Post topic, max 255 chars
  - `user_id INTEGER NOT NULL REFERENCES users(id)` - Foreign key to users table
  - `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP` - Auto-set creation time
  - `updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP` - Auto-set update time

---

## 🔄 Function Call Flow Example

### Example: Creating a Post

1. **Client** sends POST request to `http://localhost:8080/api/posts`
2. **main.go** → `r.Post("/api/posts", handlers.CreatePostHandler(db))` routes request
3. **handlers/post.go** → `CreatePostHandler(db)` receives request
4. **CreatePostHandler** → `json.NewDecoder(r.Body).Decode(&req)` parses JSON
5. **CreatePostHandler** → Validates all fields
6. **CreatePostHandler** → `db.QueryRow(...)` verifies user exists
7. **CreatePostHandler** → `db.QueryRow(...)` inserts post into database
8. **CreatePostHandler** → `json.NewEncoder(w).Encode(post)` sends JSON response
9. **Client** receives created post data

---

## 🔑 Key Concepts

### Handler Functions Pattern
All handlers return `http.HandlerFunc` which is a function that takes `(http.ResponseWriter, *http.Request)`. This allows dependency injection (passing `db` to handlers).

### Database Operations
- `db.QueryRow()` - For single row results (SELECT one, INSERT with RETURNING)
- `db.Query()` - For multiple row results (SELECT many)
- `db.Exec()` - For operations that don't return data (DELETE, UPDATE without RETURNING)

### Security
- Ownership validation: Update/Delete operations check `user_id` to ensure users can only modify their own posts
- Input validation: All handlers validate input before database operations
- SQL injection prevention: Using parameterized queries (`$1`, `$2`, etc.) instead of string concatenation

### Error Handling
- HTTP status codes: 400 (Bad Request), 404 (Not Found), 409 (Conflict), 500 (Internal Server Error)
- All database errors are caught and returned as appropriate HTTP responses



