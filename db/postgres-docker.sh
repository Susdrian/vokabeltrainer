docker run \
--name postgres \
--network backend-network \
-e POSTGRES_PASSWORD=pizza \
-e POSTGRES_USER=funghi \
-e POSTGRES_DB=wrong \
--mount type=volume,source=pgdata,target=/var/lib/postgresql/data \
--mount type=bind,source=$(pwd)/init-scripts,target=/docker-entrypoint-initdb.d \
-d postgres
