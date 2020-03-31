# Información del proyecto srv dgv

=================================================================================================

# Pasos para instalar docker en linux:

**a) Chequear si esta instalado docker.**
  
docker -v

**b) Si esta instalado, desinstalar previamente haciendo:**
  
sudo apt-get remove docker docker-engine docker.io containerd runc

# 3- Actualizar los repositorios de Ubuntu
  
sudo apt-get update

# 4- Instalar los repositorios de docker para Ubuntu por https
  
sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common      

# 5- Descargar la PGP key para https
  
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# 6- Agregar el repositorio a Ubuntu
  
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# 7- Hacer un nuevo update del repositorio de Ubuntu

sudo apt-get update

# 8- Descargar docker e instalarlo

sudo apt-get install docker-ce docker-ce-cli containerd.io

# Levantar localmente una instancia de SRS dockerizado:

**1- Ir a la carpeta donde esta el archivo Dockerfile dentro del repositorio srs descargado.**

**2- Crear la imagen de docker** 

dbuild.sh   o   sudo docker build -t srv:latest .

docker pull dpage/pgadmin4

dpgadmi.sh

**3- Inicia la imagen en un container docker**
   create_container_srv.sh

   o

   docker run --name srs -p 1935:1935 -p 1985:1985 -p 8080:8080 -p 8085:8085 mysrs:latest

**4- Habilitar puertos para el acceso web, driver, postgres, pgadmin
	sudo ufw allow 8080
	sudo ufw allow 2024
	sudo ufw allow 2025
	sudo ufw allow 2026
	sudo ufw allow 5432
	sudo ufw allow 5050
=====================================================================================================

# Otros comandos útiles. 

- **Parar el container srs** 
    docker stop srv

- **Para correr el container** 
    docker start srv

- **Para obeter el log del container**
    docker logs srv --tail

- **Para ver que container estan corriendo**
    docker ps

- **Para ver que containers estan creados**
    docker ps -a

- **Parar y remover el container que no estan corriendo**
    docker rm srv

- **Eliminar todos los containes que no esten corriendo**
    docker container prune

=====================================================================================================
