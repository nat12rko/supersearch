package com.resurs.supersearch.rest.configuration;

import org.springframework.security.web.authentication.www.BasicAuthenticationEntryPoint;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


/**
 * Remove Basic Auth Form in Chrome And FireFox by adding header: "WWW-Authenticate"
 */
public class CustomAuthenticationEntryPoint extends BasicAuthenticationEntryPoint {

    public CustomAuthenticationEntryPoint() {
        this.setRealmName("SuperSearch");
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, org.springframework.security.core.AuthenticationException authException) throws IOException, ServletException {
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, authException.getMessage());
    }


}