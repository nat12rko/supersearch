package com.resurs.supersearch.rest.configuration;

import org.apache.commons.lang.StringUtils;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.rcp.RemoteAuthenticationException;
import org.springframework.security.authentication.rcp.RemoteAuthenticationManager;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Collections;

@Component(value = "customAuthenticationProvider")
public class CustomAuthenticationProvider implements RemoteAuthenticationManager {

    @Override
    public Collection<? extends GrantedAuthority> attemptAuthentication(String username, String password) throws RemoteAuthenticationException {
        //TODO AD

        if (StringUtils.isBlank(username) || username.equals("undefined")) {
            throw new BadCredentialsException("Wrong password");
        }
        return Collections.emptySet();
    }
}
