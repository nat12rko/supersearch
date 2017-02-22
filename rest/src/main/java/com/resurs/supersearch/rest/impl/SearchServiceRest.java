package com.resurs.supersearch.rest.impl;

import com.resurs.supersearch.rest.elasticsearch.SearchService;
import com.resurs.supersearch.rest.model.User;
import com.resurs.supersearch.rest.resources.Hit;
import com.resurs.supersearch.rest.resources.Search;
import com.resurs.supersearch.rest.resources.SearchResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

@RestController
@RequestMapping
@CrossOrigin
@PreAuthorize("hasAuthority('ROLE_SEC-SUPERSEARCH-ADMIN')")
public class SearchServiceRest {

    @Autowired
    private SearchService searchService;

    @RequestMapping(value = "/search", method = RequestMethod.POST)
    public SearchResult search(@RequestBody Search search) {
        return searchService.search(search);
    }

    @RequestMapping(method = RequestMethod.GET, value = "/multiupplys/{id}")
    public List<Hit> getMultiupplysById(@PathVariable("id") String id) {
        return searchService.getMultiupplysById(id);
    }

    @RequestMapping(method = RequestMethod.GET, value = "/limit")
    public List<Hit> getLimitByMultiupplysId(@RequestParam("multiupplysId") String id) {
        return searchService.getLimitByMultiupplysId(id);
    }

    @RequestMapping(method = RequestMethod.GET, value = "/ecommerce")
    public List<Hit> getEcommerceByIds(@RequestParam("multiupplysId") String mupId, @RequestParam("fraudId") String fraudId) {
        if (fraudId != null && fraudId.length() > 0) {
            return searchService.getEcommerceByFraudId(fraudId);
        } else {
            return searchService.getEcommerceByMultiupplysId(mupId);
        }
    }

    @RequestMapping(method = RequestMethod.GET, value = "/ecommerce/{id}")
    public List<Hit> getEcommerceById(@PathVariable("id") String id) {
        return searchService.getEcommerceByFraudId(id);
    }


    @RequestMapping(method = RequestMethod.GET, value = "/fraud")
    public List<Hit> getFraudByMultiupplysId(@RequestParam("multiupplysId") String id) {
        return searchService.getFraudByMultiupplysId(id);
    }


    @RequestMapping(method = RequestMethod.GET, value = "/ping")
    @PreAuthorize("isAnonymous()")
    public String ping() {
        return "pong";
    }

    @RequestMapping(method = RequestMethod.GET, value = "/login")
    @ResponseBody
    public User loggedIn(Authentication authentication) {
        return new User(authentication.getName());
    }

    @RequestMapping(method = RequestMethod.GET, value = "/logout")
    public void logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
    }


}
