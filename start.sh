#!/bin/bash

# Check if the Docker network exists, if not create it
if ! docker network ls | grep -q "backend-network"; then
  docker network create backend-network
fi

# Remove existing containers if they exist
docker rm -f backend frontend postgres nginx 2>/dev/null

# Remove existing PostgreSQL data directory
docker volume rm pgdata 2>/dev/null

# Run the PostgreSQL Docker container
docker run \
  --name postgres \
  --network backend-network \
  -e POSTGRES_PASSWORD=nodepgpw \
  -e POSTGRES_USER=nodepg \
  -e POSTGRES_DB=postgres \
  --mount type=volume,source=pgdata,target=/var/lib/postgresql/data \
  --mount type=bind,source=$(pwd)/db/init-scripts,target=/docker-entrypoint-initdb.d \
  -d postgres

# Wait for PostgreSQL to be ready
sleep 10

# Build and run the backend Docker container
docker build -t backend-image ./backend
docker run -d \
  --rm \
  --name backend \
  --network backend-network \
  -e PORT=8000 \
  -e PGHOST=postgres \
  -e PGUSER=nodepg \
  -e PGDATABASE=postgres \
  -e PGPASSWORD=nodepgpw \
  -e PGPORT=5432 \
  -p 8000:8000 \
  backend-image

# Build and run the frontend Docker container
docker build -t frontend-image ./frontend
docker run --rm -d --name frontend -p 4200:4200 frontend-image

# Start nginx to act as a reverse proxy
docker run -d --rm --name nginx -p 8080:80 --network backend-network -v $(pwd)/nginx/nginx.conf:/etc/nginx/nginx.conf:ro nginx