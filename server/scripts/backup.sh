#!/bin/bash

# Database backup script
set -e

# Configuration
BACKUP_PATH="/backups/mongodb"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="smart_tank_backup_$TIMESTAMP"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_PATH

# Backup MongoDB
echo "Creating database backup..."
docker exec mongodb mongodump --out /data/backup/$BACKUP_NAME

# Compress backup
echo "Compressing backup..."
cd $BACKUP_PATH
tar -czf $BACKUP_NAME.tar.gz $BACKUP_NAME

# Clean up old backups (keep last 7 days)
find $BACKUP_PATH -name "*.tar.gz" -mtime +7 -delete

echo "Backup complete: $BACKUP_PATH/$BACKUP_NAME.tar.gz"