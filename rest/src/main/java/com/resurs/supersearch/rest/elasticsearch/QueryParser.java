package com.resurs.supersearch.rest.elasticsearch;

import com.resurs.commons.l10n.CountryCode;

import java.util.List;

/**
 * Created by Trind on 2014-02-22.
 */
public interface QueryParser {

    public String parseString(String query, List<CountryCode> countryCode);

}
