package com.resurs.supersearch.rest.configuration;

import com.resurs.ecommerce.rest.client.EcommerceAfterShopFlowService;
import com.resurs.ecommerce.rest.client.EcommerceBackendService;
import com.resurs.ecommerce.rest.client.EcommercePaymentMethodFeeService;
import com.resurs.ecommerce.rest.client.EcommerceShopFlowService;
import com.resurs.ecommerce.rest.client.PaymentMethodService;
import com.resurs.ecommerce.rest.client.impl.EcommerceAfterShopFlowServiceImpl;
import com.resurs.ecommerce.rest.client.impl.EcommerceBackendRestServiceImpl;
import com.resurs.ecommerce.rest.client.impl.EcommercePaymentMethodFeeeServiceImpl;
import com.resurs.ecommerce.rest.client.impl.EcommerceShopFlowServiceImpl;
import com.resurs.ecommerce.rest.client.impl.PaymentMethodServiceImpl;
import org.glassfish.jersey.jackson.JacksonFeature;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
////////TEST
@Configuration
public class EcommerceBackendServiceConfig {

    @Value("${ecommerce.rest.username}")
    private String username;

    @Value("${ecommerce.rest.password}")
    private String password;

    @Value("${ecommerce.rest.url}")
    private String contextPath;

    @Bean(name = "EcommerceBackendServiceConfig")
    public EcommerceBackendService get() {
        return new EcommerceBackendRestServiceImpl(contextPath, username, password, JacksonFeature.class);
    }

    @Bean()
    public EcommerceAfterShopFlowService getEcommerceAfterShopFlowService() {
        return new
                EcommerceAfterShopFlowServiceImpl(contextPath, username, password, JacksonFeature.class);
    }


    @Bean
    public EcommercePaymentMethodFeeService createEcommercePaymentMethodFeeService() {
        return new EcommercePaymentMethodFeeeServiceImpl(contextPath, username, password, JacksonFeature.class);
    }

    @Bean
    public PaymentMethodService createPaymentMethodService() {
        return new PaymentMethodServiceImpl();
    }

    @Bean
    public EcommerceShopFlowService createEcommerceShopFlowService() {
        return new EcommerceShopFlowServiceImpl(contextPath, username, password, JacksonFeature.class);
    }
}
