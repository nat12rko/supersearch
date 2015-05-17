FROM tomcat:8.0
ADD *.war /usr/local/tomcat/webapps/
ADD config/*.properties /etc/resurs/supersearch/
ENV VIRTUAL_HOST ${docker.component}.${docker.servicename}.${branchname}
ENV BRANCH ${mvngit.branch}
ENV SYSTEM ${docker.servicename}
ENV COMPONENT ${docker.component}