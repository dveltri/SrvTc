#!/bin/bash
set -e
export PGDATA="/var/lib/postgresql/data/pgdata"
export POSTGRES_PASSWORD="admin"
export PGBIN="/usr/lib/postgresql/12/bin"
cd /usr/lib/postgresql/12/bin
if [[ -d "/var/lib/postgresql/data/pgdata" ]]
then
echo "the data base exist" >> /tmp/logs.log
./postgres &
else
IPADD=$(ifconfig | grep -Eo 'inet 172(addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '172(addr:)?([0-9]*\.){3}[0-9]*')
./initdb
echo "host      all     all     $IPADD/8        trust"  >> /var/lib/postgresql/data/pgdata/pg_hba.conf
./postgres &
echo "wait to start DB"
sleep 10
/usr/lib/postgresql/12/bin/./createdb "SrvDb"
echo "wait to create Db"
sleep 5
# /usr/lib/postgresql/12/bin/./psql -U postgres -d SrvDb -1 -f /var/lib/postgresql/data/SrvDb_sql.backup
# /usr/lib/postgresql/12/bin/./pg_dumpall -U postgres -w -l "SrvDb" -v -f /tmp/dbase.dump -h localhost
echo "importing bakup of database"
/usr/lib/postgresql/12/bin/./psql --set SrvDb < /var/lib/postgresql/data/SrvDb.dump
fi
