package com.resurs.supersearch.rest.elasticsearch.impl;

import com.resurs.commons.l10n.CountryCode;
import com.resurs.supersearch.rest.elasticsearch.ElasticSearchService;
import com.resurs.supersearch.rest.elasticsearch.QueryBuilder;
import com.resurs.supersearch.rest.elasticsearch.QueryParser;
import com.resurs.supersearch.rest.elasticsearch.SearchService;
import com.resurs.supersearch.rest.elasticsearch.impl.querybuilders.EcommerceQueryBuilder;
import com.resurs.supersearch.rest.elasticsearch.impl.querybuilders.FraudQueryBuilder;
import com.resurs.supersearch.rest.elasticsearch.impl.querybuilders.InvoiceQueryBuilder;
import com.resurs.supersearch.rest.elasticsearch.impl.querybuilders.LimitQueryBuilder;
import com.resurs.supersearch.rest.elasticsearch.impl.querybuilders.MultiupplysQueryBuilder;
import com.resurs.supersearch.rest.elasticsearch.impl.queryparsers.GovernmentIdQueryParser;
import com.resurs.supersearch.rest.elasticsearch.impl.queryparsers.PhoneNumberQueryParser;
import com.resurs.supersearch.rest.resources.Aggregate;
import com.resurs.supersearch.rest.resources.AggregateResult;
import com.resurs.supersearch.rest.resources.Filter;
import com.resurs.supersearch.rest.resources.Hit;
import com.resurs.supersearch.rest.resources.Search;
import com.resurs.supersearch.rest.resources.SearchResult;
import com.resurs.supersearch.rest.resources.SystemQueryEnum;
import org.apache.commons.lang3.StringUtils;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.index.query.BoolFilterBuilder;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.FilterBuilder;
import org.elasticsearch.index.query.FilterBuilders;
import org.elasticsearch.index.query.HasParentQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.RangeFilterBuilder;
import org.elasticsearch.index.query.TermQueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.aggregations.Aggregation;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.sort.FieldSortBuilder;
import org.elasticsearch.search.sort.SortBuilder;
import org.elasticsearch.search.sort.SortBuilders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Trind on 2014-02-22.
 */
@Service
public class SearchServiceImpl implements SearchService {

    List<QueryBuilder> queryBuilders = new ArrayList<>();

    List<QueryParser> queryParsers = new ArrayList<>();

    private static final Map<String, String> displayValues;

    static {
        displayValues = new HashMap<>();
        displayValues.put("payment.representative.name", "Representative");
        displayValues.put("annulled", "Annulled");
        displayValues.put("payment.lifePhase", "LifePhase");
        displayValues.put("FraudSummary.recommendation", "Recommendation");
        displayValues.put("invoice.type", "Invoice Type");
        displayValues.put("invoice.chainId", "ChainId");
        displayValues.put("payment.lifePhase", "Life Phase");
        displayValues.put("limitresponse.decision", "Decision");
        displayValues.put("creditcase.currentState.state", "State");
        displayValues.put("creditcase.creditCaseTags.REPRESENTATIVE_NAME", "Representative");
        displayValues.put("creditcase.creditProductCode", "Credit Product");
        displayValues.put("_type", "System");
        displayValues.put("T", "Yes");
        displayValues.put("F", "No");
        displayValues.put("INVOICE_WITH_OPTION_LINES", "Invoice with Paymentoption");
        displayValues.put("INVOICE", "Invoice");
        displayValues.put("INVOICE_CREDITNOTE", "Credit Note");

        displayValues.put("limitresponse", "Limit");
        displayValues.put("FraudSummary", "Fraud");
        displayValues.put("creditcase", "Multiupplys");
        displayValues.put("payment", "Ecommerce");
        displayValues.put("invoice", "Invoice");








    }


    @Autowired
    EcommerceQueryBuilder ecommerceQueryBuilder;

    @Autowired
    FraudQueryBuilder fraudQueryBuilder;

    @Autowired
    LimitQueryBuilder limitQueryBuilder;

    @Autowired
    MultiupplysQueryBuilder multiupplysQueryBuilder;

    @Autowired
    ElasticSearchService elasticSearchService;

    @Autowired
    InvoiceQueryBuilder invoiceQueryBuilder;

    @Autowired
    GovernmentIdQueryParser governmentIdQueryParser;

    @Autowired
    PhoneNumberQueryParser phoneNumberQueryParser;

    public SearchServiceImpl() {

    }

    @PostConstruct
    public void create() {
        /** Add QueryBuilders. */
        queryBuilders = new ArrayList<>();
        queryBuilders.add(ecommerceQueryBuilder);
        queryBuilders.add(multiupplysQueryBuilder);
        queryBuilders.add(limitQueryBuilder);
        queryBuilders.add(fraudQueryBuilder);
        queryBuilders.add(invoiceQueryBuilder);

        /** Add QueryParsers.*/
        queryParsers = new ArrayList<>();

        queryParsers.add(governmentIdQueryParser);
        queryParsers.add(phoneNumberQueryParser);
    }


