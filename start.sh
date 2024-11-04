#!/bin/bash

# Create a Docker network for the backend and database
docker network create backend-network

# Build and run the backend Docker container
docker build -t backend-image ./backend
docker run -d --name backend --network backend-network backend-image

# Build and run the frontend Docker container
docker build -t frontend-image ./frontend
docker run -d --name frontend -p 80:80 frontend-image

# Run the PostgreSQL Docker container
docker run \
--name postgres \
--network backend-network \
-e POSTGRES_PASSWORD=pizza \
-e POSTGRES_USER=funghi \
-e POSTGRES_DB=wrong \
--mount type=volume,source=pgdata,target=/var/lib/postgresql/data \
--mount type=bind,source=$(pwd)/db/init-scripts,target=/docker-entrypoint-initdb.d \
-d postgres

# Start nginx to act as a reverse proxy
docker run -d --name nginx -p 80:80 --network backend-network -v $(pwd)/nginx/nginx.conf:/etc/nginx/nginx.conf:ro nginx
