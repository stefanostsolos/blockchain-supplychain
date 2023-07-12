#!/bin/bash
#
# Exit on first error, print all commands
set -e

echo "======================================== Removing volumes =========================================================="
echo ""
# Shut down the Docker containers for the system tests
docker-compose -f artifacts/docker-compose.yaml down -v
rm -fr artifacts/network
docker stop $(docker ps -a -q)
docker rm $(docker ps -aq)
docker kill $(docker ps -aq)
echo ""
docker ps
echo ""
echo "===================================== Removed volumes successfully ================================================="