sudo ufw allow 5050
docker run --name pgadmin -p 5050:80 -e "PGADMIN_DEFAULT_EMAIL=dgv@ingavanzada.com" -e "PGADMIN_DEFAULT_PASSWORD=ingavanzada" -d dpage/pgadmin4
sleep 10
python3 -mwebbrowser http://localhost:5050
