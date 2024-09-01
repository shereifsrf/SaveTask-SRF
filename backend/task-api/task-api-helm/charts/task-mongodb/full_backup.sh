#!/bin/bash
# daily full backup is at 10:00 UTC every day.
FOLDER_NAME=$(date -u +%Y%m%d)
FOLDER_PATH=/backups/$FOLDER_NAME/full
mkdir -p $FOLDER_PATH

TEMP_LOC=/tmp/mongodump
mkdir -p $TEMP_LOC
TIMESTAMP=$(date -u +%Y%m%d_%H%M%S)
BACKUP_FILENAME=$TEMP_LOC/$TIMESTAMP.gz
echo "Creating backup $BACKUP_FILENAME"

mongodump --host $MONGODB_HOST \
    --port $MONGODB_PORT \
    --username $MONGODB_USERNAME \
    --password $MONGODB_PASSWORD \
    --archive=$BACKUP_FILENAME \
    --gzip

mv $BACKUP_FILENAME $FOLDER_PATH

rm -rf $TEMP_LOC

# rentention policy is 7 days.
# print the name of the file to be deleted
find $FOLDER_PATH -type f -name 'task-mongodb-backup-*' -mtime +7 -exec echo {} \;
# delete the file
find $FOLDER_PATH -type f -name 'task-mongodb-backup-*' -mtime +7 -exec rm {} \;