define(['knockout'], function(ko) {
    function ProductRow(data) {
        var self = this;
        self.row = (data && data.row) || "none";

        self.show = function(){
            showPaymentModal(self.row.object);
        }

        self.viewInvoices = function() {
            var paymentDiffs = self.row.object.paymentDiffs;
            for (var index in paymentDiffs) {
                if (paymentDiffs[index].type === 'DEBIT' || paymentDiffs[index].type === 'CREDIT') {
                    viewInvoices(paymentDiffs[index].invoiceId);
                }
            }
        }
    }


    return ProductRow;
});