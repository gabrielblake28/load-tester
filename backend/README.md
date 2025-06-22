# Load Tester Backend

Go-based API server and load testing engine.

## Features

- RESTful API for load test configuration
- In-memory test result storage
- CORS support for frontend integration
- Basic load test lifecycle management

## API Endpoints

### Health Check

- `GET /api/health` - Check API health status

### Load Tests

- `POST /api/load-tests` - Create a new load test
- `GET /api/load-tests` - List all load tests
- `GET /api/load-tests/{id}` - Get specific load test details
- `POST /api/load-tests/{id}/stop` - Stop a running load test

## Load Test Configuration

```json
{
  "url": "https://api.example.com/endpoint",
  "method": "GET",
  "headers": {
    "Authorization": "Bearer token",
    "Content-Type": "application/json"
  },
  "body": "{\"key\": \"value\"}",
  "concurrency": 10,
  "duration": 30,
  "requests_per_sec": 50
}
```

## Running the Server

```bash
# Install dependencies
go mod tidy

# Run the server
go run main.go

# Build binary
go build -o bin/load-tester main.go
```

The server will start on `http://localhost:8080`

## Development Notes

- Currently uses in-memory storage for test results
- Load test execution is not yet implemented (TODO)
- CORS is configured for frontend development
- Basic validation and error handling included
