package com.resurs.supersearch.rest.configuration;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebConfiguration extends WebSecurityConfigurerAdapter {

    @Value("${ldap.url}")
    private String ldapUrl;
    @Value("${ldap.baseDN}")
    private String baseDN;

    @Value("${ldap.username}")
    private String username;
    @Value("${ldap.password}")
    private String password;


    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.httpBasic().authenticationEntryPoint(createCustomAuthenticationEntryPoint())
                .and()
                .cors().configurationSource(corsConfigurationSource()).and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                .and()
                .csrf().disable()
                .authorizeRequests().
                antMatchers("/ping").permitAll().
                anyRequest().authenticated();

    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.ldapAuthentication()
                .groupSearchBase("OU=Permission Groups,OU=Groups,OU=Banken,OU=Resurs Holding")
                .groupRoleAttribute("cn")
                .groupSearchFilter("(member={0})")
                .userSearchFilter("(samAccountName={0})")
                .contextSource()
                .managerDn(username)
                .managerPassword(password)
                .url(ldapUrl + baseDN);

    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT"));
        configuration.setMaxAge(1209600l);
        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(Arrays.asList("origin", "content-type", "accept", "authorization", "x-auth-token"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    CustomAuthenticationEntryPoint createCustomAuthenticationEntryPoint() {
        return new CustomAuthenticationEntryPoint();
    }

}
