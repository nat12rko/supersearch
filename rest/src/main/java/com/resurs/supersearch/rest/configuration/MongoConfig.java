package com.resurs.supersearch.rest.configuration;


import com.mongodb.Mongo;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientOptions;
import com.mongodb.ServerAddress;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.mongodb.config.AbstractMongoConfiguration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import java.util.ArrayList;
import java.util.List;

@Configuration
@EnableMongoRepositories(basePackages = "com.resurs.supersearch")
public class MongoConfig extends AbstractMongoConfiguration {

    private static final int DB_CFG_MAXIMUM_NUMBER_OF_CONNECTIONS = 100;
    private static final int DB_CFG_MAXIMUM_WAIT_TIME = 2000;
    private static final int DB_CFG_THREADS_ALLOWED_TO_BLOCK_FOR_CONNECTION_MULTIPLIER = 50;
    private static final int DB_CFG_MAXIMUM_CONNECTION_IDLE_TIME = 10000;
    private static final int DB_CFG_MAXIMUM_CONNECTION_LIFE_TIME = 10000;

    private final List<Converter<?, ?>> converters = new ArrayList<>();
    private final String host;
    private final String database;


    public MongoConfig(
            @Value(value = "${mongodb.host}") String host,
            @Value(value = "${mongodb.database:supersearchsessions}") String database) {

        super();
        this.host = host;
        this.database = database;
    }

    @Override
    protected String getDatabaseName() {
        return database;
    }

    @Bean
    @Override
    @SuppressWarnings("PMD.SignatureDeclareThrowsException")
    public Mongo mongo() throws Exception {

        String[] split = host.split(",");

        List<ServerAddress> seeds = new ArrayList<>();

        for (String s : split) {
            String[] add = s.split(":");
            if (add.length == 1) {
                seeds.add(new ServerAddress(add[0]));
            } else {
                seeds.add(new ServerAddress(add[0], Integer.parseInt(add[1])));
            }
        }

        MongoClientOptions options = MongoClientOptions.builder()
                .connectionsPerHost(DB_CFG_MAXIMUM_NUMBER_OF_CONNECTIONS)
                .maxWaitTime(DB_CFG_MAXIMUM_WAIT_TIME)
                .socketKeepAlive(true)
                .threadsAllowedToBlockForConnectionMultiplier(DB_CFG_THREADS_ALLOWED_TO_BLOCK_FOR_CONNECTION_MULTIPLIER)
                .maxConnectionIdleTime(DB_CFG_MAXIMUM_CONNECTION_IDLE_TIME)
                .maxConnectionLifeTime(DB_CFG_MAXIMUM_CONNECTION_LIFE_TIME)
                .build();

        return new MongoClient(seeds, options);
    }

    @Override
    protected String getMappingBasePackage() {
        return "com.resurs.supersearch";
    }


}