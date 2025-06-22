# Load Tester

A monorepo for an API load testing application with a Go backend and TypeScript React frontend.

## Project Structure

```
load-tester/
├── backend/          # Go API server and load testing engine
├── frontend/         # React TypeScript frontend (Vite)
├── README.md
└── package.json      # Root package.json for workspace management
```

## Getting Started

### Prerequisites

- Go 1.21+
- Node.js 18+
- npm or yarn

### Backend (Go)

```bash
cd backend
go mod tidy
go run main.go
```

The backend API will be available at `http://localhost:8080`

### Frontend (React + TypeScript + Vite)

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Development

This is set up as a monorepo where you can work on the backend and frontend independently. The backend contains the load testing engine and API, while the frontend provides a web interface for configuring and monitoring load tests.

### Backend Features (Planned)

- REST API for load test configuration
- Load testing engine with various strategies
- Real-time metrics and reporting
- Test result storage and history

### Frontend Features (Planned)

- Load test configuration UI
- Real-time test monitoring dashboard
- Test results visualization
- Test history and comparison
