package com.resurs.supersearch.rest.resources;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by joachim_a on 2014-03-11.
 */
public class Aggregate {

    String name;
    List<AggregateResult> aggregateResults = new ArrayList<>();

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<AggregateResult> getChildren() {
        return aggregateResults;
    }

    public void setAggregateResults(List<AggregateResult> aggregateResults) {
        this.aggregateResults = aggregateResults;
    }
}
