FROM tomcat:8-jre8
ADD *.sh /usr/local/script/
ADD config/*.properties /etc/resurs/supersearch/
ADD *.war /usr/local/tomcat/webapps/
CMD bash /usr/local/script/replaceContent.sh && /usr/local/tomcat/bin/catalina.sh run


