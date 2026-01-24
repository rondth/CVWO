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

1. **Install Go dependencies**:
   ```bash
   cd backend
   go mod tidy
   ```

2. **Set up PostgreSQL database**:
   - Create a PostgreSQL database named `cvwo`
   - Run the schema setup:
   ```bash
   psql -U your_username -d postgres -f schema.sql
   ```

3. **Update database connection**:
   - Edit `backend/main.go` and update the connection string with your PostgreSQL credentials:
   ```go
   connStr := "host=localhost port=5432 user=your_username password=your_password dbname=cvwo sslmode=disable"
   ```

4. **Start the backend server**:
   ```bash
   cd backend
   go run main.go
   ```
   The server will start on `http://localhost:8080`

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

## API Endpoints

### Authentication
- `POST /api/login` - Login with username
- `POST /api/register` - Register new user

### Posts
- `GET /api/posts?user_id={id}` - Get posts for a user
- `POST /api/posts` - Create a new post
- `PUT /api/posts/{id}` - Update a post
- `DELETE /api/posts/{id}` - Delete a post

## Features

- User authentication (simple username-based)
- Create posts with title, body, and topic
- View and edit your own posts in the dashboard
- Responsive Material-UI interface

## Development

- Backend uses Chi router for HTTP handling
- CORS is configured to allow requests from `http://localhost:3000`
- Database models are defined in the `models` package
- API handlers are organized in the `handlers` package
- Frontend uses React hooks for state management and API calls
# Gossip-with-Go

Eron Dathan

#Usage of AI.
AI was used in inspiration for the code format and UI.
