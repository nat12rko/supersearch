package com.resurs.supersearch.rest.elasticsearch;

import org.elasticsearch.client.Client;

/**
 * Created by Trind on 2014-02-22.
 */
public interface ElasticSearchService {

    public Client getClient();

}
