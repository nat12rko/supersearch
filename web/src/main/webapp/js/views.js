function SearchViewWidgetsModel() {
    var self = this;

    self.searchTime = ko.observableArray();
    self.amountHits = ko.observableArray();
    self.amountPages = ko.observableArray();
    self.searchQueries = ko.observableArray();
    self.filters = ko.observableArray();

    self.loadThis = function () {
        searchViewModel.updateObject(this.searchString(), this.fromDate(), this.toDate(), this.page(), this.pageSize(), this.systems(), this.countryCodes(), this.filters());
    }
}


function SearchViewModel() {
    var self = this;
    self.searchString = ko.observable();
    self.fromDate = ko.observable();
    self.toDate = ko.observable();
    self.page = ko.observable(0);
    self.pageSize = ko.observable(25);
    self.filters = ko.observableArray();
    self.searchDate = ko.observable();

    self.availableSystems = ko.observableArray([
        {text: 'Ehandel', id: 'ECOMMERCE'},
        {text: 'Bedrägeri', id: 'FRAUD'},
        {text: 'Limit', id: 'LIMIT'},
        {text: 'Multiupplys', id: 'MULTIUPPLYS'}
    ]);


    self.removeFilter = function () {
        self.filters.remove(this);
        resultViewModel.search();

    }

    self.addFilter = function (name, value) {
        var exists = false;
        ko.utils.arrayForEach(self.filters(), function (feature) {
            if (feature.field === name && feature.value === value) {
                exists = true;
            }
        });

        if (!exists) {
            var filter = {field: name, value: value};
            searchViewModel.filters.push(filter);
            searchViewModel.search();
        }
    }


    self.systems = ko.observableArray(['ECOMMERCE', 'FRAUD', 'LIMIT', 'MULTIUPPLYS']);

    self.availableCountries = ko.observableArray([
        {text: 'Sverige', id: 'SE'},
        {text: 'Finland', id: 'FI'},
        {text: 'Norge', id: 'NO'},
        {text: 'Danmark', id: 'DK'}
    ]);
    self.countryCodes = ko.observableArray(['SE', 'DK', 'NO', 'FI']);

    self.setPage = function (value) {
        self.page(value);
        resultViewModel.search();
    }
    self.search = function () {
        resultViewModel.search();
    }

    self.updateObject = function (valuesearchString, valuefromDate, valuetoDate, valuepage, valuepageSize, valuesystems, valuecountryCodes, valuefilters) {
        self.searchString(valuesearchString);
        self.fromDate(valuefromDate);
        self.toDate(valuetoDate);
        self.page(valuepage);
        self.pageSize(valuepageSize);
        self.systems(valuesystems);
        self.countryCodes(valuecountryCodes);
        self.filters(valuefilters)
        resultViewModel.search()

    }

    self.searchWithValue = function (value) {
        searchViewModel.page(0);
        self.searchString("\"" + value + "\"");
        resultViewModel.search()
    }

    /*    self.countryCodes.subscribe(function (newValue) {
     resultViewModel.search();
     });

     self.systems.subscribe(function (newValue) {
     resultViewModel.search();

     });

     self.fromDate.subscribe(function (newValue) {
     resultViewModel.search();

     });

     self.toDate.subscribe(function (newValue) {
     resultViewModel.search();

     });*/


}

