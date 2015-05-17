FROM tomcat:8.0
ADD *.war /usr/local/tomcat/webapps/
ENV VIRTUAL_HOST ${docker.component}.${docker.servicename}.${branchname}
ENV GIT_BRANCH ${git.branch}
ENV GIT_SHA ${git.commit.id}
ENV GIT_REMOTE_URL ${git.remote.origin.url}
ENV SYSTEM ${docker.servicename}
ENV COMPONENT ${docker.component}