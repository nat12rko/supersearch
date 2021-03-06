package com.resurs.supersearch.rest.elasticsearch.impl.querybuilders;

import com.resurs.commons.l10n.CountryCode;
import com.resurs.supersearch.rest.resources.Search;
import com.resurs.supersearch.rest.resources.SystemQueryEnum;
import org.elasticsearch.index.query.*;
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

public class InvoiceQueryBuilder implements com.resurs.supersearch.rest.elasticsearch.QueryBuilder {

    @Value("${supersearch.invoice.index}")
    String indexs;

    private static String[] fields = {
            "governmentIdString",
            "oCRNumber",
            "chainId"
    };


    public List<String> getIndexes() {
        return Arrays.asList(indexs.split(";"));
    }

    public List<String> getTypes() {
        return Arrays.asList(new String[]{"invoice"});
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
        return QueryBuilders.indicesQuery(queryBuilder, getIndexes().toArray(new String[0])).queryName("invoice");
    }


    @Override
    public String getQueryName() {
        return getSystemQueryEnum().name();
    }

    @Override
    public List<AggregationBuilder> createAggregations(Search search) {
        List<AggregationBuilder> aggregationBuilders = new ArrayList<>();
        aggregationBuilders.add(AggregationBuilders.terms("invoice.type").size(5).field("invoice.type"));
        aggregationBuilders.add(AggregationBuilders.terms("invoice.chainId").size(5).field("invoice.chainId"));
        return aggregationBuilders;
    }

    @Override
    public QueryBuilder createCountryCodeFilter(List<CountryCode> countryCodes) {
        BoolQueryBuilder boolFilterBuilder = QueryBuilders.boolQuery().queryName(getQueryName());

        for (CountryCode countryCode : countryCodes) {
            boolFilterBuilder.should(
                    QueryBuilders.matchQuery(
                            "FraudSummary.countryCode", countryCode.name()));
        }
        return QueryBuilders.boolQuery().must(boolFilterBuilder);

    }

    @Override
    public SystemQueryEnum getSystemQueryEnum() {
        return SystemQueryEnum.INVOICE;
    }

}
