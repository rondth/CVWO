# Debugging 500 Internal Server Error

## Step 1: Check Backend Terminal Logs

Look at the terminal where you ran `go run main.go database.go`. You should see error messages there that tell you exactly what went wrong.

Common errors you might see:
- `relation "users" does not exist` → Table doesn't exist
- `duplicate key value violates unique constraint` → Username already exists
- `syntax error` → SQL issue

## Step 2: Verify Database Tables Exist

### Option A: Using psql
```bash
psql -U postgres -d cvwo

# Check if users table exists
\dt

# Should show:
#  public | posts  | table | postgres
#  public | users  | table | postgres

# If tables don't exist, create them:
\q
psql -U postgres -d cvwo -f backend/schema.sql
```

### Option B: Check from Go
The backend should log "Database schema initialized successfully" when it starts. If you don't see this, the schema didn't initialize.

## Step 3: Manual Table Creation (If Needed)

If tables don't exist, run this:

```bash
psql -U postgres -d cvwo
```

Then paste:
```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    topic VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Type `\q` to exit.

## Step 4: Test the Database Connection

```bash
# Test if you can connect
psql -U postgres -d cvwo -c "SELECT * FROM users;"
```

If this works, the table exists. If it says "relation does not exist", create the tables.

## Step 5: Restart Backend

After creating tables, restart your backend:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd backend
go run main.go database.go
```

## Step 6: Check for Better Error Messages

The backend should show the actual error in the terminal. Look for lines like:
- `http.Error(w, err.Error(), ...)` - This shows the database error

## Common Issues

### Issue: "relation users does not exist"
**Solution:** Tables weren't created. Run the schema manually (Step 3).

### Issue: "duplicate key value violates unique constraint"
**Solution:** Username already exists. Try a different username.

### Issue: "password authentication failed"
**Solution:** Database credentials in `database.go` are wrong. Update line 13.

### Issue: "database cvwo does not exist"
**Solution:** Create the database:
```bash
psql -U postgres
CREATE DATABASE cvwo;
\q
```

## Quick Fix Command

If you're not sure what's wrong, try this complete reset:

```bash
# 1. Drop and recreate database (WARNING: Deletes all data!)
psql -U postgres -c "DROP DATABASE IF EXISTS cvwo;"
psql -U postgres -c "CREATE DATABASE cvwo;"

# 2. Create tables
psql -U postgres -d cvwo -f backend/schema.sql

# 3. Restart backend
cd backend
go run main.go database.go
```

## What to Look For

When you try to register, check:
1. **Backend terminal** - What error message appears?
2. **Browser console** - What's the exact error?
3. **Network tab** - What's the response body? (Click on the failed request)

The backend terminal will show the actual database error, which is the key to fixing this!



