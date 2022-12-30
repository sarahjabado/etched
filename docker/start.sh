#!/bin/bash
PWD=$(pwd)
source ~/.nvm/nvm.sh
echo "Starting the application."

cd /app
npm start
