FROM tomcat:8-jre8
ADD *.sh /usr/local/script/
ADD config/*.properties /etc/resurs/supersearch/

ENV VIRTUAL_HOST ${docker.component}.${docker.servicename}.${branchname}
ENV GIT_BRANCH ${git.branch}
ENV GIT_CALCULATED_BRANCH ${git.commit.id.abbrev}
ENV GIT_SHA ${git.commit.id}
ENV GIT_REMOTE_URL ${git.remote.origin.url}
ENV SYSTEM ${docker.servicename}
ENV COMPONENT ${docker.component}
ADD *.war /usr/local/tomcat/webapps/
CMD bash /usr/local/script/replaceContent.sh && /usr/local/tomcat/bin/catalina.sh run


