#!/bin/bash

# Reset database script - Drops and recreates the database with clean schema

echo "⚠️  WARNING: This will DELETE all data in the cvwo database!"
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Cancelled."
    exit 0
fi

echo "Dropping database..."
psql -U postgres -c "DROP DATABASE IF EXISTS cvwo;"

echo "Creating fresh database..."
psql -U postgres -c "CREATE DATABASE cvwo;"

echo "Running schema..."
psql -U postgres -d cvwo -f backend/schema.sql

echo "✅ Database reset complete!"
echo "You can now restart your backend server."



