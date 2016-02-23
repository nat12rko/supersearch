define(['knockout'], function (ko) {
    function ProductRow(data) {
        var self = this;
        self.row = (data && data.row) || "none";


        self.ipAddress = ko.computed(function () {
            var ipString;
            var ip = self.row.object.customerIP.ipParts;

            for (var i = 0; i < ip.length; i++) {
                if (ipString)
                    ipString = ipString + "." + ip[i];
                else
                    ipString = ip[i];
            }
            return ipString;
        }, this);

        self.show = function(){
            showMupModal(self.row.object);
        }
    }

    return ProductRow;
});