# Use the official PostgreSQL image from the Docker Hub
FROM postgres:13

# Set environment variables for PostgreSQL
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=admin
ENV POSTGRES_DB=vokabeltrainer

# Copy the initialization scripts into the Docker image
COPY init-scripts /docker-entrypoint-initdb.d/