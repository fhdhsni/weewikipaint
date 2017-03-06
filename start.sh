#!/bin/bash
node ./src/server/weewikipaint.js 8000 &> /dev/null &
serverPID=$!
echo $serverPID
