package com.resurs.supersearch.rest.resources;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by joachim_a on 2014-03-11.
 */
public class AggregateResult {
    List<Aggregate> aggregates = new ArrayList<>();
    String name;
    String display;
    long hits;

    public List<Aggregate> getChildren() {
        return aggregates;
    }

    public void setAggregates(List<Aggregate> aggregates) {
        this.aggregates = aggregates;
    }

    public String getValue() {
        return name;
    }

    public String getName() {
        return name;
    }

    public void setDisplay(String display) {
        this.display = display;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDisplay() {
        return display;
    }

    public void setValue(String value) {
        this.name = value;
    }

    public long getHits() {
        return hits;
    }

    public void setHits(long hits) {
        this.hits = hits;
    }
}
