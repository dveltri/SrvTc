fork de https://github.com/ossrs/srs versión 2.0.263

Se agregaron las siguientes cosas:

- DVR en formatos .ts y .mp4
- DVR plan "advanced" (corta los segmentos por tiempo y por inicio/fin de sesión)
- VOD server
- API recording status
- DVR cleaner, automático y manual
- Soporte para AWS S3
- callback on_http_resource
- soporte rtmps y https
- otros detalles (ver lista de commits)

Más info:
https://drive.google.com/file/d/1RRuVZ10x6HTUFUoXLzfp5GCjxSEFHw8w/view?usp=sharing

----------

Para levantar localmente dockerizado:

Para crear la imagen de docker 
docker build -t mysrs:latest .

Inicia la imagen en un container docker
docker run --name srs -p 1935:1935 -p 1985:1985 -p 8080:8080 -p 8085:8085 mysrs:latest

Otros comandos utiles 

    Parar el container srs 
    docker stop srs

    Inicia nuevamente el container 
    docker start srs

    Habre un bash del container que esta corriendo
    docker exec -it srs bash

    Para y remueve el container
    docker rm --force srs

    Elimina todos los containes que no esten corriendo
    docker container prune