package com.resurs.supersearch.rest.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.util.Log4jConfigurer;

import javax.annotation.PostConstruct;
import java.io.FileNotFoundException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Created by Joachim on 2015-02-05.
 */
@SpringBootApplication
@EnableAutoConfiguration
@ComponentScan("com.resurs.supersearch.rest")
@PropertySources({
        @PropertySource(value = "file:/etc/resurs/supersearch/rest.cfg.properties"),
})
public class Application extends SpringBootServletInitializer {

    @Value("${rest.logging.config.location}")
    private String loggingConfigLocation;

    @PostConstruct
    void updateLogConfig() throws FileNotFoundException {
        Path path = Paths.get(loggingConfigLocation);
        if (Files.exists(path)) {
            Log4jConfigurer.initLogging(loggingConfigLocation);
        }
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Application.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
