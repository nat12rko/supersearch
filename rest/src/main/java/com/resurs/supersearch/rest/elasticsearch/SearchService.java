package com.resurs.supersearch.rest.elasticsearch;

import com.resurs.supersearch.rest.resources.Hit;
import com.resurs.supersearch.rest.resources.Search;
import com.resurs.supersearch.rest.resources.SearchResult;

import java.util.List;

/**
 * Created by Trind on 2014-02-22.
 */
public interface SearchService {

    SearchResult search(Search search);

    List<Hit> getLimitByMultiupplysId(String id);

    List<Hit> getEcommerceByMultiupplysId(String id);

    List<Hit> getFraudByMultiupplysId(String id);

    List<Hit> getMultiupplysById(String id);

}
