#!/bin/bash
RED='\033[0;31m'
file=./testOutput.txt
checkForBrowser() {
    grep -i "$1" $file --color=always > /dev/null
    if [ $? -ne 0 ]; then
        echo -e "\n${RED}$1 needs to be tested.\n"
        exit 1
    fi
}

checkForBrowser 'IE 10'
# checkForBrowser 'IE 11'
checkForBrowser 'Chrome'
checkForBrowser 'Firefox'
# checkForBrowser 'Edge'
