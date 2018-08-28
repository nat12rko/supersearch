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
public class PaymentAndOrApplicationUpdatesQueryBuilder implements com.resurs.supersearch.rest.elasticsearch.QueryBuilder {

   /* @Value("${supersearch.paymentupdate.index}")
    String indexes;

    @Value("${supersearch.paymentupdate.types}")
    String types;

*/

    private static String[] fields = {

            //"created",
            "modified",
            "customer.fullName.keyword",
            "customer.governmentId",
            "customer.email",
            "customer.countryCode",

            "customer.billingAddress.street",

            "customer.deliveryAddress.street",

            "store.representativeName",
            "payment.authorizedPaymentDiffs.description",

            "accountNbr",
            "paymentMethod.id",
            "channelType",

            "ip",
            "externalId",
            "paymentMethod.type",
            "paymentStatus"



    };
    public List<String> getIndexes() {
        return Arrays.asList(new String[]{"paymentandorapplicationupdates"});                           //Hard-Coded
    }

    @Override
    public List<String> getTypes() {
        return Arrays.asList(new String[]{"paymentandorapplicationupdate"});
    }


    @Override
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

       // aggregationBuilders.add(AggregationBuilders.terms("timestamp").size(5).field("timestamp"));
        ;

        aggregationBuilders.add(AggregationBuilders.terms("paymentMethod.type").size(5).field("paymentMethod.type").subAggregation(AggregationBuilders.terms("paymentStatus.keyword").size(5).field("paymentStatus.keyword")));

        aggregationBuilders.add(AggregationBuilders.terms("store.representativeName").size(5).field("store.representativeName"));
        ;

        //aggregationBuilders.add(AggregationBuilders.terms("payment.authorizedPaymentDiffs.keyword").size(5).field("payment.authorizedPaymentDiffs.keyword"));
// aggregationBuilders.add(AggregationBuilders.terms("representativeName").size(5).field("paymentMethod.bankProductId.keyword"));

        return aggregationBuilders;
    }

    @Override
    public QueryBuilder createCountryCodeFilter(List<CountryCode> countryCodes) {
        BoolQueryBuilder boolFilterBuilder = QueryBuilders.boolQuery().queryName(getQueryName());

        for (CountryCode countryCode : countryCodes) {
            boolFilterBuilder.should(
                    QueryBuilders.matchQuery(
                            "customer.countrycode", countryCode.name()));


        }
        return QueryBuilders.boolQuery().must(boolFilterBuilder);
    }


    @Override
public SystemQueryEnum getSystemQueryEnum() {
        return SystemQueryEnum.PAYMENTUPDATE;
        }

}