define(['knockout'], function(ko) {
    function ProductRow(data) {
        var self = this;

        self.row = (data && data.row) || "none";

        self.isMultiupplys = function () {
            return (self.row.type == 'creditcase');     //Checking what type of object the query returns
        }
        self.isCreditRequest = function () {
            return (self.row.type == 'CreditRequest');
        }
        self.isLimit = function () {
            return (self.row.type == 'limitresponse');
        }
        self.isFraud = function () {
            return (self.row.type == 'FraudSummary');
        }
        self.isEcommerce = function () {
            return (self.row.type == 'payment');
        }
        self.isInvoice = function () {
            return (self.row.type == 'invoice');
        }

        self.isPaymentUpdate = function () {
            return (self.row.type == 'paymentupdate');

        }
    }
    return ProductRow;
});