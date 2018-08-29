define([], function() {
    function PaymentUpdateInfo(params, componentInfo) {
        var self = this;
        self.id = params.idField;


        self.paymentupdate = ko.observable();
        self.created=ko.observable();
        self.modified=ko.observable();
        self.authorizedPaymentdiffs= ko.observableArray();
        self.authorizedPaymentdiffs2= ko.observableArray();
        self.authorizedPaymentdiffs3=ko.observableArray();
        self.authorizedPaymentdiffs4=ko.observableArray();
        self.authorized=ko.observable();
        //self.description= ko.observable();
        var row;
        var date;
        var cell1;
        var cell2;
        var cell3;
        var table = document.getElementById("paytab");
        var k;


        self.id.subscribe(function(newValue) {              //iD i back-end



            var url = baseUrl+"paymentandorapplicationupdate/"+newValue;
            ajax(url, 'GET').done(function (data) {
                for (var i = 0; i < data.length; i++) {
                    k = i;


                    self.paymentupdate(data[i].object);
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


                    if (data[k].object.payment != null) {
                        if (data[i].object.payment.authorizedPaymentDiffs != null) {
                            self.authorizedPaymentdiffs.removeAll();
                            for (var i = 0; i < data[k].object.payment.authorizedPaymentDiffs.length; i++) {
                                if (data[k].object.payment.authorizedPaymentDiffs[i] != null) {
                                    self.authorizedPaymentdiffs.push(data[k].object.payment.authorizedPaymentDiffs[i]);


                                }
                            }

                        }
                    else
                        {

                            self.authorizedPaymentdiffs.removeAll();
                        }

                        if (data[k].object.payment.debitedPaymentDiffs != null) {
                            self.authorizedPaymentdiffs2.removeAll();
                            for (var i = 0; i < data[k].object.payment.debitedPaymentDiffs.length; i++) {
                                if (data[k].object.payment.debitedPaymentDiffs[i] != null) {
                                    self.authorizedPaymentdiffs2.push(data[k].object.payment.debitedPaymentDiffs[i]);


                                }
                            }

                        }

                        else {

                            self.authorizedPaymentdiffs2.removeAll();
                        }

                        if (data[k].object.payment.annulledPaymentDiffs != null) {
                            self.authorizedPaymentdiffs3.removeAll();
                            for (var i = 0; i < data[k].object.payment.annulledPaymentDiffs.length; i++) {
                                if (data[k].object.payment.annulledPaymentDiffs[i] != null) {
                                    self.authorizedPaymentdiffs3.push(data[k].object.payment.annulledPaymentDiffs[i]);


                                }
                            }

                        }

                        else {

                            self.authorizedPaymentdiffs3.removeAll();
                        }

                        if (data[k].object.payment.paymentActions != null) {
                            self.authorizedPaymentdiffs4.removeAll();
                            for (var i = 0; i < data[k].object.payment.paymentActions.length; i++) {
                                if (data[k].object.payment.paymentActions[i] != null) {
                                    self.authorizedPaymentdiffs4.push(data[k].object.payment.paymentActions[i]);


                                }
                            }

                        }

                        else {

                            self.authorizedPaymentdiffs4.removeAll();
                        }


                    }

                    else {

                        self.authorizedPaymentdiffs.removeAll();
                        self.authorizedPaymentdiffs2.removeAll();
                        self.authorizedPaymentdiffs3.removeAll();
                        self.authorizedPaymentdiffs4.removeAll();
                    }


                    /*

                    if(data[k].object.payment!=null && data[k].object.payment.authorizedPaymentDiffs !=null) {
                                            if(table.rows.length>= 0) {
                                                for (var i = table.rows.length - 1; i > 0; i--) {
                                                    table.deleteRow(i);
                                                }
                                            }
                        for (var i = 0; i < data[k].object.payment.authorizedPaymentDiffs.length; i++) {


                            row = table.insertRow();
                            cell1 = row.insertCell();
                            cell2 = row.insertCell();
                            cell1.innerHTML = "Item Description";
                            cell2.innerHTML = data[k].object.payment.authorizedPaymentDiffs[i].description;
                            row = table.insertRow();
                            cell1 = row.insertCell();
                            cell2 = row.insertCell();
                            cell1.innerHTML = "ArticleNo";
                            cell2.innerHTML = data[k].object.payment.authorizedPaymentDiffs[i].articleNo;
                            row = table.insertRow();
                            cell1 = row.insertCell();
                            cell2 = row.insertCell();
                            cell3 = row.insertCell();
                            cell1.innerHTML = "Quantity";
                            cell2.innerHTML = data[k].object.payment.authorizedPaymentDiffs[i].quantity.quantity;
                            cell3.innerHTML = data[k].object.payment.authorizedPaymentDiffs[i].quantity.unit;
                            row = table.insertRow();
                            cell1 = row.insertCell();
                            cell2 = row.insertCell();
                            cell1.innerHTML = "UnitAmountIncludingVat";
                            cell2.innerHTML = data[k].object.payment.authorizedPaymentDiffs[i].unitAmountIncludingVat;
                            row = table.insertRow();
                            cell1 = row.insertCell();
                            cell2 = row.insertCell();
                            cell1.innerHTML = "VatRate";
                            cell2.innerHTML = data[k].object.payment.authorizedPaymentDiffs[i].vatRate;
                            row = table.insertRow();
                            cell1 = row.insertCell();
                            cell2 = row.insertCell();
                            cell1.innerHTML = "TotalAmount";
                            cell2.innerHTML = data[k].object.payment.authorizedPaymentDiffs[i].totalAmount;



                        }
                    }

                    else{

                        if(table.rows.length>= 0) {
                            for (var i = table.rows.length - 1; i > 0; i--) {
                                table.deleteRow(i);
                            }
                        }
                    }
                    */

                }


            });


        });




        return self;

    }
            return PaymentUpdateInfo;
        });