#!/bin/bash
IP=$(ifconfig wlp3s0 | grep 'inet ' | awk '{ print $2 }')
echo $IP
