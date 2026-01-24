package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/rondth/CVWO/backend/models"
)

type CreatePostRequest struct {
	Title  string `json:"title"`
	Body   string `json:"body"`
	Topic  string `json:"topic"`
	UserID int64  `json:"user_id"`
}

type UpdatePostRequest struct {
	Title string `json:"title"`
	Body  string `json:"body"`
	Topic string `json:"topic"`
}

type FeedPost struct {
	ID       int64  `json:"id"`
	Title    string `json:"title"`
	Body     string `json:"body"`
	Topic    string `json:"topic"`
	Username string `json:"username"`
}

func GetAllPostsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query(`SELECT p.id, p.title, p.body, p.topic, u.username 
			FROM posts p 
			JOIN users u ON p.user_id = u.id 
			ORDER BY p.created_at DESC 
			LIMIT 10`)
		if err != nil {
			log.Printf("Error querying posts: %v", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var posts []FeedPost
		for rows.Next() {
			var post FeedPost
			err := rows.Scan(&post.ID, &post.Title, &post.Body, &post.Topic, &post.Username)
			if err != nil {
				log.Printf("Scan error: %v", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			posts = append(posts, post)
		}

		if err = rows.Err(); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(posts); err != nil {
			log.Printf("Failed to encode response: %v", err)
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
			return
		}
	}
}

func GetPostsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userIDStr := r.URL.Query().Get("user_id")
		if userIDStr == "" {
			http.Error(w, "user_id query parameter required", http.StatusBadRequest)
			return
		}

		userID, err := strconv.ParseInt(userIDStr, 10, 64)
		if err != nil {
			http.Error(w, "Invalid user_id", http.StatusBadRequest)
			return
		}

		var userExists bool
		err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE id = $1)", userID).Scan(&userExists)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if !userExists {
			http.Error(w, "User not found", http.StatusBadRequest)
			return
		}

		rows, err := db.Query("SELECT id, title, body, topic, user_id, created_at, updated_at FROM posts WHERE user_id = $1 ORDER BY created_at DESC", userID)
		if err != nil {
			log.Printf("Error querying posts: %v", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var posts []models.Post
		for rows.Next() {
			var post models.Post
			err := rows.Scan(&post.ID, &post.Title, &post.Body, &post.Topic, &post.UserID, &post.CreatedAt, &post.UpdatedAt)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			posts = append(posts, post)
		}

		if err = rows.Err(); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(posts); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
			return
		}
	}
}

func CreatePostHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req CreatePostRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		if req.Title == "" {
			http.Error(w, "Title is required", http.StatusBadRequest)
			return
		}
		if req.Body == "" {
			http.Error(w, "Body is required", http.StatusBadRequest)
			return
		}
		if req.Topic == "" {
			http.Error(w, "Topic is required", http.StatusBadRequest)
			return
		}
		if req.UserID <= 0 {
			http.Error(w, "Valid user_id is required", http.StatusBadRequest)
			return
		}

		var userExists bool
		err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE id = $1)", req.UserID).Scan(&userExists)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if !userExists {
			http.Error(w, "User not found", http.StatusBadRequest)
			return
		}

		var post models.Post
		err = db.QueryRow("INSERT INTO posts (title, body, topic, user_id) VALUES ($1, $2, $3, $4) RETURNING id, title, body, topic, user_id, created_at, updated_at",
			req.Title, req.Body, req.Topic, req.UserID).Scan(&post.ID, &post.Title, &post.Body, &post.Topic, &post.UserID, &post.CreatedAt, &post.UpdatedAt)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(post); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
			return
		}
	}
}

func UpdatePostHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := chi.URLParam(r, "id")
		id, err := strconv.ParseInt(idStr, 10, 64)
		if err != nil {
			http.Error(w, "Invalid post ID", http.StatusBadRequest)
			return
		}

		var req UpdatePostRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		if req.Title == "" {
			http.Error(w, "Title is required", http.StatusBadRequest)
			return
		}
		if req.Body == "" {
			http.Error(w, "Body is required", http.StatusBadRequest)
			return
		}
		if req.Topic == "" {
			http.Error(w, "Topic is required", http.StatusBadRequest)
			return
		}

		userIDStr := r.URL.Query().Get("user_id")
		if userIDStr == "" {
			http.Error(w, "user_id query parameter required for ownership validation", http.StatusBadRequest)
			return
		}
		userID, err := strconv.ParseInt(userIDStr, 10, 64)
		if err != nil {
			http.Error(w, "Invalid user_id", http.StatusBadRequest)
			return
		}

		var post models.Post
		err = db.QueryRow("UPDATE posts SET title = $1, body = $2, topic = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 AND user_id = $5 RETURNING id, title, body, topic, user_id, created_at, updated_at",
			req.Title, req.Body, req.Topic, id, userID).Scan(&post.ID, &post.Title, &post.Body, &post.Topic, &post.UserID, &post.CreatedAt, &post.UpdatedAt)
		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "Post not found or you don't have permission to update it", http.StatusNotFound)
				return
			}
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(post); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
			return
		}
	}
}

func DeletePostHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := chi.URLParam(r, "id")
		id, err := strconv.ParseInt(idStr, 10, 64)
		if err != nil {
			http.Error(w, "Invalid post ID", http.StatusBadRequest)
			return
		}

		userIDStr := r.URL.Query().Get("user_id")
		if userIDStr == "" {
			http.Error(w, "missing user_id query parameter required for ownership validation", http.StatusBadRequest)
			return
		}
		userID, err := strconv.ParseInt(userIDStr, 10, 64)
		if err != nil {
			http.Error(w, "Invalid user_id", http.StatusBadRequest)
			return
		}

		result, err := db.Exec("DELETE FROM posts WHERE id = $1 AND user_id = $2", id, userID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		rowsAffected, err := result.RowsAffected()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if rowsAffected == 0 {
			http.Error(w, "Post not found or you don't have permission to delete it", http.StatusNotFound)
			return
		}

		w.WriteHeader(http.StatusNoContent)
	}
}
