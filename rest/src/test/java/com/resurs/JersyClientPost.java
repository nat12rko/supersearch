package com.resurs;


import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;

public class JersyClientPost {

    public static void main(String[] args) {

        try {

            Client client = Client.create();

            WebResource webResource = client
                    .resource("http://localhost:8080/rest/search");

            String input = "{\"searchString\":\"*\"}";

            long time = System.currentTimeMillis();
            ClientResponse response = webResource.type("application/json")
                    .post(ClientResponse.class, input);

            if (response.getStatus() != 201) {
                throw new RuntimeException("Failed : HTTP error code : "
                        + response.getStatus());
            }

            System.out.println("Output from Server .... \n");
            String output = response.getEntity(String.class).toString();
            System.out.println(output);
            System.out.println(System.currentTimeMillis() - time);

        } catch (Exception e) {

            e.printStackTrace();

        }

    }
}