function ResultViewModel() {
    var self = this;
    self.tasksURI = "http://supersearch.pte.loc/rest/search";
    //self.tasksURI = "http://localhost:8080/rest/search";

    self.hits = ko.observableArray();

    self.colorFadeIn = function (element, index, data) {

        $(element).filter("tr").children('td').remove();

        if ($(element).is("tr")) {
            objectToView(data, element)
        }

    };

    self.ajax = function (uri, method, data) {
        var request = {
            type: method,
            url: uri,
            contentType: "application/json",
            data: data,
            beforeSend: function () {
            },
            complete: function () {
            },
            success: function (data) {
            },
            error: function (data) {
                alert("ajax error" + data);
            },
            dataType: 'json'
        };
        return $.ajax(request);
    }

    self.search = function () {
        searchViewModel.searchDate = new Date().customFormat('#YYYY#-#MM#-#DD# #hh#:#mm#:#ss#');


        var jsonData = ko.toJSON(searchViewModel);
        if (!jsonData) {
            jsonData = formToJSON();
        }


        self.ajax(self.tasksURI, 'POST', jsonData).done(function (data) {

            updateAggregation(data.aggregates[0]);
            updateFacets(data.aggregates);

            self.hits.removeAll();
            for (var i = 0; i < data.hits.length; i++) {
                self.hits.push(data.hits[i]);
            }


            var pages = Math.ceil(data.totalSize / searchViewModel.pageSize());
            if (searchViewModel.page() > (pages - 1)) {
                searchViewModel.page(0);
            }
            searchViewWidgetsModel.searchQueries.unshift(ko.mapping.fromJS(ko.mapping.toJS(searchViewModel)));
            if (searchViewWidgetsModel.searchQueries().length > 10) {
                searchViewWidgetsModel.searchQueries(searchViewWidgetsModel.searchQueries.splice(0, 10));
            }


            searchViewWidgetsModel.amountHits(data.totalSize);
            searchViewWidgetsModel.searchTime(data.searchTime);
            searchViewWidgetsModel.amountPages(pages);


            options = {
                numberOfPages: pages > 10 ? 10 : pages,
                bootstrapMajorVersion: 3,
                currentPage: searchViewModel.page() + 1,
                totalPages: pages
            }
            $('#paginatorbuttom').bootstrapPaginator(options);
            $('#paginatortop').bootstrapPaginator(options);


        });

    }
    self.search();
}

function SpecLineModel() {
    var self = this;
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
}

function objectToView(ob, element) {
    if (ob.type === "creditcase") {
        createMultiupplysRow(element, ob);
    }
    else if (ob.type === "limitresponse") {
        createLimitRow(element, ob);
    }
    else if (ob.type === "payment") {
        createEcommerceRow(element, ob);
    }
    else if (ob.type === "FraudSummary") {
        createFraudRow(element, ob);
    }
    return ob;
}

function createMultiupplysRow(element, ob) {

    var ip = getJsonValue(ob, 'object.customerIP.ipParts');
    var ipString;


    for(var i=0; i<ip.length; i++)  {
        if(ipString)
            ipString = ipString + "."+ ip[i];
        else
        ipString = ip[i];
    }

    $(element).removeClass().addClass("multiupplys")
    $(element).append("<td>Multiupplys</td>")
    $(element).append("<td>" + createClickableObjectForSearch(getJsonValue(ob, 'object.publicReferenceNumber')) + "</td>")

    $(element).append("<td colspan='9'>" +

        "<table width='100%'><tr>" +
        "<td width=\"20%\">Pers/Org -nr: " + createClickableObjectForSearch(getJsonValue(ob, 'object.application.applicant.governmentId.value')) + "</td>" +
        "<td width=\"20%\">Skapad: " + new Date(getJsonValue(ob, 'object.created')).customFormat('#YYYY#-#MM#-#DD# #hh#:#mm#:#ss#') + "  </td>" +
        "<td width=\"20%\">Ombudskod: " + createClickableObjectForSearch(getJsonValue(ob, 'object.creditCaseTags.BANKSYSTEM_REPRESENTATIVE_CODE')) + " </td> " +
        "<td width=\"20%\">Belopp (beviljat/sökt): " + getJsonValue(ob, 'object.currentState.amount') + "/" + getJsonValue(ob, 'object.application.amount') + " </td> " +
        "<td width=\"20%\">Status: " + createClickableObjectForSearch(getJsonValue(ob, 'object.currentState.state')) + "</td>  " +
        "<tr>"+
        "<td width=\"20%\">Ipnummer: " + ipString+ "</td>  " +
        "</tr>"+
        "</tr></table>" +
        "</td>")
}

