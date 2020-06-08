# -v /tmp/mount:/var/lib/postgresql/data
#sudo ufw allow 5432
sudo ufw allow 2024
sudo ufw allow 2025
sudo ufw allow 2026
sudo ufw allow 80
#sudo ufw allow 8080
docker run --name srv -e POSTGRES_PASSWORD=admin -e PGDATA=/var/lib/postgresql/data/pgdata -e SEND_HOST="localhost" -p 2024:2024/udp -p 2025:2025/udp -p 2026:2026/udp -p 5432:5432 -p 80:8080 srv:latest
