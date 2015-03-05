package com.resurs.supersearch.rest.configuration;

import com.resurs.supersearch.rest.impl.SearchServiceRest;
import org.glassfish.jersey.server.ResourceConfig;
import org.springframework.stereotype.Component;

import javax.ws.rs.ApplicationPath;

/**
 * Created by Joachim on 2015-02-05.
 */
@Component
@ApplicationPath("")
public class JerseyConfig  extends ResourceConfig {

    public JerseyConfig() {
        register(SearchServiceRest.class);
    }

}