function createFraudRow(element, ob) {
    $(element).removeClass().addClass("fraud")
    $(element).append("<td>Bedrägeri</td>")
    $(element).append("<td>" + createClickableObjectForSearch(getJsonValue(ob, 'object.id')) + "</td>")

    $(element).append("<td colspan='9'>" +
        "<table width='100%'><tr>" +
        "<td width=\"20%\">Pers/Org -nr: " + createClickableObjectForSearch(getJsonValue(ob, 'object.controlRequestJson.customer.governmentId')) + "</td>" +
        "<td width=\"20%\">Skapad: " + new Date(getJsonValue(ob, 'object.timestamp')).customFormat('#YYYY#-#MM#-#DD# #hh#:#mm#:#ss#') + "  </td>" +
        "<td width=\"20%\">MupReference: " + createClickableObjectForSearch(getJsonValue(ob, 'object.controlRequestJson.ids.MUP_ID')) + " </td> " +
        "<td width=\"20%\">BedrägerId: " + createClickableObjectForSearch(getJsonValue(ob, 'object.controlRequestJson.ids.LIMITBOX_ID')) + " </td> " +
        "<td width=\"20%\">Status: " + createClickableObjectForSearch(getJsonValue(ob, 'object.recommendation')) + "</td>  " +
        "</tr>" +
        "<tr>"+
        "<td width=\"20%\">Ipnummer: " + getJsonValue(ob, 'object.controlRequestJson.ipAddress')+ "</td>  " +
        "<td width=\"20%\">Namn: " + getJsonValue(ob, 'object.controlRequestJson.billingAddress.firstName')+ " " +  getJsonValue(ob, 'object.controlRequestJson.billingAddress.lastName')+ "</td>  " +
        "<td width=\"20%\">E-Post: " + getJsonValue(ob, 'object.controlRequestJson.emails.email')+"</td>  " +
        "<td width=\"20%\">Extern reference: " + createClickableObjectForSearch(getJsonValue(ob, 'object.controlRequestJson.ids.ECOMMERCE_EXTERNAL_ID'))+"</td>  " +

        "</tr>"+
        "</table>" +
        "</td>")
}

function getJsonValue(ob, field) {
    var fields = field.split(".");
    var useOb = ob;
    for (var i = 0; i < fields.length; i++) {
        if (useOb) {
            useOb = useOb[fields[i]];
        } else {
            return "";
        }
    }
    return useOb;
}

// Ugly
var payment;

