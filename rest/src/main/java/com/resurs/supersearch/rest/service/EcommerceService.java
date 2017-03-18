package com.resurs.supersearch.rest.service;

import com.resurs.commons.l10n.CountryCode;
import com.resurs.ecommerce.rest.client.EcommerceAfterShopFlowService;
import com.resurs.ecommerce.rest.client.EcommerceResponse;
import com.resurs.ecommerce.rest.model.request.AnnulPaymentRequest;
import com.resurs.ecommerce.rest.model.request.PaymentSpecification;
import com.resurs.ecommerce.rest.model.response.Payment;
import com.resurs.ecommerce.rest.model.response.aftershopflow.Pdf;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class EcommerceService {

    @Autowired
    private EcommerceAfterShopFlowService ecommerceAfterShopFlowService;

    public void annulPayment(CountryCode countryCode, String representative, String externalId) {
        Payment payment = ecommerceAfterShopFlowService.getPayment(countryCode, representative, externalId).getObject();

        PaymentSpecification paymentSpecification = new PaymentSpecification();
        paymentSpecification.setTotalAmount(payment.getTotalAmount());

        AnnulPaymentRequest annulPaymentRequest = new AnnulPaymentRequest();
        annulPaymentRequest.setCreatedBy(getUser());
        annulPaymentRequest.setPaymentSpecification(paymentSpecification);
        ecommerceAfterShopFlowService.annul(countryCode, representative, externalId, annulPaymentRequest);
    }

    public void sendInvoice(CountryCode countryCode, String representative, String externalId, String documentName, String email) {
        ecommerceAfterShopFlowService.sendPaymentDocument(countryCode, representative, externalId, documentName, email);
    }

    public List<String> getInvoiceNames(CountryCode countryCode, String representative, String externalId) {
        EcommerceResponse<List<String>> documentNames = ecommerceAfterShopFlowService.getDocumentNames(countryCode, representative, externalId);
        return documentNames.getObject();
    }

    public byte[] getInvoice(CountryCode countryCode, String representative, String externalId, String documentName) {
        EcommerceResponse<Pdf> paymentDocument = ecommerceAfterShopFlowService.getPaymentDocument(countryCode, representative, externalId, documentName);
        return paymentDocument.getObject().getPdf();
    }

    public String getUser() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
