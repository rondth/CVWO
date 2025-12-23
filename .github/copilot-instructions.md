# CVWO Project - AI Coding Agent Instructions

## Architecture Overview
This is a full-stack web application with a Go backend and React TypeScript frontend.

- **Backend**: Go application using Chi router for HTTP handling and PostgreSQL for data persistence.
- **Frontend**: React app built with Create React App, using TypeScript and Material-UI (MUI) for UI components.
- **Data Flow**: Frontend communicates with backend via REST APIs (to be implemented).

## Key Files and Structure
- `backend/main.go`: Entry point, currently prints "Hello, World!".
- `backend/models/user.go`: Defines User struct with ID, Username, CreatedAt.
- `frontend/src/App.tsx`: Main React component, uses MUI Container, Typography, Button.
- `frontend/package.json`: Lists dependencies including @mui/material, React 19, TypeScript.

## Development Workflows
- **Backend**: Run with `go run main.go` from backend directory.
- **Frontend**: Use `npm start` to launch dev server on localhost:3000.
- **Build Frontend**: `npm run build` for production build.
- **Tests**: Frontend has `npm test` setup, but no tests written yet.

## Conventions and Patterns
- Use TypeScript for frontend components.
- Import MUI components directly: `import { Button } from '@mui/material';`
- Backend models use JSON tags for serialization: `json:"id"`.
- Follow Go standard naming (e.g., User struct, not user).

## Integration Points
- Backend ready for PostgreSQL connection (pq driver included).
- Frontend expects API endpoints from backend (not yet implemented).

## Notes
- Project is in early stages; expand backend API routes and frontend features as needed.
- Use Chi for routing in backend, e.g., `r := chi.NewRouter()`.