function createEcommerceRow(element, ob) {

    $(element).removeClass().addClass("ecommerce")
    $(element).append("<td>Ehandel <br> " + getJsonValue(ob, 'object.representative.name'))
    $(element).append("<td>" + createClickableObjectForSearch(getJsonValue(ob, 'object.externalId')) + "<br><br>Pers/org:<br>" +
    createClickableObjectForSearch(getJsonValue(ob, 'object.customer.governmentId')) + "</td>")

    $(element).append("<td colspan='3'>" +
        "<table width='100%'><tr>" +
            "<td width=\"14.2%\">Namn: " + createClickableObjectForSearch(getJsonValue(ob, 'object.billingAddress.fullName')) + "</td>" +
            "<td width=\"14.2%\">Skapad: " + new Date(getJsonValue(ob, 'object.created')).customFormat('#YYYY#-#MM#-#DD# #hh#:#mm#:#ss#') + "  </td>" +
            "<td width=\"14.2%\">Debiterad: " + getJsonValue(ob, 'object.debited') + " </td> " +
        "</tr>" +
        "<tr>" +
            "<td width=\"14.2%\">Telefon: " + createClickableObjectForSearch(getJsonValue(ob, 'object.billingAddress.phone1')) + "</td>" +
            "<td width=\"14.2%\">Status: " + createClickableObjectForSearch(getJsonValue(ob, 'object.lifePhase')) + "</td>  " +
            "<td width=\"14.2%\">Krediterad: " + getJsonValue(ob, 'object.credited') + " </td> " +
        "</tr>" +
        "<tr>" +
            "<td width=\"14.2%\">Gata: " + createClickableObjectForSearch(getJsonValue(ob, 'object.billingAddress.street')) + "</td>" +
            "<td width=\"14.2%\">IP: " + createClickableObjectForSearch(getJsonValue(ob, 'object.ip')) + "</td>" +
            "<td width=\"14.2%\">Anullerad: " + getJsonValue(ob, 'object.annulled') + " </td> " +
        "</tr>" +
        "<tr>" +
            "<td width=\"14.2%\">Stad: " + createClickableObjectForSearch(getJsonValue(ob, 'object.billingAddress.city')) + "</td>" +
            "<td width=\"14.2%\">Signerad: " + createClickableObjectForSearch(getJsonValue(ob, 'object.signed')) + "</td>" +
            "<td width=\"14.2%\">Krediterbar: " + getJsonValue(ob, 'object.creditable') + " </td> " +
        "</tr>" +
        "<tr>" +
            "<td width=\"14.2%\">Epost: " + createClickableObjectForSearch(getJsonValue(ob, 'object.billingAddress.email')) + "</td>" +
            "<td width=\"14.2%\">Betalmetod: " + createClickableObjectForSearch(getJsonValue(ob, 'object.paymentMethod.name')) + "</td>" +
            "<td width=\"14.2%\">Debiterbar: " + getJsonValue(ob, 'object.debitable') + " </td> " +
        "</tr>" +
        "</table>" +
        "</td>")

    $(element).dblclick(
        function() {
            payment = ob.object
            $('#paymentModal').modal()
     })
    $(element).data("payment", "test")


}

$('#paymentModal').on('show.bs.modal', function (event) {
    extractSpecLines(payment)

    var modal = $(this)
    modal.find('.modal-title').text("Payment Id: " + payment.externalId)

    modal.find('.payment-total').text(payment.totalValue.withVat)
    modal.find('.payment-credited').text(payment.totalCreditValue.withVat)
    modal.find('.payment-finalized').text(payment.totalFinalized.withVat)
    modal.find('.payment-unfinalized').text(payment.totalUnfinalized.withVat)
})

function extractSpecLines(payment) {

    specLineModel.reset()

    var paymentDiffs = payment['paymentDiffs']
    for (pos in paymentDiffs) {
        var paymentSpec = paymentDiffs[pos]['paymentSpecification']

        if (paymentSpec.lines.length > 0) {
            for (var n in paymentSpec.lines) {
                var line = paymentSpec.lines[n]
                if (paymentDiffs[pos].type === "AUTHORIZE") {
                    specLineModel.addAuth(line)
                } else if (paymentDiffs[pos].type === "DEBIT") {
                    specLineModel.addDeb(line)
                } else if (paymentDiffs[pos].type === "ANNUL") {
                    specLineModel.addAnnul(line)
                } else if (paymentDiffs[pos].type === "CREDIT") {
                    specLineModel.addCred(line)
                }
            }
        } else {
            if (paymentDiffs[pos].type === "AUTHORIZE") {
                specLineModel.addAuth(createUnspecifiedLine(paymentSpec))
            } else if (paymentDiffs[pos].type === "DEBIT") {
                specLineModel.addDeb(createUnspecifiedLine(paymentSpec))
            } else if (paymentDiffs[pos].type === "ANNUL") {
                specLineModel.addAnnul(createUnspecifiedLine(paymentSpec))
            } else if (paymentDiffs[pos].type === "CREDIT") {
                specLineModel.addCred(createUnspecifiedLine(paymentSpec))
            }
        }
    }
}

function createUnspecifiedLine(spec) {
    return {"description":"Unspecified",
        "articleNo":"",
        "quantity":"",
        "unitAmountWithoutVat":spec.totalAmountWithoutVat,
        "unitMeasure":"",
        "vatPercentage":spec.vatPercentage};

}

