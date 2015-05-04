package com.resurs.supersearch.rest.impl;

import com.resurs.supersearch.rest.elasticsearch.SearchService;
import com.resurs.supersearch.rest.resources.Search;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
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

    @Path("/multiupplys/{id}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMultiupplysById(@PathParam("id") String id) {
        return Response.status(201).entity(searchService.getMultiupplysById(id)).build();
    }

    @Path("/limit")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getLimitByMultiupplysId(@QueryParam("multiupplysId") String id) {
        return Response.status(201).entity(searchService.getLimitByMultiupplysId(id)).build();
    }

    @Path("/ecommerce")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEcommerceByIds(@QueryParam("multiupplysId") String mupId, @QueryParam("fraudId") String fraudId) {
        if (fraudId != null && fraudId.length() > 0) {
            return Response.status(201).entity(searchService.getEcommerceByFraudId(fraudId)).build();
        } else {
            return Response.status(201).entity(searchService.getEcommerceByMultiupplysId(mupId)).build();
        }
    }

    @Path("/ecommerce/{id}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEcommerceById(@PathParam("id") String id) {
        return Response.status(201).entity(searchService.getEcommerceByFraudId(id)).build();
    }


    @Path("/fraud")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFraudByMultiupplysId(@QueryParam("multiupplysId") String id) {
        return Response.status(201).entity(searchService.getFraudByMultiupplysId(id)).build();
    }


}
