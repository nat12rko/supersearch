package com.resurs.supersearch.rest.elasticsearch;

import com.resurs.supersearch.rest.resources.Search;
import com.resurs.supersearch.rest.resources.SearchResult;

/**
 * Created by Trind on 2014-02-22.
 */
public interface SearchService {

    public SearchResult search(Search search);

}
