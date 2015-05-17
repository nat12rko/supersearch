sudo docker stop ${branchname}.${docker.servicename}.web
sudo docker stop ${branchname}.${docker.servicename}.rest
sudo docker rm ${branchname}.${docker.servicename}.web
sudo docker rm ${branchname}.${docker.servicename}.rest
sudo docker run -d --name=${branchname}.${docker.servicename}.web ${branchname}.${docker.servicename}.web
sudo docker run -d --name=${branchname}.${docker.servicename}.rest ${branchname}.${docker.servicename}.rest