    public List<Hit> getMultiupplysById(String id) {

        TermQueryBuilder publicReferenceNumber = QueryBuilders.termQuery("publicReferenceNumber", id);
        HasParentQueryBuilder creditcase = QueryBuilders.hasParentQuery("creditcase", publicReferenceNumber);

        List<Hit> search = search(publicReferenceNumber);
        search.addAll(search(creditcase));


        return search;
    }

    public List<Hit> getLimitByMultiupplysId(String id) {
        TermQueryBuilder publicReferenceNumber = QueryBuilders.termQuery("mupRefNumber", id);
        return search(publicReferenceNumber);
    }

    public List<Hit> getEcommerceByMultiupplysId(String id) {
        TermQueryBuilder publicReferenceNumber = QueryBuilders.termQuery("multiupplysId", id);
        return search(publicReferenceNumber);
    }

    public List<Hit> getEcommerceByFraudId(String id) {
        TermQueryBuilder fraudId = QueryBuilders.termQuery("fraudId", id);
        return search(fraudId);
    }

    public List<Hit> getEcommerceBydId(String id) {
        TermQueryBuilder ecommerceId = QueryBuilders.termQuery("id", id);
        return search(ecommerceId);
    }


    public List<Hit> getFraudByMultiupplysId(String id) {
        TermQueryBuilder publicReferenceNumber = QueryBuilders.termQuery("controlRequestJson.ids.MUP_ID", id);
        return search(publicReferenceNumber);
    }

    private List<Hit> search(org.elasticsearch.index.query.QueryBuilder queryBuilder) {

        SearchRequestBuilder searchRequestBuilder =
                elasticSearchService.getClient().prepareSearch("_all")
                        .setQuery(queryBuilder).
                        setSearchType(SearchType.QUERY_THEN_FETCH).setTrackScores(false).addSort(SortBuilders.fieldSort("_timestamp"));


        SearchResponse searchResponse = searchRequestBuilder.setFrom(0)
                .setSize(100).setExplain(false)
                .execute()
                .actionGet();

        SearchHits searchHits = searchResponse.getHits();

        ArrayList<Hit> hits = new ArrayList<>();

        for (SearchHit searchHit : searchHits.getHits()) {
            Hit hit = new Hit();
            hit.setObject(searchHit.getSource());
            hit.setType(searchHit.getType());
            hits.add(hit);
        }

        return hits;
    }


    public SearchResult search(Search search) {

        /** Sort out the Selected Query bases on what systems the search should apply for.*/

        search = parseSearchQuery(search);

        BoolQueryBuilder queryBuilder = QueryBuilders
                .boolQuery();


        List<String> indexList = new ArrayList<>();
        List<String> typesList = new ArrayList<>();
        List<AggregationBuilder> aggregationBuilders = new ArrayList<>();


        AggregationBuilder aggregationBuilder = AggregationBuilders.terms("_type").field("_type").size(5);
        aggregationBuilders.add(aggregationBuilder);

        BoolFilterBuilder allFilterBuilder = FilterBuilders.boolFilter();
        allFilterBuilder.must(FilterBuilders.matchAllFilter());


        BoolFilterBuilder countryFilter = null;
        for (QueryBuilder qb : getSelectedQueryBuilders(search.getSystems())) {
            indexList.addAll(qb.getIndexes());
            typesList.addAll(qb.getTypes());

            queryBuilder = queryBuilder.should(
                    QueryBuilders.filteredQuery(qb.createQuery(search),
                            FilterBuilders.queryFilter(QueryBuilders.termsQuery("_type", qb.getTypes())))
            );


            List<AggregationBuilder> aggregations = qb.createAggregations(search);
            if (aggregations != null) {
                for (AggregationBuilder sub : aggregations) {
                    aggregationBuilder.subAggregation(sub);
                }
            }
            if (search.getCountryCodes() != null &&
                    search.getCountryCodes().size() != 0 &&
                    search.getCountryCodes().size() != (CountryCode.values().length - 1)) {
                FilterBuilder filterBuilder = qb.createCountryCodeFilter(search.getCountryCodes());
                if (filterBuilder != null) {
                    if (countryFilter == null) {
                        countryFilter = FilterBuilders.boolFilter();
                    }
                    countryFilter.should(filterBuilder);
                }
            }
        }

        if (countryFilter != null) {
            allFilterBuilder.must(countryFilter);

        }
        addFiltersToSearch(search, allFilterBuilder);
        SearchResponse response = executeQuery(search, queryBuilder, indexList, typesList, aggregationBuilders, allFilterBuilder);
        SearchResult searchResult = new SearchResult();
        createSearchResult(response, searchResult);
        return searchResult;

    }

