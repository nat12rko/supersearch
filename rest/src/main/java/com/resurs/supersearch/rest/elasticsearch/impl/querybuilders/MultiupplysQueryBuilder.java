package com.resurs.supersearch.rest.elasticsearch.impl.querybuilders;

import com.resurs.commons.l10n.CountryCode;
import com.resurs.supersearch.rest.resources.Search;
import com.resurs.supersearch.rest.resources.SystemQueryEnum;
import org.apache.lucene.search.join.ScoreMode;
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
public class MultiupplysQueryBuilder implements com.resurs.supersearch.rest.elasticsearch.QueryBuilder {


    @Value("${supersearch.multiupplys.index}")
    String indexs;

    private static String[] fieldsCustomer = {
            "customerAddresses.*",
            "governmentId.value",
            "email",
            "lastName",
            "firstName",
            "middleName",
            "fullName"
    };
    private static String[] fieldsCreditProduct = {
            "creditProductCode",
            "referenceNumber.internalReferenceNumber",
            "publicReferenceNumber",
            "creditCaseTags.*",
            "application.externalReference",
            "application.applicant.emailAddress",
            "application.applicant.*PhoneNumber",
            "application.coapplicant.emailAddress",
            "application.coApplicant.*PhoneNumber",
    };


    public List<String> getIndexes() {
        return Arrays.asList(indexs.split(";"));
    }

    public List<String> getTypes() {
        return Arrays.asList(new String[]{"creditcase"});
    }

    public QueryBuilder createQuery(Search search) {
        QueryStringQueryBuilder queryStringQueryBuilderChild =
                QueryBuilders.queryStringQuery(search.getSearchString()).lenient(true);

        for (String field : fieldsCustomer) {
            queryStringQueryBuilderChild.field(field);
        }

        QueryStringQueryBuilder queryStringQueryBuilder =
                QueryBuilders.queryStringQuery(search.getSearchString()).lenient(true);

        for (String field : fieldsCreditProduct) {
            queryStringQueryBuilder.field(field);
        }


        QueryBuilder queryBuilder = QueryBuilders
                .boolQuery()
                .should(QueryBuilders.hasChildQuery("customer", queryStringQueryBuilderChild, ScoreMode.Avg))
                .should(queryStringQueryBuilder);


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

        aggregationBuilders.add(AggregationBuilders.terms("currentState.state.keyword").size(5).field("currentState.state.keyword"));
        aggregationBuilders.add(AggregationBuilders.terms("creditCaseTags.REPRESENTATIVE_NAME").size(5).field("creditCaseTags.REPRESENTATIVE_NAME.keyword"));
        aggregationBuilders.add(AggregationBuilders.terms("creditProductCode.keyword").size(5).field("creditProductCode.keyword"));

        return aggregationBuilders;
    }

    @Override
    public QueryBuilder createCountryCodeFilter(List<CountryCode> countryCodes) {

        BoolQueryBuilder boolFilterBuilder = QueryBuilders.boolQuery().queryName(getQueryName());

        for (CountryCode countryCode : countryCodes) {
            boolFilterBuilder.should(QueryBuilders.matchQuery("application.applicant.governmentId.countryCode",
                    countryCode.name()));
        }

        return QueryBuilders.boolQuery().must(boolFilterBuilder);
    }

    @Override
    public SystemQueryEnum getSystemQueryEnum() {
        return SystemQueryEnum.MULTIUPPLYS;
    }


}
