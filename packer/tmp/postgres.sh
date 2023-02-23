sudo yum -y update
sudo  amazon-linux-extras | grep postgre

sudo tee /etc/yum.repos.d/pgdg.repo<<EOF
[pgdg13]
name=PostgreSQL 13 for RHEL/CentOS 7 - x86_64
baseurl=http://download.postgresql.org/pub/repos/yum/13/redhat/rhel-7-x86_64
enabled=1
gpgcheck=0
EOF

sudo yum makecache
sudo yum install postgresql13 postgresql13-contrib postgresql13-server -y
sudo /usr/pgsql-13/bin/postgresql-13-setup initdb
sudo systemctl stop postgresql-13.service
sudo systemctl start postgresql-13.service
sudo systemctl enable postgresql-13.service
sudo systemctl status postgresql-13.service

sudo -u postgres psql <<EOF
\x
ALTER ROLE postgres WITH PASSWORD 'vennela1002';
CREATE DATABASE "vennpostgres";
\q
EOF

sudo systemctl stop postgresql-13.service
sudo systemctl start postgresql-13.service
sudo systemctl status postgresql-13.service