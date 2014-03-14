package com.resurs.supersearch.rest.elasticsearch.impl.querybuilders;

import com.resurs.commons.l10n.CountryCode;
import com.resurs.supersearch.rest.resources.Search;
import com.resurs.supersearch.rest.resources.SystemQueryEnum;
import org.elasticsearch.index.query.BoolFilterBuilder;
import org.elasticsearch.index.query.FilterBuilder;
import org.elasticsearch.index.query.FilterBuilders;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Created by Trind on 2014-02-22.
 */
@Component
public class LimitQueryBuilder implements com.resurs.supersearch.rest.elasticsearch.QueryBuilder {


    @Value("${supersearch.limit.index}")
    String indexs;


    public List<String> getIndexes() {
        return Arrays.asList(indexs.split(";"));
    }

    public List<String> getTypes() {
        return Arrays.asList(new String[]{"limitresponse"});
    }

    public QueryBuilder createQuery(Search search) {
        QueryBuilder queryBuilder = QueryBuilders
                .boolQuery()
                .must(QueryBuilders.queryString(search.getSearchString()));
        return QueryBuilders
                .boolQuery().must(QueryBuilders.indicesQuery(queryBuilder, getIndexes().toArray(new String[0]))).queryName(getQueryName());
    }

    @Override
    public String getQueryName() {
        return getSystemQueryEnum().name();
    }


    @Override
    public List<AggregationBuilder> createAggregations(Search search) {

        List<AggregationBuilder> aggregationBuilders = new ArrayList<>();

        aggregationBuilders.add(AggregationBuilders.terms("limitresponse.decision").size(5).field("limitresponse.decision"));
        return aggregationBuilders;
    }

    @Override
    public FilterBuilder createCountryCodeFilter(List<CountryCode> countryCodes) {
        BoolFilterBuilder boolFilterBuilder = FilterBuilders.boolFilter().filterName(getQueryName());

        for (CountryCode countryCode : countryCodes) {
            boolFilterBuilder.should(FilterBuilders.queryFilter(
                    QueryBuilders.matchQuery(
                    "limitresponse.customer.countryCode", countryCode.name())));
        }
        return FilterBuilders.boolFilter().must(boolFilterBuilder);

    }


    @Override
    public SystemQueryEnum getSystemQueryEnum() {
        return SystemQueryEnum.LIMIT;
    }

}
