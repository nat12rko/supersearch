define(['knockout'], function (ko) {
    function ProductRow(data) {
        var self = this;
        self.row = (data && data.row) || "none";

        self.totalAmountifNull=  function() {

            var totalamount = self.row.object.payment.authorization;


            if (totalamount === null) {
                return 0;

            }

            else{

                return self.row.object.payment.authorization.amountWithVat
            }
        }
        self.show = function(){
            showpayupdate(self.row.object);
        }
    }

    return ProductRow;
});