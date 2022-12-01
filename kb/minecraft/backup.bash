#!/bin/bash
ts=$(date +'%Y%m%d%H%M%S')
backup="/home/bessellc/mc-server/world-backups/${ts}-world"
service="/run/mcsrv/stdin"
directory="/home/bessellc/mc-service"

sudo echo '/say creating back-up ...' > $service
sudo echo '/save-all' > $service
sleep 5
sudo echo '/save-off' > $service
sleep 5
tar -cvz -f ${directory}/world-backups/${ts}-world ${directory}/world
gsutil mv ${directory}/world-backups/${ts}-world gs://bean-archive/mc-world-archive/${ts}-world.tar.gz
sudo echo '/save-on' > $service
sudo echo '/say done' > $service
