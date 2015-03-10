define(['knockout'], function(ko) {
    function ProductRow(data) {
        var self = this;

        self.row = (data && data.row) || "none";

        self.isMultiupplys = function () {
            return (self.row.type == 'creditcase');
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
    }
    return ProductRow;
});