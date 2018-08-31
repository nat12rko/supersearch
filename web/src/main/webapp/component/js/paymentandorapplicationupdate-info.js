define([], function() {
    function PaymentUpdateInfo(params, componentInfo) {
        var self = this;
        self.id = params.idField;


        self.paymentupdate = ko.observable();
        self.created=ko.observable();
        self.modified=ko.observable();
        self.authorizedPaymentDiffs= ko.observableArray();
        self.debitedPaymentDiffs= ko.observableArray();
        self.annulledPaymentDiffs=ko.observableArray();
        self.paymentActions=ko.observableArray();
        self.creditedPaymentDiffs=ko.observableArray();
        self.authorization=ko.observable();
        self.paycreated=ko.observable();
        self.authcreated=ko.observable();
        self.country=ko.observable();
        self.application=ko.observable();
        var date;

        var k;


        self.id.subscribe(function(newValue) {



            var url = baseUrl+"paymentandorapplicationupdate/"+newValue;
            ajax(url, 'GET').done(function (data) {
                for (var i = 0; i < data.length; i++) {
                    k = i;


                    self.paymentupdate(data[i].object);
                    self.application("");


                    if(data[i].object.application!=null){
    self.application(data[i].object.application);
                    }



                    date = new Date(data[i].object.timestamp);


                    if (date.getMinutes().toString().length < 2 || date.getHours().toString().length < 2) {

                        if (date.getHours().toString().length < 2) {


                            if (date.getMinutes().toString().length < 2) {
                                self.created(date.toDateString() + "  0" + date.getHours() + ":0" + date.getMinutes())
                            }

                            else {
                                self.created(date.toDateString() + "  0" + date.getHours() + ":" + date.getMinutes())

                            }
                        }
                        else {

                            self.created(date.toDateString() + " " + date.getHours() + ":0" + date.getMinutes())

                        }


                    }


                    else {

                        self.created(date.toDateString() + " " + date.getHours() + ":" + date.getMinutes())
                    }

                    date = new Date(data[i].object.modified)
                    if (date.getMinutes().toString().length < 2 || date.getHours().toString().length < 2) {

                        if (date.getHours().toString().length < 2) {


                            if (date.getMinutes().toString().length < 2) {
                                self.modified(date.toDateString() + "  0" + date.getHours() + ":0" + date.getMinutes())
                            }

                            else {
                                self.modified(date.toDateString() + "  0" + date.getHours() + ":" + date.getMinutes())

                            }
                        }
                        else {

                            self.modified(date.toDateString() + " " + date.getHours() + ":0" + date.getMinutes())

                        }


                    }


                    else {

                        self.modified(date.toDateString() + " " + date.getHours() + ":" + date.getMinutes())
                    }


                    self.authorization("");


                    if (data[k].object.payment != null) {



                        if(data[k].object.payment.authorization!=null) {


                            if(data[k].object.payment.authorization.created!=null){
                                date = new Date(data[k].object.payment.authorization.created);


                                if (date.getMinutes().toString().length < 2 || date.getHours().toString().length < 2) {

                                    if (date.getHours().toString().length < 2) {


                                        if (date.getMinutes().toString().length < 2) {
                                            self.authcreated(date.toDateString() + "  0" + date.getHours() + ":0" + date.getMinutes())
                                        }

                                        else {
                                            self.authcreated(date.toDateString() + "  0" + date.getHours() + ":" + date.getMinutes())

                                        }
                                    }
                                    else {

                                        self.authcreated(date.toDateString() + " " + date.getHours() + ":0" + date.getMinutes())

                                    }


                                }


                                else {

                                    self.authcreated(date.toDateString() + " " + date.getHours() + ":" + date.getMinutes())
                                }

                            }

                            data[k].object.payment.authorization.created=self.authcreated;
                            self.authorization(data[k].object.payment.authorization);
                        }
                        if (data[k].object.payment.authorizedPaymentDiffs != null) {
                            self.authorizedPaymentDiffs.removeAll();
                            for (var i = 0; i < data[k].object.payment.authorizedPaymentDiffs.length; i++) {

                                    self.authorizedPaymentDiffs.push(data[k].object.payment.authorizedPaymentDiffs[i]);



                            }

                        }
                    else
                        {

                            self.authorizedPaymentDiffs.removeAll();
                        }

                        if (data[k].object.payment.debitedPaymentDiffs != null) {
                            self.debitedPaymentDiffs.removeAll();
                            for (var i = 0; i < data[k].object.payment.debitedPaymentDiffs.length; i++) {

                                    self.debitedPaymentDiffs.push(data[k].object.payment.debitedPaymentDiffs[i]);



                            }

                        }

                        else {

                            self.debitedPaymentDiffs.removeAll();
                        }

                        if (data[k].object.payment.annulledPaymentDiffs != null) {
                            self.annulledPaymentDiffs.removeAll();
                            for (var i = 0; i < data[k].object.payment.annulledPaymentDiffs.length; i++) {

                                    self.annulledPaymentDiffs.push(data[k].object.payment.annulledPaymentDiffs[i]);



                            }

                        }

                        else {

                            self.annulledPaymentDiffs.removeAll();
                        }
                        if (data[k].object.payment.creditedPaymentDiffs != null) {
                            self.creditedPaymentDiffs.removeAll();
                            for (var i = 0; i < data[k].object.payment.creditedPaymentDiffs.length; i++) {

                                    self.creditedPaymentDiffs.push(data[k].object.payment.creditedPaymentDiffs[i]);



                            }

                        }

                        else {

                            self.creditedPaymentDiffs.removeAll();
                        }

                        if (data[k].object.payment.paymentActions != null) {
                            self.paymentActions.removeAll();

                            for (var i = 0; i < data[k].object.payment.paymentActions.length; i++) {

                                if (data[k].object.payment.paymentActions[i].created != null) {

                                    date = new Date(data[k].object.payment.paymentActions[i].created)
                                    if (date.getMinutes().toString().length < 2 || date.getHours().toString().length < 2) {

                                        if (date.getHours().toString().length < 2) {


                                            if (date.getMinutes().toString().length < 2) {
                                                self.paycreated(date.toDateString() + "  0" + date.getHours() + ":0" + date.getMinutes())

                                            }

                                            else {
                                                self.paycreated(date.toDateString() + "  0" + date.getHours() + ":" + date.getMinutes())

                                            }
                                        }
                                        else {

                                            self.paycreated(date.toDateString() + " " + date.getHours() + ":0" + date.getMinutes())


                                        }


                                    }


                                    else {

                                        self.paycreated(date.toDateString() + " " + date.getHours() + ":" + date.getMinutes())

                                    }


                                }
                                data[k].object.payment.paymentActions[i].created=self.paycreated;
                                self.paymentActions.push(data[k].object.payment.paymentActions[i]);


                            }

                        }

                        else {

                            self.paymentActions.removeAll();
                        }




                    }

                    else {

                        self.authorizedPaymentDiffs.removeAll();
                        self.debitedPaymentDiffs.removeAll();
                        self.annulledPaymentDiffs.removeAll();
                        self.paymentActions.removeAll();
                        self.creditedPaymentDiffs.removeAll();
                    }




                }


            });


        });




        return self;

    }
            return PaymentUpdateInfo;
        });