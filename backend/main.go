package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	_ "github.com/lib/pq"
	"github.com/rondth/CVWO/backend/handlers"
)

var db *sql.DB

func main() {
	var err error
	// Database connection string - update with your PostgreSQL credentials
	connStr := "host=localhost port=5432 user=postgres password=cvwo dbname=cvwo sslmode=disable"

	// Database connection string built from environment variables
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")

	if dbUser == "" || dbPass == "" || dbName == "" {
		log.Fatal("Database credentials (DB_USER, DB_PASSWORD, DB_NAME) must be set in environment variables")
	}

	connStr := fmt.Sprintf("host=localhost port=5432 user=%s password=%s dbname=%s sslmode=disable", dbUser, dbPass, dbName)
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Test the connection
	if err = db.Ping(); err != nil {
		log.Fatal(err)
	}

	r := chi.NewRouter()

	// Middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"}, // React dev server
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	// Routes
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello from the backend!"))
	})

	// User routes
	r.Post("/api/login", handlers.LoginHandler(db))
	r.Post("/api/register", handlers.RegisterHandler(db))

	// Post routes
	r.Get("/api/posts", handlers.GetPostsHandler(db))
	r.Post("/api/posts", handlers.CreatePostHandler(db))
	r.Put("/api/posts/{id}", handlers.UpdatePostHandler(db))
	r.Delete("/api/posts/{id}", handlers.DeletePostHandler(db))

	log.Println("Server starting on :8080")
	http.ListenAndServe(":8080", r)
}
