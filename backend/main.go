package main

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/rondth/CVWO/backend/handlers"
)

var db *sql.DB

func main() {
	db = InitDB()
	defer db.Close()

	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello from the backend!"))
	})
	//user
	r.Post("/api/login", handlers.LoginHandler(db))
	r.Post("/api/register", handlers.RegisterHandler(db))
	//post
	r.Get("/api/posts", handlers.GetPostsHandler(db))
	r.Post("/api/posts", handlers.CreatePostHandler(db))
	r.Put("/api/posts/{id}", handlers.UpdatePostHandler(db))
	r.Delete("/api/posts/{id}", handlers.DeletePostHandler(db))
	//feed
	r.Get("/api/feed", handlers.GetAllPostsHandler(db))
	//comments
	// r.Get("api/comments", handlers.GetComments(db))

	log.Println("Server starting on :8080")
	http.ListenAndServe(":8080", r)
}
