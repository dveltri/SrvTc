#!/bin/bash
set -e
/opt/tomcat/latest/bin/./startup.sh
cd /opt/tomcat/latest/webapps/
git checkout anibal
git pull
#cd /usr/lib/postgresql/12/bin
cd /
chmod 666 /tmp/logs.log
su postgres dgvdb.sh
echo "docker-entrypoint.sh finish" >> /tmp/logs.log
tail -f /tmp/logs.log
