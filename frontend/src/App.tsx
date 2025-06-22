import { useState, useEffect } from "react";
import "./App.css";

interface LoadTestConfig {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string;
  concurrency: number;
  duration: number;
  requests_per_sec: number;
}

interface LoadTestResult {
  id: string;
  config: LoadTestConfig;
  status: string;
  start_time: string;
  end_time?: string;
  total_requests: number;
  success_requests: number;
  failed_requests: number;
  avg_response_time: number;
  min_response_time: number;
  max_response_time: number;
}

const API_BASE = "http://localhost:8080/api";

function App() {
  const [tests, setTests] = useState<LoadTestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<LoadTestConfig>({
    url: "https://httpbin.org/get",
    method: "GET",
    headers: {},
    body: "",
    concurrency: 10,
    duration: 30,
    requests_per_sec: 10,
  });

  const fetchTests = async () => {
    try {
      const response = await fetch(`${API_BASE}/load-tests`);
      if (response.ok) {
        const data = await response.json();
        setTests(data);
      }
    } catch (error) {
      console.error("Failed to fetch tests:", error);
    }
  };

  const createTest = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/load-tests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        await fetchTests();
      }
    } catch (error) {
      console.error("Failed to create test:", error);
    } finally {
      setLoading(false);
    }
  };

  const stopTest = async (testId: string) => {
    try {
      await fetch(`${API_BASE}/load-tests/${testId}/stop`, {
        method: "POST",
      });
      await fetchTests();
    } catch (error) {
      console.error("Failed to stop test:", error);
    }
  };

  useEffect(() => {
    fetchTests();
    const interval = setInterval(fetchTests, 2000); // Refresh every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Load Tester</h1>
        <p>API Load Testing Tool</p>
      </header>

      <main className="main-content">
        <section className="test-config">
          <h2>Create Load Test</h2>
          <div className="form-group">
            <label>Target URL:</label>
            <input
              type="url"
              value={config.url}
              onChange={(e) => setConfig({ ...config, url: e.target.value })}
              placeholder="https://api.example.com/endpoint"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Method:</label>
              <select
                value={config.method}
                onChange={(e) =>
                  setConfig({ ...config, method: e.target.value })
                }
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div className="form-group">
              <label>Concurrency:</label>
              <input
                type="number"
                value={config.concurrency}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    concurrency: parseInt(e.target.value),
                  })
                }
                min="1"
                max="1000"
              />
            </div>

            <div className="form-group">
              <label>Duration (seconds):</label>
              <input
                type="number"
                value={config.duration}
                onChange={(e) =>
                  setConfig({ ...config, duration: parseInt(e.target.value) })
                }
                min="1"
                max="3600"
              />
            </div>
          </div>

          <button
            onClick={createTest}
            disabled={loading || !config.url}
            className="create-test-btn"
          >
            {loading ? "Creating..." : "Create Load Test"}
          </button>
        </section>

        <section className="test-results">
          <h2>Test Results ({tests.length})</h2>
          {tests.length === 0 ? (
            <div className="no-tests">
              <p>No load tests created yet.</p>
              <p>Create your first test above to get started!</p>
            </div>
          ) : (
            <div className="tests-grid">
              {tests.map((test) => (
                <div key={test.id} className={`test-card ${test.status}`}>
                  <div className="test-header">
                    <h3>{test.id}</h3>
                    <span className={`status-badge ${test.status}`}>
                      {test.status}
                    </span>
                  </div>

                  <div className="test-details">
                    <p>
                      <strong>URL:</strong> {test.config.url}
                    </p>
                    <p>
                      <strong>Method:</strong> {test.config.method}
                    </p>
                    <p>
                      <strong>Concurrency:</strong> {test.config.concurrency}
                    </p>
                    <p>
                      <strong>Duration:</strong> {test.config.duration}s
                    </p>
                    <p>
                      <strong>Started:</strong>{" "}
                      {new Date(test.start_time).toLocaleString()}
                    </p>
                  </div>

                  {test.status === "running" && (
                    <button
                      onClick={() => stopTest(test.id)}
                      className="stop-btn"
                    >
                      Stop Test
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
