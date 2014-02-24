package com.resurs.supersearch.rest.resources;

import org.apache.commons.lang3.StringUtils;
import org.elasticsearch.search.sort.SortOrder;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: joachim_a
 * Date: 2014-02-21
 * Time: 15:01
 * To change this template use File | Settings | File Templates.
 */
@XmlRootElement()
public class Search {

    Integer page = 0;
    Integer pageSize = 25;

    String sortField;
    SortOrder sortOrder;
    String searchString = "*";

    List<Filter> filters = new ArrayList<>();

    public Search() {

    }

    public String getSearchString() {
        return StringUtils.isEmpty(searchString) ? "*" : searchString;
    }

    public void setSearchString(String searchString) {
        this.searchString = searchString;
    }

    public List<Filter> getFilters() {
        return filters;
    }

    public void setFilters(List<Filter> filters) {
        this.filters = filters;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public String getSortField() {
        return sortField;
    }

    public void setSortField(String sortField) {
        this.sortField = sortField;
    }

    public SortOrder getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(SortOrder sortOrder) {
        this.sortOrder = sortOrder;
    }
}
