# CVWO Full-Stack Application

A full-stack web application with a Go backend and React TypeScript frontend for creating and managing posts.

## Architecture

- **Backend**: Go application using Chi router, PostgreSQL database
- **Frontend**: React app with TypeScript and Material-UI
- **Database**: PostgreSQL

## Setup Instructions

### Prerequisites

- Go 1.19+ installed
- Node.js 16+ installed
- PostgreSQL installed and running

### Backend Setup

1. **Create PostgreSQL database**:
   ```bash
   psql -U postgres
   CREATE DATABASE cvwo;
   \q
   ```

2. **Update database connection** (if needed):
   - Edit `backend/database.go` line 13 and update the connection string with your PostgreSQL credentials:
   ```go
   connStr := "host=localhost port=5432 user=postgres password=cvwo dbname=cvwo sslmode=disable"
   ```
   - Default credentials: `user=postgres`, `password=cvwo`, `dbname=cvwo`
   - The schema will be automatically initialized when the server starts

3. **Install Go dependencies**:
   ```bash
   cd backend
   go mod tidy
   ```

4. **Start the backend server**:
   ```bash
   cd backend
   go run main.go database.go
   ```
   The server will start on `http://localhost:8080`
   You should see: "Database schema initialized successfully" and "Server starting on :8080"

### Frontend Setup

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```
   The frontend will be available at `http://localhost:3000`

## Running the Application

**Important**: You need to run both servers simultaneously in separate terminal windows:

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

## API Endpoints

### Authentication
- `POST /api/login` - Login with username
- `POST /api/register` - Register new user

### Posts
- `GET /api/posts?user_id={id}` - Get posts for a user
- `POST /api/posts` - Create a new post
- `PUT /api/posts/{id}?user_id={id}` - Update a post
- `DELETE /api/posts/{id}?user_id={id}` - Delete a post
- `GET /api/feed` - Get latest 10 posts (for home feed)

### Comments
- `GET /api/posts/{id}/comments` - Get comments for a specific post

## Features

- User authentication (simple username-based)
- Create posts with title, body, and topic
- View and edit your own posts in the dashboard
- View all posts in the home feed
- Responsive Material-UI interface
- Comments system (in development)

## Development

- Backend uses Chi router for HTTP handling
- CORS is configured to allow requests from `http://localhost:3000`
- Database schema auto-initializes on server start
- Database models are defined in the `models` package
- API handlers are organized in the `handlers` package
- Frontend uses React hooks for state management and API calls

## Troubleshooting

- **Connection refused errors**: Make sure both backend and frontend servers are running
- **Database connection errors**: Verify PostgreSQL is running and credentials in `database.go` are correct
- **Schema errors**: The schema auto-initializes, but you can manually run `psql -U postgres -d cvwo -f backend/schema.sql` if needed

Eron Dathan

# Usage of AI. AI was used in inspiration for the code format and UI.
