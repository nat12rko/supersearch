package com.resurs.supersearch.rest.elasticsearch;

import com.resurs.commons.l10n.CountryCode;
import com.resurs.supersearch.rest.resources.Search;
import com.resurs.supersearch.rest.resources.SystemQueryEnum;
import org.elasticsearch.index.query.FilterBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilder;

import java.util.List;

/**
 * Created by Trind on 2014-02-22.
 */
public interface QueryBuilder {

    public List<String> getIndexes();

    public List<String> getTypes();

    public org.elasticsearch.index.query.QueryBuilder createQuery(Search search);

    public String getQueryName();

    public List<AggregationBuilder> createAggregations(Search search);

    public FilterBuilder createCountryCodeFilter(List<CountryCode> countryCodes);

    public SystemQueryEnum getSystemQueryEnum();

}
