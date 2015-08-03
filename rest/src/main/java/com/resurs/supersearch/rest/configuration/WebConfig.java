package com.resurs.supersearch.rest.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.rcp.RemoteAuthenticationManager;
import org.springframework.security.authentication.rcp.RemoteAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration
@EnableWebSecurity
class WebConfig {

    /**
     * Configuration class for enabling Basic Auth for the back channel.
     */
    @Configuration
    @Order(1)
    @SuppressWarnings("PMD.SignatureDeclareThrowsException")
    public static class BackChannelWebSecurityConfigurerAdapter extends WebSecurityConfigurerAdapter {

        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http.
                    authorizeRequests().
                    antMatchers("/error").permitAll().
                    antMatchers("/test").permitAll().
                    antMatchers("/ping").permitAll().
                    antMatchers("/*").authenticated().and().
                    httpBasic().and().
                    sessionManagement().sessionCreationPolicy(SessionCreationPolicy.NEVER).and().
                    csrf().disable();
        }

        @Autowired
        @Qualifier("customAuthenticationProvider")
        private RemoteAuthenticationManager authenticationProvider;

        @SuppressWarnings("PMD.SignatureDeclareThrowsException")
        @Autowired
        public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
            RemoteAuthenticationProvider remoteAuthenticationProvider = new RemoteAuthenticationProvider();
            remoteAuthenticationProvider.setRemoteAuthenticationManager(authenticationProvider);
            auth.authenticationProvider(remoteAuthenticationProvider);

        }

    }
}
