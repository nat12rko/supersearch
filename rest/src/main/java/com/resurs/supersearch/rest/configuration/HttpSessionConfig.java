package com.resurs.supersearch.rest.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.session.data.mongo.JdkMongoSessionConverter;
import org.springframework.session.data.mongo.config.annotation.web.http.EnableMongoHttpSession;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;

@EnableMongoHttpSession(maxInactiveIntervalInSeconds = HttpSessionConfig.TEN_HOURS_IN_SECONDS)
public class HttpSessionConfig {

    protected static final int TEN_HOURS_IN_SECONDS = 36000;

    @Bean
    public JdkMongoSessionConverter jdkMongoSessionConverter() {
        return new JdkMongoSessionConverter();
    }

    @Bean
    public CookieSerializer cookieSerializer() {
        DefaultCookieSerializer serializer = new DefaultCookieSerializer();
        serializer.setCookieName("JSESSIONID");
        serializer.setCookiePath("/");
        serializer.setDomainNamePattern("^.+?\\.(\\w+\\.[a-z]+)$");
        return serializer;
    }
}