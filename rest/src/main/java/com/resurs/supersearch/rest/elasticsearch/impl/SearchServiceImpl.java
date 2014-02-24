package com.resurs.supersearch.rest.elasticsearch.impl;

import com.resurs.supersearch.rest.elasticsearch.ElasticSearchService;
import com.resurs.supersearch.rest.elasticsearch.QueryBuilder;
import com.resurs.supersearch.rest.elasticsearch.SearchService;
import com.resurs.supersearch.rest.elasticsearch.impl.querybuilders.EcommerceQueryBuilder;
import com.resurs.supersearch.rest.elasticsearch.impl.querybuilders.FraudQueryBuilder;
import com.resurs.supersearch.rest.elasticsearch.impl.querybuilders.LimitQueryBuilder;
import com.resurs.supersearch.rest.elasticsearch.impl.querybuilders.MultiupplysQueryBuilder;
import com.resurs.supersearch.rest.resources.Hit;
import com.resurs.supersearch.rest.resources.Search;
import com.resurs.supersearch.rest.resources.SearchResult;
import org.apache.commons.lang3.StringUtils;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.sort.FieldSortBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Trind on 2014-02-22.
 */
@Service
public class SearchServiceImpl implements SearchService {

    List<QueryBuilder> queryBuilders = new ArrayList<>();


    @Autowired
    ElasticSearchService elasticSearchService;


    public SearchServiceImpl() {
        queryBuilders.add(new MultiupplysQueryBuilder());
        queryBuilders.add(new LimitQueryBuilder());
        queryBuilders.add(new EcommerceQueryBuilder());
        queryBuilders.add(new FraudQueryBuilder());
    }


    public SearchResult search(Search search) {

        BoolQueryBuilder queryBuilder = QueryBuilders
                .boolQuery();

        search.setSortField("_timestamp");
        FieldSortBuilder sortBuilder = null;
        if (StringUtils.isNotEmpty(search.getSortField())) {
            sortBuilder = new FieldSortBuilder(search.getSortField());
            sortBuilder.ignoreUnmapped(true);
            if (search.getSortOrder() != null) {
                sortBuilder.order(search.getSortOrder());
            } else {
                sortBuilder.order(org.elasticsearch.search.sort.SortOrder.DESC);
            }
        }

        //FilterBuilders.existsFilter("currentState.state").filterName("test").buildAsBytes()


        List<String> indexList = new ArrayList<>();
        List<String> typesList = new ArrayList<>();


        for (QueryBuilder qb : queryBuilders) {
            indexList.addAll(qb.getIndexes());
            typesList.addAll(qb.getTypes());
            queryBuilder.must(qb.createQuery(search));
        }
        System.out.println(queryBuilder);

        SearchRequestBuilder searchRequestBuilder =
                elasticSearchService.getClient().prepareSearch(indexList.toArray(new String[0]))
                        .setTypes(typesList.toArray(new String[0]))
                        .setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
                        .setQuery(queryBuilder);

        if (sortBuilder != null) {
            searchRequestBuilder = searchRequestBuilder.addSort(sortBuilder);
        }


        // .setPostFilter()

        SearchResponse response =
                // Query
                searchRequestBuilder.setFrom(search.getPage() * search.getPageSize()).setSize(search.getPageSize()).setExplain(false)
                        .execute()
                        .actionGet();


        SearchResult searchResult = new SearchResult();

        SearchHits searchHits = response.getHits();

        for (SearchHit searchHit : searchHits.getHits()) {
            Hit hit = new Hit();
            hit.setObject(searchHit.getSource());
            hit.setType(searchHit.getType());
            searchResult.getHits().add(hit);
            System.out.println(searchHit.getSourceAsString());
        }

        searchResult.setTotalSize(response.getHits().getTotalHits());
        searchResult.setSearchTime(response.getTookInMillis());

        return searchResult;

    }

}
