# Troubleshooting: ERR_CONNECTION_REFUSED

## Problem
The frontend cannot connect to the backend server. Error: `ERR_CONNECTION_REFUSED`

## Root Cause
The backend server is not running on port 8080.

---

## Solution: Start the Backend Server

### Step 1: Check Prerequisites

#### 1.1 Verify PostgreSQL is Running
```bash
# Check if PostgreSQL is running
pg_isready

# Or check if port 5432 is in use
lsof -i :5432
```

If PostgreSQL is not running, start it:
```bash
# macOS (using Homebrew)
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Or check your system's PostgreSQL service
```

#### 1.2 Verify Database Exists
```bash
# Connect to PostgreSQL
psql -U postgres

# Check if database exists
\l

# If database 'cvwo' doesn't exist, create it:
CREATE DATABASE cvwo;
\q
```

#### 1.3 Verify Database Connection String
Check `backend/database.go` line 13:
```go
connStr := "host=localhost port=5432 user=postgres password=cvwo dbname=cvwo sslmode=disable"
```

**Update if needed:**
- `user=postgres` → Your PostgreSQL username
- `password=cvwo` → Your PostgreSQL password
- `dbname=cvwo` → Your database name

---

### Step 2: Start the Backend Server

#### Option A: Using `go run` (Development)
```bash
# Navigate to backend directory
cd backend

# Start the server
go run main.go database.go
```

You should see:
```
Database schema initialized successfully
Server starting on :8080
```

#### Option B: Using `go build` (Production-like)
```bash
cd backend
go build -o server .
./server
```

---

### Step 3: Verify Backend is Running

#### Test the Backend Directly
Open your browser or use curl:
```bash
# Test root endpoint
curl http://localhost:8080/

# Should return: "Hello from the backend!"
```

Or open in browser: `http://localhost:8080/`

#### Check if Port 8080 is Listening
```bash
lsof -i :8080
```

You should see the Go process using port 8080.

---

### Step 4: Test API Endpoints

```bash
# Test login endpoint
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser"}'

# Test register endpoint
curl -X POST http://localhost:8080/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser"}'
```

---

## Common Issues & Solutions

### Issue 1: Database Connection Failed
**Error:** `FATAL: password authentication failed` or `connection refused`

**Solution:**
1. Check PostgreSQL is running
2. Verify username/password in `database.go`
3. Check PostgreSQL allows local connections (check `pg_hba.conf`)

### Issue 2: Database Doesn't Exist
**Error:** `FATAL: database "cvwo" does not exist`

**Solution:**
```bash
psql -U postgres
CREATE DATABASE cvwo;
\q
```

### Issue 3: Tables Don't Exist
**Error:** `relation "users" does not exist`

**Solution:**
The schema should auto-initialize, but if it doesn't:
```bash
psql -U postgres -d cvwo -f backend/schema.sql
```

### Issue 4: Port Already in Use
**Error:** `bind: address already in use`

**Solution:**
```bash
# Find what's using port 8080
lsof -i :8080

# Kill the process (replace PID with actual process ID)
kill -9 <PID>

# Or use a different port in main.go
http.ListenAndServe(":8081", r)
# And update frontend/api.ts:
# const API_BASE_URL = 'http://localhost:8081/api';
```

### Issue 5: Go Dependencies Missing
**Error:** `cannot find package` or `go: cannot find module`

**Solution:**
```bash
cd backend
go mod tidy
go mod download
```

---

## Quick Start Checklist

- [ ] PostgreSQL is installed and running
- [ ] Database `cvwo` exists
- [ ] Database connection string in `database.go` is correct
- [ ] Go dependencies installed (`go mod tidy`)
- [ ] Backend server started (`go run main.go database.go`)
- [ ] Backend responds at `http://localhost:8080/`
- [ ] Frontend is running on `http://localhost:3000`
- [ ] CORS is configured correctly (already done in main.go)

---

## Running Both Servers

You need **TWO terminal windows**:

### Terminal 1: Backend
```bash
cd backend
go run main.go database.go
```

### Terminal 2: Frontend
```bash
cd frontend
npm start
```

Both should be running simultaneously!

---

## Verify Everything Works

1. **Backend:** Open `http://localhost:8080/` → Should see "Hello from the backend!"
2. **Frontend:** Open `http://localhost:3000` → Should see your React app
3. **Login:** Try logging in → Should work now!

---

## Still Having Issues?

1. Check backend terminal for error messages
2. Check browser console (F12) for detailed errors
3. Check Network tab in browser DevTools to see the failed request
4. Verify both servers are running in separate terminals
5. Make sure no firewall is blocking port 8080



