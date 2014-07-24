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
public class MultiupplysQueryBuilder implements com.resurs.supersearch.rest.elasticsearch.QueryBuilder {


    @Value("${supersearch.multiupplys.index}")
    String indexs;


    public List<String> getIndexes() {
        return Arrays.asList(indexs.split(";"));
    }

    public List<String> getTypes() {
        return Arrays.asList(new String[]{"creditcase"});
    }

    public QueryBuilder createQuery(Search search) {
        QueryBuilder queryBuilder = QueryBuilders
                .boolQuery()
 /*              .should(QueryBuilders.hasChildQuery("application",
                        QueryBuilders.queryString(search.getSearchString())))*/
                .should(QueryBuilders.hasChildQuery("customer",
                        QueryBuilders.queryString(search.getSearchString())))
                .should(QueryBuilders.queryString(search.getSearchString()));


        queryBuilder = QueryBuilders.boolQuery().must(queryBuilder).must(QueryBuilders.termsQuery("_type", getTypes()));
        return QueryBuilders.indicesQuery(queryBuilder, getIndexes().toArray(new String[0])).queryName(getQueryName());
    }

    @Override
    public String getQueryName() {
        return "multiupplys";
    }

    @Override
    public List<AggregationBuilder> createAggregations(Search search) {
        List<AggregationBuilder> aggregationBuilders = new ArrayList<>();

        aggregationBuilders.add(AggregationBuilders.terms("creditcase.currentState.state").size(5).field("creditcase.currentState.state"));
        aggregationBuilders.add(AggregationBuilders.terms("creditcase.creditCaseTags.REPRESENTATIVE_NAME").size(5).field("creditcase.creditCaseTags.REPRESENTATIVE_NAME"));
        aggregationBuilders.add(AggregationBuilders.terms("creditcase.creditProductCode").size(5).field("creditcase.creditProductCode"));

        return aggregationBuilders;
    }

    @Override
    public FilterBuilder createCountryCodeFilter(List<CountryCode> countryCodes) {

        BoolFilterBuilder boolFilterBuilder = FilterBuilders.boolFilter().filterName(getQueryName());

        for (CountryCode countryCode : countryCodes) {
            boolFilterBuilder.should(FilterBuilders.queryFilter(QueryBuilders.matchQuery("application.applicant.governmentId.countryCode",
                    countryCode.name())));
        }

        return FilterBuilders.boolFilter().must(boolFilterBuilder);
    }

    @Override
    public SystemQueryEnum getSystemQueryEnum() {
        return SystemQueryEnum.MULTIUPPLYS;
    }


}
