
## Install docker debian
https://computingforgeeks.com/install-docker-and-docker-compose-on-debian-10-buster/

sudo apt -y install apt-transport-https ca-certificates curl gnupg2 software-properties-common

curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -

sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/debian \
   $(lsb_release -cs) \
   stable"

sudo apt update

sudo apt -y install docker-ce docker-ce-cli containerd.io

sudo usermod -aG docker $USER
newgrp docker

=====================================================================================================

# Pasos para instalar docker:

# 1- Bajar el repo

https://gitlab.hipcam.com/hipcam/backend/srs.git

# 2- Chequear si hay una instalación previa de docker
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

sudo docker build -t srv:latest .
docker pull dpage/pgadmin4
dpgadmi.sh

**3- Inicia la imagen en un container docker**

docker run --name srs -p 1935:1935 -p 1985:1985 -p 8080:8080 -p 8085:8085 mysrs:latest

=====================================================================================================

# Otros comandos útiles. 

- **Parar el container srs** 

    docker stop srs

- **Inicia nuevamente el container** 

    docker start srs

- **Abrir un bash del container que esta corriendo**

    docker exec -it srs bash

- **Parar y remover el container**

    docker rm --force srs

- **Eliminar todos los containes que no esten corriendo**

    docker container prune

- **Visualizar instancias de docker** 

    docker ps

- **Para crear nuestro propio certificado e usar ssl en nuestra computador** 

    sudo openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout myserver.key -out myserver.crt

    ssl
    {
        enabled     on;
        cert_file   /srs/conf/myserver.crt;
        key_file    /srs/conf/myserver.key;
    }
- **Para recargar la configuracion del archivo .conf**

    The usage of reload: killall -1 srs
    Or send signal to process: kill -1 7635
    Or use SRS scripts: /etc/init.d/srs reload

=====================================================================================================
    Para mas informacion:
    https://github.com/ossrs/srs/blob/3.0release/README.md

