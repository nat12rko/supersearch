package com.resurs.supersearch.rest.resources;

import java.util.Map;

/**
 * Created by Trind on 2014-02-22.
 */
public class Hit {

    String type;
    java.util.Map<java.lang.String, java.lang.Object> object;


    public Map<String, Object> getObject() {
        return object;
    }

    public void setObject(Map<String, Object> object) {
        this.object = object;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
