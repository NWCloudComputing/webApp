#!/bin/bash

sleep 30



sudo yum update -y



sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -
sudo yum install -y nodejs



sudo chmod 755 /home/ec2-user/script
sudo chown -R ec2-user:ec2-user /home/ec2-user
cd /home/ec2-user/script
sudo unzip /home/ec2-user/script/webapp.zip

sudo chown ec2-user:ec2-user script
sudo su
cd /home/ec2-user/script
sudo npm install
sudo npm install bcrypt
sudo npm update -g node-gyp

