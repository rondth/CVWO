package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/rondth/CVWO/backend/models"
)

type UserRequest struct {
	Username string `json:"username"`
}

func LoginHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req UserRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		if req.Username == "" {
			http.Error(w, "Username is required", http.StatusBadRequest)
			return
		}

		var user models.User
		err := db.QueryRow("SELECT id, username, created_at FROM users WHERE username = $1", req.Username).Scan(&user.ID, &user.Username, &user.CreatedAt)
		//if no user found
		if err == sql.ErrNoRows {
			log.Printf("Login failed - User not found: %v", req.Username)
			http.Error(w, "User not found", http.StatusUnauthorized)
			return
		} else if err != nil {
			log.Printf("Login failed - Error querying user: %v", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		//success
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(user); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
			return
		}
	}
}

func RegisterHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req UserRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		if req.Username == "" {
			http.Error(w, "Username is required", http.StatusBadRequest)
			return
		}

		var existingID int64
		err := db.QueryRow("SELECT id FROM users WHERE username = $1", req.Username).Scan(&existingID)
		if err == nil {
			log.Printf("User already exists: %v", req.Username)
			http.Error(w, "User already exists", http.StatusConflict)
			return
		} else if err != sql.ErrNoRows {
			log.Printf("Error checking existing user: %v", err) //logging the error
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		var user models.User
		err = db.QueryRow("INSERT INTO users (username) VALUES ($1) RETURNING id, username, created_at",
			req.Username).Scan(&user.ID, &user.Username, &user.CreatedAt)
		if err != nil {
			log.Printf("Error creating user: %v", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(user); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
			return
		}
	}
}
