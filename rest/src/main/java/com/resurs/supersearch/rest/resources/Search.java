package com.resurs.supersearch.rest.resources;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.resurs.commons.l10n.CountryCode;
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
@JsonIgnoreProperties(ignoreUnknown = true)
public class Search {


    List<CountryCode> countryCodes = new ArrayList<>();
    Integer page = 0;
    Integer pageSize = 25;

    String sortField;
    SortOrder sortOrder;
    String searchString = "";

    /**
     * http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/mapping-date-format.html
     */
    String fromDate;
    String toDate;

    List<Filter> filters = new ArrayList<>();
    List<SystemQueryEnum> systems = new ArrayList<>();

    public Search() {

    }

    public List<CountryCode> getCountryCodes() {
        return countryCodes;
    }

    public void setCountryCodes(List<CountryCode> countryCodes) {
        this.countryCodes = countryCodes;
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

    public List<SystemQueryEnum> getSystems() {
        return systems;
    }

    public void setSystems(List<SystemQueryEnum> systems) {
        this.systems = systems;
    }


    public String getFromDate() {
        return fromDate;
    }

    public void setFromDate(String fromDate) {
        this.fromDate = fromDate;
    }

    public String getToDate() {
        return toDate;
    }

    public void setToDate(String toDate) {
        this.toDate = toDate;
    }

    @Override
    public String toString() {
        return "Search{" +
                "countryCodes=" + countryCodes +
                ", sortField='" + sortField + '\'' +
                ", sortOrder=" + sortOrder +
                ", searchString='" + searchString + '\'' +
                ", fromDate='" + fromDate + '\'' +
                ", toDate='" + toDate + '\'' +
                ", filters=" + filters +
                ", systems=" + systems +
                '}';
    }
}
