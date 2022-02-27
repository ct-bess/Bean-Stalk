#!/bin/bash

MCDIR=$1
MCJAR=minecraft.jar
MCARG="-Xms2G -Xmx2G"

{ coproc JAVA (/usr/bin/java -server ${MCARG} -jar ${MCJAR} nogui) 1>&3; } 3>&1
echo ${JAVA_PID} > ${MCDIR}/server.pid
{ coproc TAIL (/usr/bin/tail -n +1 -f --pid=${JAVA_PID} ${MCDIR}/stdin 1>&${JAVA[1]}) } 2>/dev/null