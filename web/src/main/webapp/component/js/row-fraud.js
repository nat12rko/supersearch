define(['knockout'], function(ko) {
    function ProductRow(data) {
        var self = this;
        self.row = (data && data.row) || "none";

        self.show = function(){
            showFraudModal(self.row.object);
        }

        self.openInFraud = function() {
            openFraud(self.row.object.externalReference);
        }
    }
    return ProductRow;
});