package com.resurs.supersearch.rest.configuration;

import com.resurs.utils.elasticsearch.ElasticsearchService;
import com.resurs.utils.elasticsearch.impl.ElasticsearchServiceImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ElasticsearchConfig {

    @Value("${supersearch.elastic.username}")
    private String username;
    @Value("${supersearch.elastic.password}")
    private String password;
    @Value("${supersearch.elastic.host}")
    private String host;
    @Value("${supersearch.elastic.clustername}")
    private String clusterName;

    @Bean
    public ElasticsearchService createElasticSearchService() throws Exception {
        return new ElasticsearchServiceImpl(host, clusterName,"supersearch", username,password, "com.resurs.supersearch.rest.service");
    }
}
