package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

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

		rows, err := db.Query("SELECT id, title, body, topic, user_id, created_at, updated_at FROM posts WHERE user_id = $1 ORDER BY created_at DESC", userID)
		if err != nil {
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

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(posts)
	}
}

func CreatePostHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req CreatePostRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		var post models.Post
		now := time.Now()
		err := db.QueryRow("INSERT INTO posts (title, body, topic, user_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, title, body, topic, user_id, created_at, updated_at",
			req.Title, req.Body, req.Topic, req.UserID, now, now).Scan(&post.ID, &post.Title, &post.Body, &post.Topic, &post.UserID, &post.CreatedAt, &post.UpdatedAt)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(post)
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

		var post models.Post
		now := time.Now()
		err = db.QueryRow("UPDATE posts SET title = $1, body = $2, topic = $3, updated_at = $4 WHERE id = $5 RETURNING id, title, body, topic, user_id, created_at, updated_at",
			req.Title, req.Body, req.Topic, now, id).Scan(&post.ID, &post.Title, &post.Body, &post.Topic, &post.UserID, &post.CreatedAt, &post.UpdatedAt)
		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "Post not found", http.StatusNotFound)
				return
			}
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(post)
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

		result, err := db.Exec("DELETE FROM posts WHERE id = $1", id)
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
			http.Error(w, "Post not found", http.StatusNotFound)
			return
		}

		w.WriteHeader(http.StatusNoContent)
	}
}