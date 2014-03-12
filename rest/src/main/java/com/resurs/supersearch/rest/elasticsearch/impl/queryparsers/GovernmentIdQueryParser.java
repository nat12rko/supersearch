package com.resurs.supersearch.rest.elasticsearch.impl.queryparsers;

import com.resurs.commons.l10n.CountryCode;
import com.resurs.commons.model.governmentid.GovernmentIdFactory;
import com.resurs.supersearch.rest.elasticsearch.QueryParser;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

/**
 * Created by joachim_a on 2014-03-10.
 */
@Service
public class GovernmentIdQueryParser implements QueryParser {
    @Override
    public String parseString(String query, List<CountryCode> countryCodes) {

        if (countryCodes.size() == 0) {
            countryCodes.addAll(Arrays.asList(CountryCode.values()));
        }

        StringBuilder returnQuery = new StringBuilder("");
        for (CountryCode countryCode : countryCodes) {
            try {
                returnQuery.append(" \"" + GovernmentIdFactory.guessAndConstructGovernmentId(countryCode, query).getAsLongString()+"\"");
            } catch (Exception e) {

            }
        }

        if (StringUtils.isNotEmpty(returnQuery.toString())) {
            return "+(" + returnQuery.toString() + ")";
        }

        return query;
    }


}
