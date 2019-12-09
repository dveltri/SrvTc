#!/bin/bash
export CLASSPATH=$CLASSPATH:/usr/share/java/postgresql-42.2.5.jar

while [ 1==1 ]
do
echo "Start"
java HttpDrvFcp tout
sleep 2
done
