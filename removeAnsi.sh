#!/bin/bash
# sed "s,\x1B\[[0-9;]*[a-zA-Z],,g" ./testOutput.txt 
sed "s,\x1B\[[0-9;][AG],,g" ./testOutput.txt 
