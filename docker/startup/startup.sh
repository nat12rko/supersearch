#!/bin/bash

echo | ssh supervisor\@\${DOCKER_HOST} sudo docker stop ${branchname}.${docker.servicename}.web
echo | ssh supervisor\@\${DOCKER_HOST} sudo docker stop ${branchname}.${docker.servicename}.rest
echo | ssh supervisor\@\${DOCKER_HOST} sudo docker rm ${branchname}.${docker.servicename}.web
echo | ssh supervisor\@\${DOCKER_HOST} sudo docker rm ${branchname}.${docker.servicename}.rest
echo | ssh supervisor\@\${DOCKER_HOST} sudo docker run -d --name=${branchname}.${docker.servicename}.web ${branchname}.${docker.servicename}.web
echo | ssh supervisor\@\${DOCKER_HOST} sudo docker run -d --name=${branchname}.${docker.servicename}.rest ${branchname}.${docker.servicename}.rest