#!/bin/bash
set -e
mv --force /tmp/SrvTc/* /opt/tomcat/latest/webapps/
/opt/tomcat/latest/bin/./startup.sh
#cp /opt/srs/env/dev/* /srs/conf/
#srs -c /srs/conf/dgv1.conf
tail -f /tmp/logs.log
