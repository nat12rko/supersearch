package com.resurs.supersearch.rest.elasticsearch.impl.querybuilders;

import com.resurs.commons.l10n.CountryCode;
import com.resurs.supersearch.rest.resources.Search;
import com.resurs.supersearch.rest.resources.SystemQueryEnum;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.QueryStringQueryBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class LimitQueryBuilder implements com.resurs.supersearch.rest.elasticsearch.QueryBuilder {


    @Value("${supersearch.limit.index}")
    String indexs;


    private static String[] fields = {
            "reservationId",
            "mupRefNumber",
            "customer.email",
            "customer.firstName",
            "customer.fullName",
            "customer.governmentId",
            "customer.lastName",
            "customer.*Phone",
            "customer.address.*",
            "creditProductCode"
    };


    public List<String> getIndexes() {
        return Arrays.asList(indexs.split(";"));
    }

    public List<String> getTypes() {
        return Arrays.asList(new String[]{"limitresponse"});
    }

    public QueryBuilder createQuery(Search search) {

        QueryStringQueryBuilder queryStringQueryBuilder =
                QueryBuilders.queryStringQuery(search.getSearchString()).lenient(true);

        for (String field : fields) {
            queryStringQueryBuilder.field(field);
        }

        QueryBuilder queryBuilder = QueryBuilders
                .boolQuery()
                .must(queryStringQueryBuilder);
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

        aggregationBuilders.add(AggregationBuilders.terms("limitresponse.decision").size(5).field("decision.keyword"));
        return aggregationBuilders;
    }


    @Override
    public QueryBuilder createCountryCodeFilter(List<CountryCode> countryCodes) {
        BoolQueryBuilder boolFilterBuilder = QueryBuilders.boolQuery().queryName(getQueryName());

        for (CountryCode countryCode : countryCodes) {
            boolFilterBuilder.should(
                    QueryBuilders.matchQuery(
                            "limitresponse.customer.countryCode", countryCode.name()));
        }
        return QueryBuilders.boolQuery().must(boolFilterBuilder);

    }


    @Override
    public SystemQueryEnum getSystemQueryEnum() {
        return SystemQueryEnum.LIMIT;
    }

}
