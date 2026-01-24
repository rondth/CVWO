package models

import "time"

type Comments struct {
	ID        int64     `json:"id"`
	Body      string    `json:"body"`
	Topic     string    `json:"topic"`
	UserID    int64     `json:"user_id"`
	PostID    int64     `json:"post_id"`
	CreatedAt time.Time `json:"created_at"`
}
