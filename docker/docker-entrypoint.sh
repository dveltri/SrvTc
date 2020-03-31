#!/bin/bash
set -e
export TOMCAT="/opt/tomcat/latest/webapps/"
cd /opt/tomcat/latest/webapps/
git checkout ingAv
git pull
cd ROOT/lp3
git checkout ingAv
git pull
/opt/tomcat/latest/bin/./startup.sh
#cd /usr/lib/postgresql/12/bin
cd /
su postgres dgvdb.sh
echo "docker-entrypoint.sh finish" >> /tmp/logs.log
tail -f /tmp/logs.log
