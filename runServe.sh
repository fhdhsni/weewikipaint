#!/bin/bash
./node_modules/.bin/serve -p 8000 ./dist &> /dev/null &
serverPID=$!
echo $serverPID
