# Load Tester Frontend

React TypeScript frontend for the Load Tester application, built with Vite.

## Features

- Modern React with TypeScript
- Clean, responsive UI design
- Real-time test monitoring
- Load test configuration interface
- Test results visualization

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Modern styling with gradients and animations

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development

The frontend connects to the Go backend API at `http://localhost:8080/api`.

### Available Scripts

- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
frontend/
├── src/
│   ├── App.tsx          # Main application component
│   ├── App.css          # Application styles
│   ├── index.css        # Global styles
│   └── main.tsx         # Application entry point
├── public/              # Static assets
├── index.html           # HTML template
└── package.json         # Dependencies and scripts
```

## API Integration

The frontend communicates with the backend through REST API calls:

- `GET /api/health` - Health check
- `POST /api/load-tests` - Create load test
- `GET /api/load-tests` - List all tests
- `GET /api/load-tests/{id}` - Get test details
- `POST /api/load-tests/{id}/stop` - Stop test

## UI Features

### Load Test Configuration

- URL input with validation
- HTTP method selection
- Concurrency and duration settings
- Real-time form validation

### Test Results Display

- Grid layout for test cards
- Status indicators with color coding
- Real-time updates every 2 seconds
- Test lifecycle management (start/stop)

### Responsive Design

- Mobile-friendly interface
- Adaptive grid layouts
- Touch-friendly controls
