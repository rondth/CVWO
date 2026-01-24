package main

import (
	"database/sql"
	"log"
	"os"
	"path/filepath"

	_ "github.com/lib/pq"
)

func InitDB() *sql.DB {
	connStr := "host=localhost port=5432 user=postgres password=cvwo dbname=cvwo sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	if err = db.Ping(); err != nil {
		log.Fatal(err)
	}

	if err := initSchema(db); err != nil {
		log.Fatal("Failed to initialize database schema:", err)
	}

	return db
}

func initSchema(db *sql.DB) error {
	possiblePaths := []string{
		"schema.sql",
		filepath.Join("backend", "schema.sql"),
		filepath.Join("..", "backend", "schema.sql"),
	}

	var schemaSQL []byte
	var err error
	var found bool

	for _, path := range possiblePaths {
		schemaSQL, err = os.ReadFile(path)
		if err == nil {
			found = true
			break
		}
	}

	if !found {
		log.Printf("Warning: Could not read schema.sql file from any expected location. Make sure tables are created manually.")
		return nil
	}

	_, err = db.Exec(string(schemaSQL))
	if err != nil {
		return err
	}

	log.Println("Database schema initialized successfully")
	return nil
}
