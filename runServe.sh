#!/bin/bash
serve -p 8000 ./dist &> /dev/null &
echo $!
