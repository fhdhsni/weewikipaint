#!/bin/bash
serve -p 8000 ./dist &> /dev/null &
serverPID=$!
sleep 3s
echo $serverPID
