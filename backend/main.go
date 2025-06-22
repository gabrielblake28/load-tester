package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type LoadTestConfig struct {
	URL             string            `json:"url"`
	Method          string            `json:"method"`
	Headers         map[string]string `json:"headers"`
	Body            string            `json:"body"`
	Concurrency     int               `json:"concurrency"`
	Duration        int               `json:"duration"` // in seconds
	RequestsPerSec  int               `json:"requests_per_sec"`
}

type LoadTestResult struct {
	ID              string    `json:"id"`
	Config          LoadTestConfig `json:"config"`
	Status          string    `json:"status"`
	StartTime       time.Time `json:"start_time"`
	EndTime         *time.Time `json:"end_time,omitempty"`
	TotalRequests   int       `json:"total_requests"`
	SuccessRequests int       `json:"success_requests"`
	FailedRequests  int       `json:"failed_requests"`
	AvgResponseTime float64   `json:"avg_response_time"`
	MinResponseTime float64   `json:"min_response_time"`
	MaxResponseTime float64   `json:"max_response_time"`
}

var loadTests = make(map[string]*LoadTestResult)

func main() {
	r := mux.NewRouter()

	// API routes
	api := r.PathPrefix("/api").Subrouter()
	api.HandleFunc("/health", healthHandler).Methods("GET")
	api.HandleFunc("/load-tests", createLoadTestHandler).Methods("POST")
	api.HandleFunc("/load-tests", getLoadTestsHandler).Methods("GET")
	api.HandleFunc("/load-tests/{id}", getLoadTestHandler).Methods("GET")
	api.HandleFunc("/load-tests/{id}/stop", stopLoadTestHandler).Methods("POST")

	// Setup CORS
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:5173", "http://localhost:3000"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"*"},
	})

	handler := c.Handler(r)

	fmt.Println("🚀 Load Tester API server starting on :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status": "healthy",
		"service": "load-tester-api",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

func createLoadTestHandler(w http.ResponseWriter, r *http.Request) {
	var config LoadTestConfig
	if err := json.NewDecoder(r.Body).Decode(&config); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	// Basic validation
	if config.URL == "" {
		http.Error(w, "URL is required", http.StatusBadRequest)
		return
	}
	if config.Method == "" {
		config.Method = "GET"
	}
	if config.Concurrency <= 0 {
		config.Concurrency = 1
	}
	if config.Duration <= 0 {
		config.Duration = 10
	}

	// Create test result
	testID := fmt.Sprintf("test_%d", time.Now().Unix())
	result := &LoadTestResult{
		ID:        testID,
		Config:    config,
		Status:    "created",
		StartTime: time.Now(),
	}

	loadTests[testID] = result

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(result)

	// TODO: Start the actual load test in a goroutine
	fmt.Printf("📝 Created load test: %s for URL: %s\n", testID, config.URL)
}

func getLoadTestsHandler(w http.ResponseWriter, r *http.Request) {
	tests := make([]*LoadTestResult, 0, len(loadTests))
	for _, test := range loadTests {
		tests = append(tests, test)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tests)
}

func getLoadTestHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	testID := vars["id"]

	test, exists := loadTests[testID]
	if !exists {
		http.Error(w, "Load test not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(test)
}

func stopLoadTestHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	testID := vars["id"]

	test, exists := loadTests[testID]
	if !exists {
		http.Error(w, "Load test not found", http.StatusNotFound)
		return
	}

	if test.Status == "running" {
		test.Status = "stopped"
		now := time.Now()
		test.EndTime = &now
		fmt.Printf("⏹️  Stopped load test: %s\n", testID)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(test)
} 