#!/bin/bash

FULL_BACKUP_PATH="/path/to/full"
INCREMENTAL_BACKUP_PATH="/path/to/hourly"

# Stop MongoDB service (if applicable)
echo "Stopping MongoDB service..."
# Uncomment the following line if you are managing MongoDB with a service manager
# sudo systemctl stop mongod

# Restore the full backup
echo "Restoring full backup..."
mongorestore  --host $HOSTNAME \
    --port $MONGO_PORT \
    --username $MONGO_INITDB_ROOT_USERNAME \
    --password $MONGO_INITDB_ROOT_PASSWORD \
    --archive=$FULL_BACKUP_PATH \
    --gzip


