define([], function() {
    function PaymentUpdateInfo(params, componentInfo) {
        var self = this;
        self.id = params.idField;


        self.paymentupdate = ko.observable();
        self.created=ko.observable();
        self.modified=ko.observable();
        self.authorizedPaymentdiffs= ko.observable();
        //self.description= ko.observable();
        var row;
        var cell1;
        var cell2;
        var table = document.getElementById("paytab");


        self.id.subscribe(function(newValue) {              //iD i back-end



            var url = baseUrl+"paymentandorapplicationupdate/"+newValue;
            ajax(url, 'GET').done(function (data) {
                for (var i = 0; i < data.length; i++) {
                    var k=i;
                    var j=0;
                   // self.authorizedPaymentdiffs(data[i].object.payment.authorizedPaymentDiffs)



                        self.paymentupdate(data[i].object)

                        var date= new Date(data[i].object.timestamp)


                    if(date.getMinutes().toString().length<2 || date.getHours().toString().length<2) {

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


                    else{

                        self.created(date.toDateString() + " " + date.getHours() + ":" + date.getMinutes())
                    }

                    date=new Date(data[i].object.modified)
                    if(date.getMinutes().toString().length<2 || date.getHours().toString().length<2) {

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


                    else{

                        self.modified(date.toDateString() + " " + date.getHours() + ":" + date.getMinutes())
                    }




                    for (var i = 0; i < data[k].object.payment.authorizedPaymentDiffs.length; i++) {



                         row= table.insertRow();
                         cell1=row.insertCell();
                         cell2=row.insertCell();
                        cell1.innerHTML="Item Description";
                        cell2.innerHTML=data[k].object.payment.authorizedPaymentDiffs[i].description;
                         row= table.insertRow();
                         cell1=row.insertCell();
                         cell2=row.insertCell();
                        cell1.innerHTML="ArticleNo";
                        cell2.innerHTML=data[k].object.payment.authorizedPaymentDiffs[i].articleNo;
                         row= table.insertRow();
                         cell1=row.insertCell();
                         cell2=row.insertCell();
                         cell3=row.insertCell();
                        cell1.innerHTML="Quantity";
                        cell2.innerHTML=data[k].object.payment.authorizedPaymentDiffs[i].quantity.quantity;
                        cell3.innerHTML= data[k].object.payment.authorizedPaymentDiffs[i].quantity.unit;
                        row= table.insertRow();
                         cell1=row.insertCell();
                         cell2=row.insertCell();
                        cell1.innerHTML="UnitAmountIncludingVat";
                        cell2.innerHTML=data[k].object.payment.authorizedPaymentDiffs[i].unitAmountIncludingVat;
                         row= table.insertRow();
                         cell1=row.insertCell();
                        cell2=row.insertCell();
                        cell1.innerHTML="VatRate";
                        cell2.innerHTML=data[k].object.payment.authorizedPaymentDiffs[i].vatRate;
                         row= table.insertRow();
                         cell1=row.insertCell();
                         cell2=row.insertCell();
                        cell1.innerHTML="TotalAmount";
                        cell2.innerHTML=data[k].object.payment.authorizedPaymentDiffs[i].totalAmount;
                        j=j+5;



                    }
                }
            });


        });




        return self;

    }
            return PaymentUpdateInfo;
        });