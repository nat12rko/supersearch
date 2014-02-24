package com.resurs.supersearch.rest.impl;

import com.resurs.supersearch.rest.elasticsearch.SearchService;
import com.resurs.supersearch.rest.resources.Search;
import com.resurs.supersearch.rest.resources.SearchResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * Created with IntelliJ IDEA.
 * User: joachim_a
 * Date: 2014-02-21
 * Time: 13:43
 * To change this template use File | Settings | File Templates.
 */
@Component
@Path("/")
public class SearchServiceRest {

    @Autowired
    SearchService searchService;

    //private static final Logger logger = LoggerFactory.getLogger(SearchServiceImpl.class);

    @POST
    @Path("/search")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response search(Search search) {


        return Response.status(201).entity(searchService.search(search)).build();
    }

    @Path("/test")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response test() {
        return Response.status(201).entity(new SearchResult()).build();  //To change body of implemented methods use File | Settings | File Templates.
    }


    @Path("/test2")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Search test2() {
        return new Search();  //To change body of implemented methods use File | Settings | File Templates.
    }

}
