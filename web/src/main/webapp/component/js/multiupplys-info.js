define([], function() {
    function MultiUpplysInfo(params, componentInfo) {
        var self = this;
        self.id = params.idField;

        self.creditcase = ko.observable();
        self.customer = ko.observable();
        self.customerAddresses = ko.observable();
        self.executedFilters = ko.observableArray();
        self.ipAddress = ko.observable();

        self.id.subscribe(function(newValue) {
            self.creditcase();
            self.customer();
            self.customerAddresses();
            self.ipAddress();
            self.executedFilters.removeAll();

            var url = baseUrl+"multiupplys/"+newValue;
            ajax(url, 'GET').done(function (data) {
                for (var i = 0; i < data.length; i++) {
                    if(data[i].type == 'customer') {
                        self.customer(data[i].object);

                        data[i].object.customerAddresses.forEach(function(entry) {
                           var addressCredibility;
                            if(self.customerAddresses() && self.customerAddresses().addressSource) {
                                addressCredibility = self.customerAddresses().addressSource.addressCredibility;
                            }
                            if(!addressCredibility ||
                                entry.addressSource.addressCredibility  == 'CREDIT_BUREAU' ||
                                entry.addressSource.addressCredibility  == 'OWN_SYSTEM' &&
                                addressCredibility  !=  'CREDIT_BUREAU') {
                                self.customerAddresses(entry);
                            }
                        });
                    }else if(data[i].type == 'excecutedfilter'){
                        self.executedFilters.push(data[i].object);
                    }else if(data[i].type == 'creditcase'){
                        self.creditcase(data[i].object);
                        self.setIpAddress();
                    }
                }
            });
        });

        self.openHtmlPage = function(html) {
            showHtmlModal(html);
        }


        self.setIpAddress = function () {
            var ipString;
            if(self.creditcase().customerIP) {
                var ip = self.creditcase().customerIP.ipParts;

                for (var i = 0; i < ip.length; i++) {
                    if (ipString)
                        ipString = ipString + "." + ip[i];
                    else
                        ipString = ip[i];
                }
                self.ipAddress(ipString);

            }
        };

        return self;
    }
    return { createViewModel: MultiUpplysInfo };
});