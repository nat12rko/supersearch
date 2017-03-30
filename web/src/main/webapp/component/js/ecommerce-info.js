define([], function () {
    function EcommerceInfo(params, componentInfo) {
        var self = this;

        if (params.mupIdField) {
            self.mupId = params.mupIdField;
        } else {
            self.mupId = ko.observable();
        }
        if (params.idField) {
            self.id = params.idField;
        } else {
            self.id = ko.observable();
        }

        if (params.fraudId) {
            self.fraudId = params.fraudId;
        } else {
            self.fraudId = ko.observable();
        }

        if (params.paymentField) {
            self.paymentField = params.paymentField;
        } else {
            self.paymentField = ko.observable();
        }
        self.payment = ko.observable();
        self.documents = ko.observableArray();

        self.paymentField.subscribe(function (newValue) {
            self.payment(newValue);
        });


        self.mupId.subscribe(function (newValue) {
            var url = baseUrl + "ecommerce?multiupplysId=" + newValue;
            ajax(url, 'GET').done(function (data) {
                if (data.length > 0) {
                    self.payment(data[0].object);
                } else {
                    self.payment(null);
                }
            });
        });

        self.fraudId.subscribe(function (newValue) {
            var url = baseUrl + "ecommerce?fraudId=" + newValue;
            ajax(url, 'GET').done(function (data) {
                if (data.length > 0) {
                    self.payment(data[0].object);
                } else {
                    self.payment(null);
                }
            });
        });

        self.getDocumentURL = function (documentName) {
            return baseUrl + "ecommerce/" + self.payment().representative.countryCode + "/" + self.payment().representative.name + "/" + self.payment().externalId + "/pdf/" + documentName;

        }

        self.canAnnulFullOrder = function () {
            return !self.payment().annulled && !self.payment().debited && !self.payment().credited;
        }
        self.annulPayment = function () {
            var confirm = window.confirm("Sure you want to annul Payment:"+self.payment().externalId);
            if(confirm) {
                var url = baseUrl + "ecommerce/" + self.payment().representative.countryCode + "/" + self.payment().representative.name + "/" + self.payment().externalId + "/annul";
                $.ajax({
                    url: url,
                    type: 'PUT',
                    success: function (result) {
                        alert("Payment annulled:"+self.payment().externalId);
                    }
                });
            }
        }

        self.resendDocument = function (documentName) {
            var email = window.prompt("Email", self.payment().email);
            var url = baseUrl + "ecommerce/" + self.payment().representative.countryCode + "/" + self.payment().representative.name + "/" + self.payment().externalId + "/send/" + documentName + "/" + email;
            if(email) {
                $.ajax({
                    url: url,
                    type: 'PUT',
                    success: function (result) {
                        alert("Mail Sent to:" + email);
                    }
                });
            }
        }
        self.payment.subscribe(function (newValue) {
            var url = baseUrl + "ecommerce/" + newValue.representative.countryCode + "/" + newValue.representative.name + "/" + newValue.externalId + "/invoiceNames";
            ajax(url, 'GET').done(function (data) {
                self.documents.removeAll();
                data.forEach(function (entry) {
                    self.documents.push(entry);
                });
            });


            if (newValue && newValue.totalValue) {
                self.totalValue(newValue.totalValue.withVat);
            }
            else {
                self.totalValue(0);
            }
            if (newValue && newValue.totalCreditValue) {
                self.totalCreditValue(newValue.totalCreditValue.withVat);
            } else {
                self.totalCreditValue(0);
            }
            if (newValue && newValue.totalFinalized) {
                self.totalFinalized(newValue.totalFinalized.withVat);
            } else {
                self.totalFinalized(0);
            }
            if (newValue && newValue.totalUnfinalized) {
                self.totalUnfinalized(newValue.totalUnfinalized.withVat);
            } else {
                self.totalUnfinalized(0);
            }

            extractSpecLines(newValue, self);
        });

        self.totalValue = ko.observable();
        self.totalCreditValue = ko.observable();
        self.totalFinalized = ko.observable();
        self.totalUnfinalized = ko.observable();


        self.auth = ko.observableArray();
        self.deb = ko.observableArray();
        self.cred = ko.observableArray();
        self.annul = ko.observableArray();

        self.addAnnul = function (line) {
            self.annul.push(line)
        }

        self.addCred = function (line) {
            self.cred.push(line)
        }

        self.addDeb = function (line) {
            self.deb.push(line)
        }

        self.addAuth = function (line) {
            self.auth.push(line)
        }

        self.reset = function () {
            self.auth.removeAll();
            self.deb.removeAll();
            self.cred.removeAll();
            self.annul.removeAll();
        }
        return self;
    }

    return EcommerceInfo;
});


function extractSpecLines(payment, model) {

    model.reset()

    if (payment) {
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

    return {
        "description": "Unspecified",
        "articleNo": "",
        "quantity": "",
        "unitAmountWithoutVat": spec.totalAmountWithoutVat,
        "unitMeasure": "",
        "vatPercentage": spec.vatPercentage,
        "sum": sum.toFixed(2)
    };
}
