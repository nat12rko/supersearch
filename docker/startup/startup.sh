#!/bin/bash
echo | ssh supervisor\@\${DOCKER_HOST} sudo docker stop ${branchname}.${docker.servicename}.web
echo | ssh supervisor\@\${DOCKER_HOST} sudo docker stop ${branchname}.${docker.servicename}.rest
echo | ssh supervisor\@\${DOCKER_HOST} sudo docker rm ${branchname}.${docker.servicename}.web
echo | ssh supervisor\@\${DOCKER_HOST} sudo docker rm ${branchname}.${docker.servicename}.rest
echo | ssh supervisor\@\${DOCKER_HOST} sudo docker run -d --name=${branchname}.${docker.servicename}.web ${docker.servicename}.web:${branchname}
echo | ssh supervisor\@\${DOCKER_HOST} sudo docker run -d --name=${branchname}.${docker.servicename}.rest ${docker.servicename}.rest:${branchname}