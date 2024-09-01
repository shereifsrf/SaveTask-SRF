#!/bin/bash
i = 0
until \
    mongosh --host $MONGODB_HOST \
        --port $MONGODB_PORT \
        --username $MONGODB_USERNAME \
        --password $MONGODB
        --eval "db.adminCommand({setParameter: 1, internalQueryExecYieldIterations: 10000})"
do
    i=$((i+1))
    echo "Waiting for mongosh to be up $i" >> /data/
    sleep 1
done

# between 11:00 and 09:00+1
# hourly incremental backup
# TIME=$(date -u)

# CURR_HOUR=$(TIME | awk '{print $4}' | awk -F: '{print $1}')
CURR_HOUR=$(date -u +%H)

if [ $CURR_HOUR -lt 11 && $CURR_HOUR -ge 9 ]; then
    echo "Not in the backup window"
    exit 0
fi

# if the time is between 00:00 and 09:00, then the date should be yesterday
if [ $CURR_HOUR -lt 11 ]; then
    FOLDER_NAME=$(date -u -d "yesterday" +%Y%m%d)
else
    FOLDER_NAME=$(date -u +%Y%m%d)
fi

FOLDER_PATH=/backups/$FOLDER_NAME/hourly
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
    --gzip \
    --oplog

mv $BACKUP_FILENAME $FOLDER_PATH

rm -rf $TEMP_LOC