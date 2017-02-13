#!/bin/sh
pgrep -fa ".*tswatch$" &> /dev/null
if [ $? = 0 ]; then
    echo -e 'TypeScript compiler is watching.\n'
else yarn run tswatch &
     sleep 2s
fi


