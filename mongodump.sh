#!/bin/bash

## This script executes mongodump on the running mongodb container for db backup
## In Docker Compose file, container name is defined
## Docker volumes are attached to mongodb container
## Backup on docker container is reflected on host volume

# Vars
container="bmg_db"
db_path="/data/db"

echo "MongoDB backup on vol db_backup"

docker exec -it $container mongodump -o $db_path

echo "+++ MongoDB back is successfull +++"