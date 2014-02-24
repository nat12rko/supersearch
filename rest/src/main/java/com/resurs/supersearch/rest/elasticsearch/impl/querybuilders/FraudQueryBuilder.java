package com.resurs.supersearch.rest.elasticsearch.impl.querybuilders;

import com.resurs.supersearch.rest.resources.Search;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;

import java.util.Arrays;
import java.util.List;

/**
 * Created by Trind on 2014-02-22.
 */
public class FraudQueryBuilder implements com.resurs.supersearch.rest.elasticsearch.QueryBuilder {

    public List<String> getIndexes() {
        return Arrays.asList(new String[]{"fraud"});
    }

    public List<String> getTypes() {
        return Arrays.asList(new String[]{"fraudsummary"});
    }

    public QueryBuilder createQuery(Search search) {
        QueryBuilder queryBuilder = QueryBuilders
                .boolQuery()
                .must(QueryBuilders.queryString(search.getSearchString()));
        return QueryBuilders.indicesQuery(queryBuilder, getIndexes().toArray(new String[0]));
    }

}