function createLimitRow(element, ob) {
    $(element).removeClass().addClass("limit")
    $(element).append("<td>Limit</td>")
    $(element).append("<td>" + createClickableObjectForSearch(getJsonValue(ob, 'object.reservationId')) + "</td>")


    $(element).append("<td colspan='9'>" +

        "<table width='100%'><tr>" +
        "<td width=\"20%\">Pers/Org -nr: " + createClickableObjectForSearch(getJsonValue(ob, 'object.application.applicant.governmentId.value')) + "</td>" +
        "<td width=\"20%\">Skapad: " + new Date(getJsonValue(ob, 'object.timestamp')).customFormat('#YYYY#-#MM#-#DD# #hh#:#mm#:#ss#') + "  </td>" +
        "<td width=\"20%\">MupReference: " + createClickableObjectForSearch(getJsonValue(ob, 'object.mupRefNumber')) + " </td> " +

        "<td width=\"20%\">Belopp (beviljat/sökt): " + getJsonValue(ob, 'object.approvedAmount') + "/" + getJsonValue(ob, 'object.requestedAmount') + " </td> " +
        "<td width=\"20%\">Status: " + createClickableObjectForSearch(getJsonValue(ob, 'object.decision')) + "</td>  " +
        "</tr>" +
        "<tr>" +
        "<td width=\"20%\">Namn: " + createClickableObjectForSearch(getJsonValue(ob, 'object.customer.fullName')) + "</td>  " +
        "<td width=\"20%\">Gata: " + createClickableObjectForSearch(getJsonValue(ob, 'object.customer.address.streetAddress')) + "</td>  " +
        "<td width=\"20%\">Stad: " + createClickableObjectForSearch(getJsonValue(ob, 'object.customer.address.postalArea')) + "</td>  " +
        "<td width=\"20%\">Postnummer: " + createClickableObjectForSearch(getJsonValue(ob, 'object.customer.address.postalCode')) + "</td>  " +
        "<td width=\"20%\">Epost: " + createClickableObjectForSearch(getJsonValue(ob, 'object.customer.email')) + "</td>  " +
        "</tr>" +
        "</table>" +
        "</td>")
}

function createGenericRow(element, ob) {
    $(element).append("<td>Unknown - " + ob.type + "</td>");
    $(element).append("<td colspan='10'>" + ko.toJSON(ob.object) + "</td>");
}


function formToJSON() {
    return JSON.stringify({
        "searchString": "*"
    });
}


ko.bindingHandlers.selectPicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        if ($(element).is('select')) {
            if (ko.isObservable(valueAccessor())) {
                if ($(element).prop('multiple') && $.isArray(ko.utils.unwrapObservable(valueAccessor()))) {
                    // in the case of a multiple select where the valueAccessor() is an observableArray, call the default Knockout selectedOptions binding
                    ko.bindingHandlers.selectedOptions.init(element, valueAccessor, allBindingsAccessor);
                } else {
                    // regular select and observable so call the default value binding
                    ko.bindingHandlers.value.init(element, valueAccessor, allBindingsAccessor);
                }
            }
            $(element).addClass('selectpicker').selectpicker();
        }
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        if ($(element).is('select')) {
            var selectPickerOptions = allBindingsAccessor().selectPickerOptions;
            if (typeof selectPickerOptions !== 'undefined' && selectPickerOptions !== null) {
                var options = selectPickerOptions.optionsArray,
                    optionsText = selectPickerOptions.optionsText,
                    optionsValue = selectPickerOptions.optionsValue,
                    optionsCaption = selectPickerOptions.optionsCaption,
                    isDisabled = selectPickerOptions.disabledCondition || false,
                    resetOnDisabled = selectPickerOptions.resetOnDisabled || false;
                if (ko.utils.unwrapObservable(options).length > 0) {
                    // call the default Knockout options binding
                    ko.bindingHandlers.options.update(element, options, allBindingsAccessor);
                }
                if (isDisabled && resetOnDisabled) {
                    // the dropdown is disabled and we need to reset it to its first option
                    $(element).selectpicker('val', $(element).children('option:first').val());
                }
                $(element).prop('disabled', isDisabled);
            }
            if (ko.isObservable(valueAccessor())) {
                if ($(element).prop('multiple') && $.isArray(ko.utils.unwrapObservable(valueAccessor()))) {
                    // in the case of a multiple select where the valueAccessor() is an observableArray, call the default Knockout selectedOptions binding
                    ko.bindingHandlers.selectedOptions.update(element, valueAccessor);
                } else {
                    // call the default Knockout value binding
                    ko.bindingHandlers.value.update(element, valueAccessor);
                }
            }

            $(element).selectpicker('refresh');
        }
    }
};


