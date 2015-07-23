package com.resurs.supersearch.configuration;

import com.resurs.supersearch.servlet.RestUrlServlet;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.embedded.ServletRegistrationBean;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;

/**
 * Created by Joachim on 2015-02-05.
 */
@SpringBootApplication
@EnableAutoConfiguration
@ComponentScan("com.resurs.supersearch.rest")
@PropertySources({
        @PropertySource(value = "file:/etc/resurs/supersearch/web.cfg.properties"),
})
public class Application extends SpringBootServletInitializer {

    @Value(value = "${supersearch.rest.url}")
    private String url;

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Application.class);
    }

    @Bean(name = "url")
    public ServletRegistrationBean restUrl() {
        return new ServletRegistrationBean(new RestUrlServlet(url),"/url/*");
    }


    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
