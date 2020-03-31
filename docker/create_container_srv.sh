# -v /tmp/mount:/var/lib/postgresql/data
sudo ufw allow 8080
sudo ufw allow 5432
sudo ufw allow 2024
sudo ufw allow 2025
sudo ufw allow 2026
docker run --name srv -e POSTGRES_PASSWORD=admin -e PGDATA=/var/lib/postgresql/data/pgdata -e SEND_HOST="localhost" -p 2024:2024 -p 2025:2025 -p 2026:2026 -p 5432:5432 -p 8080:8080 srv:latest
