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
public class CreditRequestQueryBuilder implements com.resurs.supersearch.rest.elasticsearch.QueryBuilder {


    @Value("${supersearch.creditrequest.index}")
    String indexs;


    private static String[] fieldsCreditProduct = {
            "multiUpplysReferenceId",
            "limitReservationId",
            "decision",
            "customerIp",
            "creditProductName",
            "multiUpplysCreditProduct",
            "countryCode",
            "user",
            "governmentId",
            "applicationData.*"
    };


    public List<String> getIndexes() {
        return Arrays.asList(indexs.split(";"));
    }

    public List<String> getTypes() {
        return Arrays.asList(new String[]{"CreditRequest"});
    }

    public QueryBuilder createQuery(Search search) {

        QueryStringQueryBuilder queryStringQueryBuilder =
                QueryBuilders.queryStringQuery(search.getSearchString()).lenient(true);

        for (String field : fieldsCreditProduct) {
            queryStringQueryBuilder.field(field);
        }

        BoolQueryBuilder queryBuilder = QueryBuilders.boolQuery().must(queryStringQueryBuilder)
                .must(QueryBuilders.termsQuery("_type", getTypes()));
        return QueryBuilders.indicesQuery(queryBuilder, getIndexes().toArray(new String[0])).queryName(getQueryName());

    }

    @Override
    public String getQueryName() {
        return "creditrequest";
    }

    @Override
    public List<AggregationBuilder> createAggregations(Search search) {
        List<AggregationBuilder> aggregationBuilders = new ArrayList<>();

        aggregationBuilders.add(AggregationBuilders.terms("multiUpplysCreditProduct").size(5).field("multiUpplysCreditProduct.keyword"));
        aggregationBuilders.add(AggregationBuilders.terms("creditProductName").size(5).field("creditProductName.keyword"));
        aggregationBuilders.add(AggregationBuilders.terms("user").size(5).field("user.keyword"));
        aggregationBuilders.add(AggregationBuilders.terms("decision").size(5).field("decision.keyword"));

        return aggregationBuilders;
    }

    @Override
    public QueryBuilder createCountryCodeFilter(List<CountryCode> countryCodes) {

        BoolQueryBuilder boolFilterBuilder = QueryBuilders.boolQuery().queryName(getQueryName());

        for (CountryCode countryCode : countryCodes) {
            boolFilterBuilder.should(QueryBuilders.matchQuery("countryCode.keyword",
                    countryCode.name()));
        }

        return QueryBuilders.boolQuery().must(boolFilterBuilder);
    }

    @Override
    public SystemQueryEnum getSystemQueryEnum() {
        return SystemQueryEnum.CREDITREQUEST;
    }


}
