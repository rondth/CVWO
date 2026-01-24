package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	// "strconv"
	// "github.com/go-chi/chi/v5"
	// "github.com/rondth/CVWO/backend/models"
)

type Comments struct {
	ID       int64  `json:"id"`
	Body     string `json:"body"`
	Topic    string `json:"topic"`
	Username string `json:"username"`
}

func GetComments(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query(`SELECT c.id, c.body, c.topic, u.username
			FROM comments c
			JOIN users u ON c.user_id=u.id
			ORDER BY c.created_at DESC
			LIMIT 10`)
		if err != nil {
			log.Printf("Error querying comments: %v", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var comments []Comments
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
