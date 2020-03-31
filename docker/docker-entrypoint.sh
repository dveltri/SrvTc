#!/bin/bash
set -e
cd /opt/tomcat/latest/webapps/
git checkout anibal
git pull
cd ROOT/lp3
git checkout anibal
git pull
/opt/tomcat/latest/bin/./startup.sh
#cd /usr/lib/postgresql/12/bin
cd /
su postgres dgvdb.sh
echo "docker-entrypoint.sh finish" >> /tmp/logs.log
tail -f /tmp/logs.log