$(function () {
    $('.input-daterange').datepicker({
        todayBtn: "linked",
        forceParse: false,
        keyboardNavigation: false,
        todayHighlight: true,
        calendarWeeks: true,
        language: "sv"
    });


});

Date.prototype.customFormat = function (formatString) {
    var YYYY, YY, MMMM, MMM, MM, M, DDDD, DDD, DD, D, hhh, hh, h, mm, m, ss, s, ampm, AMPM, dMod, th;
    var dateObject = this;
    YY = ((YYYY = dateObject.getFullYear()) + "").slice(-2);
    MM = (M = dateObject.getMonth() + 1) < 10 ? ('0' + M) : M;
    MMM = (MMMM = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][M - 1]).substring(0, 3);
    DD = (D = dateObject.getDate()) < 10 ? ('0' + D) : D;
    DDD = (DDDD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dateObject.getDay()]).substring(0, 3);
    th = (D >= 10 && D <= 20) ? 'th' : ((dMod = D % 10) == 1) ? 'st' : (dMod == 2) ? 'nd' : (dMod == 3) ? 'rd' : 'th';
    formatString = formatString.replace("#YYYY#", YYYY).replace("#YY#", YY).replace("#MMMM#", MMMM).replace("#MMM#", MMM).replace("#MM#", MM).replace("#M#", M).replace("#DDDD#", DDDD).replace("#DDD#", DDD).replace("#DD#", DD).replace("#D#", D).replace("#th#", th);

    h = (hhh = dateObject.getHours());
    if (h == 0) h = 24;
    if (h > 12) h -= 12;
    hh = h < 10 ? ('0' + h) : h;
    AMPM = (ampm = hhh < 12 ? 'am' : 'pm').toUpperCase();
    mm = (m = dateObject.getMinutes()) < 10 ? ('0' + m) : m;
    ss = (s = dateObject.getSeconds()) < 10 ? ('0' + s) : s;
    return formatString.replace("#hhh#", hhh).replace("#hh#", hh).replace("#h#", h).replace("#mm#", mm).replace("#m#", m).replace("#ss#", ss).replace("#s#", s).replace("#ampm#", ampm).replace("#AMPM#", AMPM);
}


function createClickableObjectForSearch(value) {
    value = checkValue(value);
    var string = "<span onClick='loadValueToSearch(\"" + value + "\")'><b>" + value + "</b></span>"
    return string;
}

function checkValue(value) {
    try {
        if (value)
            return value;
    } catch (e) {
    }
    return "";

}

function loadValueToSearch(value) {
    searchViewModel.searchWithValue(value);
}


var searchViewModel = new SearchViewModel();
var resultViewModel = new ResultViewModel();
var searchViewWidgetsModel = new SearchViewWidgetsModel();
var specLineModel = new SpecLineModel();

ko.applyBindings(resultViewModel, document.getElementById('searchtable'));
ko.applyBindings(searchViewModel, document.getElementById('searchform'));
ko.applyBindings(searchViewWidgetsModel, document.getElementById('widgets'));
ko.applyBindings(specLineModel, document.getElementById('paymentModal'));