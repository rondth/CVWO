package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
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

		var user models.User
		err := db.QueryRow("SELECT id, username, created_at FROM users WHERE username = $1", req.Username).Scan(&user.ID, &user.Username, &user.CreatedAt)
		if err == sql.ErrNoRows {
			// User doesn't exist, create them
			err = db.QueryRow("INSERT INTO users (username, created_at) VALUES ($1, $2) RETURNING id", req.Username, time.Now()).Scan(&user.ID)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			user.Username = req.Username
			user.CreatedAt = time.Now()
		} else if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(user)
	}
}

func RegisterHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req UserRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Check if user already exists
		var existingID int64
		err := db.QueryRow("SELECT id FROM users WHERE username = $1", req.Username).Scan(&existingID)
		if err == nil {
			http.Error(w, "User already exists", http.StatusConflict)
			return
		} else if err != sql.ErrNoRows {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		var user models.User
		err = db.QueryRow("INSERT INTO users (username, created_at) VALUES ($1, $2) RETURNING id, username, created_at",
			req.Username, time.Now()).Scan(&user.ID, &user.Username, &user.CreatedAt)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(user)
	}
}