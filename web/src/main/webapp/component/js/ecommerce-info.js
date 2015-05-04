define([], function() {
    function EcommerceInfo(params, componentInfo) {
        var self = this;

        if(params.mupIdField) {
            self.mupId = params.mupIdField;
        } else {
            self.mupId = ko.observable();
        }
        if(params.idField) {
            self.id = params.idField;
        } else {
            self.id = ko.observable();
        }

        if(params.fraudId) {
            self.fraudId = params.fraudId;
        } else {
            self.fraudId = ko.observable();
        }

        if(params.paymentField) {
            self.paymentField = params.paymentField;
        } else {
            self.paymentField = ko.observable();

        }
        self.payment = ko.observable();

        self.paymentField.subscribe(function(newValue) {
            self.payment(newValue);
        });

        self.mupId.subscribe(function(newValue) {
            var url = baseUrl+"ecommerce?multiupplysId="+newValue;
            ajax(url, 'GET').done(function (data) {
                if(data.length > 0) {
                    self.payment(data[0].object);
                } else {
                    self.payment(null);
                }
            });
        });

        self.fraudId.subscribe(function(newValue) {
            var url = baseUrl+"ecommerce?fraudId="+newValue;
            ajax(url, 'GET').done(function (data) {
                if(data.length > 0) {
                    self.payment(data[0].object);
                } else {
                    self.payment(null);
                }
            });
        });

        self.payment.subscribe(function(newValue) {
            self.totalValue(newValue.totalValue.withVat);
            self.totalCreditValue(newValue.totalCreditValue.withVat);
            self.totalFinalized(newValue.totalFinalized.withVat);
            self.totalUnfinalized(newValue.totalUnfinalized.withVat);
            extractSpecLines(newValue,self);
        });

        self.totalValue = ko.observable();
        self.totalCreditValue = ko.observable();
        self.totalFinalized = ko.observable();
        self.totalUnfinalized = ko.observable();


        self.auth = ko.observableArray();
        self.deb = ko.observableArray();
        self.cred = ko.observableArray();
        self.annul = ko.observableArray();

        self.addAnnul = function(line) {
            self.annul.push(line)
        }

        self.addCred = function(line) {
            self.cred.push(line)
        }

        self.addDeb = function(line) {
            self.deb.push(line)
        }

        self.addAuth = function(line){
            self.auth.push(line)}

        self.reset = function() {
            self.auth.removeAll();
            self.deb.removeAll();
            self.cred.removeAll();
            self.annul.removeAll();
        }



        return self;
    }
    return { createViewModel: EcommerceInfo };
});



function extractSpecLines(payment,model) {

    model.reset()

    var paymentDiffs = payment['paymentDiffs']
    for (pos in paymentDiffs) {
        var paymentSpec = paymentDiffs[pos]['paymentSpecification']

        if (paymentSpec.lines.length > 0) {
            for (var n in paymentSpec.lines) {
                var line = paymentSpec.lines[n]
                addLineSum(line);
                if (paymentDiffs[pos].type === "AUTHORIZE") {
                    model.addAuth(line);
                } else if (paymentDiffs[pos].type === "DEBIT") {
                    model.addDeb(line);
                } else if (paymentDiffs[pos].type === "ANNUL") {
                    model.addAnnul(line);
                } else if (paymentDiffs[pos].type === "CREDIT") {
                    model.addCred(line);
                }
            }
        } else {
            if (paymentDiffs[pos].type === "AUTHORIZE") {
                model.addAuth(createUnspecifiedLine(paymentSpec))
            } else if (paymentDiffs[pos].type === "DEBIT") {
                model.addDeb(createUnspecifiedLine(paymentSpec))
            } else if (paymentDiffs[pos].type === "ANNUL") {
                model.addAnnul(createUnspecifiedLine(paymentSpec))
            } else if (paymentDiffs[pos].type === "CREDIT") {
                model.addCred(createUnspecifiedLine(paymentSpec))
            }
        }
    }
}

function addLineSum(spec) {
    var vat = parseFloat('1.' + parseInt(spec.vatPercentage));
    var quantity = parseInt(spec.quantity);
    var priceExclVat = parseFloat(spec.unitAmountWithoutVat);

    var sum = quantity * priceExclVat * vat;
    spec.sum = sum.toFixed(2);
}

function createUnspecifiedLine(spec) {
    var priceExclVat = parseFloat(spec.unitAmountWithoutVat);
    var vat = parseFloat('1.' + parseInt(spec.vatPercentage));

    var sum = priceExclVat * vat;

    return {"description":"Unspecified",
        "articleNo":"",
        "quantity":"",
        "unitAmountWithoutVat":spec.totalAmountWithoutVat,
        "unitMeasure":"",
        "vatPercentage":spec.vatPercentage,
        "sum":sum.toFixed(2)};
}
