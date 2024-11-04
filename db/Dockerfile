FROM postgres:13

ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=admin
ENV POSTGRES_DB=vokabeltrainer

COPY init-scripts /docker-entrypoint-initdb.d/
