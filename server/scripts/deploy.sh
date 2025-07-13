#!/bin/bash

# Production deployment script
set -e

# Configuration
SERVER_HOST="your-server-ip"
SERVER_USER="your-server-user"
DEPLOY_PATH="/opt/smart-tank"
DOCKER_IMAGE="yourusername/smart-tank-server:latest"

# Update server
echo "Deploying to $SERVER_HOST..."
ssh $SERVER_USER@$SERVER_HOST << EOF
    cd $DEPLOY_PATH
    
    # Pull latest changes
    git pull origin main
    
    # Pull latest Docker image
    docker pull $DOCKER_IMAGE
    
    # Update environment variables
    cp .env.production .env
    
    # Restart services
    docker-compose down
    docker-compose up -d
    
    # Clean up old images
    docker image prune -f
    
    # Check service status
    docker-compose ps
EOF

echo "Deployment complete!"