#!/bin/bash
ifconfig wlp3s0 | grep 'inet ' | awk '{ print $2 }'
