#!/bin/bash
export CLASSPATH=$CLASSPATH:$PWD/postgresql-42.2.5.jar

while [ 1==1 ]
do
fecha=$(date +%Y%m%d%H%M%S)
echo "Start Pdgv drv1 ${fecha}" >> /tmp/drvlogs.txt
java -XX:TieredStopAtLevel=1 SrvPdgvX drv1 254 2024 5 1 1 0
sleep 1
done
