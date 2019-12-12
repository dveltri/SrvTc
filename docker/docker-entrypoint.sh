#!/bin/bash
set -e
rm -rf /opt/tomcat/latest/webapps/ROOT
mv --force /tmp/SrvTc/* /opt/tomcat/latest/webapps/
/opt/tomcat/latest/bin/./startup.sh
sudo su - postgres
#cp /opt/srs/env/dev/* /srs/conf/
#srs -c /srs/conf/dgv1.conf
tail -f /tmp/logs.log