    private void addFiltersToSearch(Search search, BoolFilterBuilder allFilterBuilder) {
        if (StringUtils.isNotEmpty(search.getFromDate()) || StringUtils.isNotEmpty(search.getToDate())) {
            RangeFilterBuilder rangeFilterBuilder = FilterBuilders.rangeFilter("_timestamp");
            if (StringUtils.isNotEmpty(search.getFromDate())) {
                rangeFilterBuilder.from(search.getFromDate());
            }
            if (StringUtils.isNotEmpty(search.getToDate())) {
                rangeFilterBuilder.to(search.getToDate());

            }
            rangeFilterBuilder = rangeFilterBuilder.timeZone("+1:00");
            allFilterBuilder.must(rangeFilterBuilder);
        }

        for (Filter filter : search.getFilters()) {
            allFilterBuilder.must(FilterBuilders.termFilter(filter.getField(), filter.getValue()));
        }
    }

    private List<QueryBuilder> getSelectedQueryBuilders(List<SystemQueryEnum> systemQueryEnums) {
        List<QueryBuilder> filteredQueryBuilders = new ArrayList<>();
        for (QueryBuilder queryBuilder : queryBuilders) {
            if (systemQueryEnums.contains(queryBuilder.getSystemQueryEnum())
                    || systemQueryEnums.size() == 0) {
                filteredQueryBuilders.add(queryBuilder);
            }
        }
        return filteredQueryBuilders;
    }

    private SearchResponse executeQuery(Search search, BoolQueryBuilder queryBuilder, List<String> indexList, List<String> typesList, List<AggregationBuilder> aggregationBuilders, BoolFilterBuilder allFilterBuilder) {
        SearchRequestBuilder searchRequestBuilder =
                elasticSearchService.getClient().prepareSearch(indexList.toArray(new String[0]))
                        .setQuery(QueryBuilders.filteredQuery(queryBuilder, allFilterBuilder)).
                        setSearchType(SearchType.QUERY_THEN_FETCH).setTrackScores(false);

        setSortField(search, searchRequestBuilder);

        for (AggregationBuilder agg : aggregationBuilders) {
            searchRequestBuilder = searchRequestBuilder.addAggregation(agg);
        }
        return searchRequestBuilder.setFrom(search.getPage() * search.getPageSize())
                .setSize(search.getPageSize()).setExplain(false)
                .execute()
                .actionGet();
    }

    private Search parseSearchQuery(Search search) {
        for (QueryParser queryParser : queryParsers) {
            if (StringUtils.isNotEmpty(search.getSearchString()) && !search.getSearchString().contains("(")) {
                search.setSearchString(queryParser.parseString(search.getSearchString(), search.getCountryCodes()));
            }
        }
        return search;
    }


    private void createSearchResult(SearchResponse response, SearchResult searchResult) {
        SearchHits searchHits = response.getHits();

        for (SearchHit searchHit : searchHits.getHits()) {
            Hit hit = new Hit();
            hit.setObject(searchHit.getSource());
            hit.setType(searchHit.getType());
            searchResult.getHits().add(hit);
        }

        searchResult.setTotalSize(response.getHits().getTotalHits());
        searchResult.setSearchTime(response.getTookInMillis());

        createAggregateResult(response.getAggregations().asList(), searchResult.getAggregates());

    }

    private void createAggregateResult(List<Aggregation> aggregations, List<Aggregate> aggregates) {
        for (Aggregation aggregation : aggregations) {
            if (aggregation instanceof org.elasticsearch.search.aggregations.bucket.terms.Terms
                    && ((org.elasticsearch.search.aggregations.bucket.terms.Terms) aggregation).getBuckets().size() > 0) {
                Aggregate aggregate = new Aggregate();
                aggregates.add(aggregate);
                aggregate.setName(aggregation.getName());
                aggregate.setDisplay(getDisplayName(aggregate.getName()));

                for (org.elasticsearch.search.aggregations.bucket.terms.Terms.Bucket bucket : ((org.elasticsearch.search.aggregations.bucket.terms.Terms) aggregation).getBuckets()) {

                    AggregateResult aggregateResult = new AggregateResult();
                    aggregateResult.setValue(bucket.getKey());
                    aggregateResult.setDisplay(getDisplayName(bucket.getKey()));
                    aggregateResult.setHits(bucket.getDocCount());

                    aggregate.getChildren().add(aggregateResult);

                    if (bucket.getAggregations().asList().size() > 0) {
                        createAggregateResult(bucket.getAggregations().asList(), aggregateResult.getChildren());
                    }


                }
            }
        }
    }

    private void setSortField(Search search, SearchRequestBuilder searchRequestBuilder) {
        search.setSortField("_timestamp");
        SortBuilder sortBuilder = null;


        if (StringUtils.isNotEmpty(search.getSortField())) {
            sortBuilder = new FieldSortBuilder(search.getSortField());
            ((FieldSortBuilder) sortBuilder).ignoreUnmapped(true);
            if (search.getSortOrder() != null) {
                sortBuilder.order(search.getSortOrder());
            } else {
                sortBuilder.order(org.elasticsearch.search.sort.SortOrder.DESC);
            }
        }

        if (sortBuilder != null) {
            searchRequestBuilder.addSort(sortBuilder);
        }
    }

    public String getDisplayName(String name) {
        String returnValue = displayValues.get(name);
        return StringUtils.isNoneBlank(returnValue) ? returnValue : name;
    }

}
