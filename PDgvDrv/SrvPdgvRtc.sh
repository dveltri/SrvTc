#!/bin/bash
export CLASSPATH=$CLASSPATH:/usr/share/java/postgresql-42.2.5.jar

while [ 1==1 ]
do
fecha=$(date +%Y%m%d%H%M%S)
echo "Start Pdgv DrvRtc ${fecha}" >> /tmp/drvlogs.txt
java SrvPdgvX DrvRtc 254 2026 2 1 1
sleep 1
done
