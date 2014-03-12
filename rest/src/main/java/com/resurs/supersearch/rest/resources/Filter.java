package com.resurs.supersearch.rest.resources;

/**
 * Created with IntelliJ IDEA.
 * User: joachim_a
 * Date: 2014-02-21
 * Time: 13:51
 * To change this template use File | Settings | File Templates.
 */
public class Filter {
    String field;
    String value;

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
