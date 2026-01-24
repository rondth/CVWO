package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	// "github.com/rondth/CVWO/backend/models"
)

type Comments struct {
	ID       int64  `json:"id"`
	Body     string `json:"body"`
	Topic    string `json:"topic"`
	Username string `json:"username"`
}

type CreateCommentRequest struct {
	Body     string `json:"body"`
	Topic    string `json:"topic"`
	Username string `json:"username"`
}

func GetComments(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		postIDStr := chi.URLParam(r, "id")
		postID, err := strconv.ParseInt(postIDStr, 10, 64)
		if err != nil {
			http.Error(w, "Invalid post ID", http.StatusBadRequest)
			return
		}
		rows, err := db.Query(`SELECT c.id, c.body, c.topic, u.username
			FROM comments c
			JOIN users u ON c.user_id=u.id
			WHERE c.post_id = $1
			ORDER BY c.created_at DESC
			LIMIT 10`, postID)
		if err != nil {
			log.Printf("Error querying comments: %v", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		comments := []Comments{}
		for rows.Next() {
			var comm Comments
			err := rows.Scan(&comm.ID, &comm.Body, &comm.Topic, &comm.Username)
			if err != nil {
				log.Printf("Scan error: %v", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			comments = append(comments, comm)
		}
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(comments); err != nil {
			log.Printf("Failed to encode response: %v", err)
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
			return
		}
	}
}

func CreateCommentHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		postIDStr := chi.URLParam(r, "id")
		postID, err := strconv.ParseInt(postIDStr, 10, 64)
		if err != nil {
			http.Error(w, "Invalid post ID", http.StatusBadRequest)
			return
		}

		var req CreateCommentRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		if req.Body == "" || req.Username == "" {
			http.Error(w, "Username and body are required", http.StatusBadRequest)
			return
		}

		// Look up the user by username
		var userID int64
		err = db.QueryRow("SELECT id FROM users WHERE username = $1", req.Username).Scan(&userID)
		if err == sql.ErrNoRows {
			http.Error(w, "User not found", http.StatusBadRequest)
			return
		} else if err != nil {
			log.Printf("Error looking up user: %v", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		topic := req.Topic
		if topic == "" {
			topic = "general"
		}

		_, err = db.Exec(
			"INSERT INTO comments (body, topic, user_id, post_id) VALUES ($1, $2, $3, $4)",
			req.Body, topic, userID, postID,
		)
		if err != nil {
			log.Printf("Error inserting comment: %v", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
	}
}
