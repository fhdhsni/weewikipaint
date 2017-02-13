#!/bin/sh
pgrep -fa ".*tswatch$" &> /dev/null
if [ $? = 0 ]; then
    echo 'tsc is already running.'
else yarn run tswatch &
     sleep 2s
fi


