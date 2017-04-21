package com.resurs.supersearch.rest.elasticsearch;

import com.resurs.commons.l10n.CountryCode;
import com.resurs.supersearch.rest.resources.Search;
import com.resurs.supersearch.rest.resources.SystemQueryEnum;
import org.elasticsearch.search.aggregations.AggregationBuilder;

import java.util.List;

/**
 * Created by Trind on 2014-02-22.
 */
public interface QueryBuilder {

    List<String> getIndexes();

    List<String> getTypes();

    org.elasticsearch.index.query.QueryBuilder createQuery(Search search);

    String getQueryName();

    List<AggregationBuilder> createAggregations(Search search);

    org.elasticsearch.index.query.QueryBuilder createCountryCodeFilter(List<CountryCode> countryCodes);

    SystemQueryEnum getSystemQueryEnum();


}
