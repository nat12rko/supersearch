package com.resurs.supersearch.rest.elasticsearch;

import com.resurs.supersearch.rest.resources.Search;

import java.util.List;

/**
 * Created by Trind on 2014-02-22.
 */
public interface QueryBuilder {

    public List<String> getIndexes();

    public List<String> getTypes();

    public org.elasticsearch.index.query.QueryBuilder createQuery(Search search);

}
