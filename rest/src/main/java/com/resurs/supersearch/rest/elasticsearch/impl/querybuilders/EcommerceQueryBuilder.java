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

/**
 * Created by Trind on 2014-02-22.
 */
@Component
public class EcommerceQueryBuilder implements com.resurs.supersearch.rest.elasticsearch.QueryBuilder {

    @Value("${supersearch.ecommerce.index}")
    String indexs;

    private static String[] fields = {

            "paymentDiffs.externalTransactionId",
            "paymentDiffs.invoiceId",
            "paymentDiffs.externalOrderId",

            "paymentDiffs.paymentSpecification.lines.articleNo",
            "paymentDiffs.paymentSpecification.lines.description",
            "paymentDiffs.paymentSpecification.lines.externalId",

            "customerGivenAddress.lastName",
            "customerGivenAddress.zipCode",
            "customerGivenAddress.street",
            "customerGivenAddress.fullName",
            "customerGivenAddress.firstName",
            "customerGivenAddress.city",

            "billingAddress.lastName",
            "billingAddress.zipCode",
            "billingAddress.street",
            "billingAddress.fullName",
            "billingAddress.firstName",
            "billingAddress.city",

            "deliveryAddress.lastName",
            "deliveryAddress.zipCode",
            "deliveryAddress.street",
            "deliveryAddress.fullName",
            "deliveryAddress.firstName",
            "deliveryAddress.city",

            "phone1",
            "phone2",

            "email",

            "externalId",
            "accountNumber",

            "customer.governmentId",
            "customer.governmentIdStringLong",
            "customer.governmentIdStringShort",
            "ip",
            "representative.bankSystemStoreId",
            "representative.name",
            "metaData.*",
            "fraudId",
            "reservationId",
            "multiupplysId",
            "lifePhase"
    };


    public List<String> getIndexes() {
        return Arrays.asList(indexs.split(";"));
    }

    public List<String> getTypes() {
        return Arrays.asList(new String[]{"payment"});
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
        return QueryBuilders.indicesQuery(queryBuilder, getIndexes().toArray(new String[0])).queryName(getQueryName());
    }

    @Override
    public String getQueryName() {
        return getSystemQueryEnum().name();
    }

    @Override
    public List<AggregationBuilder> createAggregations(Search search) {

        List<AggregationBuilder> aggregationBuilders = new ArrayList<>();

        aggregationBuilders.add(AggregationBuilders.terms("lifePhase.keyword").size(5).field("lifePhase.keyword")
                .subAggregation(AggregationBuilders.terms("annulled").size(5).field("annulled")));
        aggregationBuilders.add(AggregationBuilders.terms("representative.name.keyword").size(5).field("representative.name.keyword"));
        return aggregationBuilders;
    }

    @Override
    public QueryBuilder createCountryCodeFilter(List<CountryCode> countryCodes) {
        BoolQueryBuilder boolFilterBuilder = QueryBuilders.boolQuery().queryName(getQueryName());

        for (CountryCode countryCode : countryCodes) {
            boolFilterBuilder.should(
                    QueryBuilders.matchQuery(
                            "representative.countryCode", countryCode.name()));
        }
        return QueryBuilders.boolQuery().must(boolFilterBuilder);

    }

    @Override
    public SystemQueryEnum getSystemQueryEnum() {
        return SystemQueryEnum.ECOMMERCE;
    }

}
