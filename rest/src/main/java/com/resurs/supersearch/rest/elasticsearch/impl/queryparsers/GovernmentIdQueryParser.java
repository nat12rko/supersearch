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
    public String parseString(final String query, List<CountryCode> countryCodes) {

        final String workQuery = (query.startsWith("\"") && query.endsWith("\"")) ?
                query.substring(1, query.length() - 1) : query;

        if (countryCodes.size() == 0) {
            countryCodes.addAll(Arrays.asList(CountryCode.values()));
        }

        StringBuilder returnQuery = new StringBuilder("");
        for (CountryCode countryCode : countryCodes) {
            try {

                returnQuery.append(" \"" + GovernmentIdFactory.guessAndConstructGovernmentId(countryCode, workQuery).getAsLongString() + "\"");
                if (countryCode.equals(CountryCode.NO)) {
                    //Nasty fix for norweigen
                    returnQuery.append(" \"" +
                            GovernmentIdFactory.guessAndConstructGovernmentId(countryCode, workQuery).getAsLongString().substring(0,6)+"-" +
                            GovernmentIdFactory.guessAndConstructGovernmentId(countryCode, workQuery).getAsLongString().substring(6,11)+"\"");

                }

            } catch (Exception e) {

            }
        }

        if (StringUtils.isNotEmpty(returnQuery.toString())) {
            return "+(" + returnQuery.toString()+ "\")";
        }

        return query;
    }


}
