package com.resurs.supersearch.rest.resources;

import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: joachim_a
 * Date: 2014-02-21
 * Time: 13:51
 * To change this template use File | Settings | File Templates.
 */
public class SearchResult {
    List<Hit> hits = new ArrayList<>();
    Long totalSize;
    Long searchTime;

    public List<Hit> getHits() {
        return hits;
    }

    public void setHits(List<Hit> hits) {
        this.hits = hits;
    }

    public Long getTotalSize() {
        return totalSize;
    }

    public void setTotalSize(Long totalSize) {
        this.totalSize = totalSize;
    }

    public Long getSearchTime() {
        return searchTime;
    }

    public void setSearchTime(Long searchTime) {
        this.searchTime = searchTime;
    }
}
