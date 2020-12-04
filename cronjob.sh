#!/bin/bash

## Scheduled backup to the database scheme with data weekly on every Thursday at 3:00 AM
## Define a cronjob that runs mongodump.sh for scheduled backup
crontab -l > mycron
#echo new cron into cron file
echo "0 3 * * THU ./mongodump.sh >>/var/log/mongo_backup/mongo_backup.log 2>&1" >> mycron
#install new cron file
crontab mycron
rm mycron