#!/bin/bash
set -e
export PGDATA="/var/lib/postgresql/data/pgdata"
export POSTGRES_PASSWORD="admin"
cd /usr/lib/postgresql/12/bin
if [[ -d "/var/lib/postgresql/data/pgdata" ]]
then
echo "the data base exist"
./postgres &
else
IPADD=$(ifconfig | grep -Eo 'inet 172(addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '172(addr:)?([0-9]*\.){3}[0-9]*')
echo "init db"
./initdb
echo "host      all     all     $IPADD/8        trust"  >> /var/lib/postgresql/data/pgdata/pg_hba.conf
sleep 2
echo "start postgres db"
./postgres &
ps aux
sleep 10
echo "create db"
/usr/lib/postgresql/12/bin/./createdb "SrvDb"
sleep 10
# /usr/lib/postgresql/12/bin/./psql -U postgres -d SrvDb -1 -f /var/lib/postgresql/data/SrvDb_sql.backup
# /usr/lib/postgresql/12/bin/./pg_dumpall -U postgres -w -l "SrvDb" -v -f /tmp/dbase.dump -h localhost
echo "restore db"
/usr/lib/postgresql/12/bin/./psql --set SrvDb < /var/lib/postgresql/data/SrvDb.dump
fi
