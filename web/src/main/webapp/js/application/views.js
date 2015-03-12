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

        var url = window.location.protocol
            + "//"
            + window.location.host
            + window.location.pathname
            + '?jsonData='+encodeURIComponent(jsonData);

        window.history.pushState("q", "Title",url);

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


    var jsonData = $.query.get('jsonData');

    if(jsonData) {

        var parsed = JSON.parse(jsonData);

        searchViewModel.page(parsed.page);
        searchViewModel.fromDate(parsed.fromDate);
        searchViewModel.toDate(parsed.toDate);
        searchViewModel.searchDate(parsed.searchDate);
        searchViewModel.pageSize(parsed.pageSize)
        searchViewModel.searchString(parsed.searchString);

        searchViewModel.systems(parsed.systems);
        searchViewModel.countryCodes(parsed.countryCodes);
        searchViewModel.filters(parsed.filters);


    }
    var q = $.query.get('q');

    if (q) {
        searchViewModel.searchString(q);
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

function testSearch(data) {
    var target = "http://supersearch.pte.loc/web/search.html?q=\""+data+"\"";
    window.open(target);
}

function openFraud(extRef) {
    var exRef = {"externalrefno" : extRef};
    openNewWindow('POST', 'http://172.16.1.97/gui/reports/detailsext', exRef, '_blank');
}

// Arguments :
//  verb : 'GET'|'POST'
//  target : an optional opening target (a name, or "_blank"), defaults to "_self"
openNewWindow = function(verb, url, data, target) {
    var form = document.createElement("form");
    form.action = url;
    form.method = verb;
    form.target = target || "_self";
    if (data) {
        for (var key in data) {
            var input = document.createElement("textarea");
            input.name = key;
            input.value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
            form.appendChild(input);
        }
    }
    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
};

function FraudAnalysisModel() {
    var self = this;
    self.high = ko.observableArray();
    self.medium = ko.observableArray();
    self.low = ko.observableArray();
    self.none = ko.observableArray();
    self.products = ko.observableArray();

    self.fraud = ko.observable();

    self.billing = ko.observable();
    self.delivery = ko.observable();
    self.given = ko.observable();

    self.customer = ko.observable();

    self.searchGid = function(customer) {
        alert(customer.gid);
    }

    self.addProduct = function(line){
        self.products.push(line);
    }

    self.setBilling = function(address){
        self.billing(address);
    }

    self.setDelivery = function(address){
        self.delivery(address);
    }

    self.setGiven = function(address){
        self.given(address);
    }

    self.setFraud = function(fraud) {
        self.fraud(fraud);
    }

    self.addCustomerInfo = function(info) {
        self.customer(info);
    }

    self.addHigh = function(analysis){
        self.high.push(analysis)}

    self.addMedium = function(analysis){
        self.medium.push(analysis)}

    self.addLow = function(analysis){
        self.low.push(analysis)}

    self.addNone = function(analysis){
        self.none.push(analysis)}

    self.reset = function() {
        self.high.removeAll();
        self.medium.removeAll();
        self.low.removeAll();
        self.none.removeAll();
        self.products.removeAll();
        self.customer();

        self.billing(null);
        self.delivery(null);
        self.given(null);

        self.fraud();
    }
}



function showFraudModal(fraud) {

    fraudAnalysisModel.reset();

    var fraudModal = $('#fraudModal');
    extractFraudAnalysis(fraud)
    fraudModal.modal('show');
}

function extractFraudAnalysis(fraud) {

    fraudAnalysisModel.reset();

    fraudAnalysisModel.setFraud(fraud);

    var analysises = fraud['fraudAnalysisResults']
    for (var pos in analysises) {
        var analysis = analysises[pos];
        if (analysis.fraudRiskEstmation == "HIGH") {
            fraudAnalysisModel.addHigh(analysis);
        } else if (analysis.fraudRiskEstmation == "MEDIUM") {
            fraudAnalysisModel.addMedium(analysis);
        } else if (analysis.fraudRiskEstmation == "LOW") {
            fraudAnalysisModel.addLow(analysis);
        } else if (analysis.fraudRiskEstmation == "NONE") {
            fraudAnalysisModel.addNone(analysis);
        }
    }

    var customer = new Object();
    var fraudInData = fraud['controlRequestJson'];

    if (fraudInData['billingAddress']) {
        fraudAnalysisModel.setBilling(fraudInData['billingAddress'])
        customer.fullName = fraudInData['billingAddress']['fullName'];
    }
    if (fraudInData['deliveryAddress']) {
        fraudAnalysisModel.setDelivery(fraudInData['deliveryAddress'])
    }
    if (fraudInData['customerGivenAddress']) {
        fraudAnalysisModel.setGiven(fraudInData['customerGivenAddress'])
    }

    // Customer data
    customer.gid = fraud.governmentId;
    customer.email = fraudInData['emails']['email'];
    customer.ip    = fraudInData['ipAddress'];
    if (fraudInData['phoneNumbers']['phone1']) {
        customer.phone = fraudInData['phoneNumbers']['phone1'];
    }
    if (fraudInData['phoneNumbers']['phone2']) {
        customer.phone = fraudInData['phoneNumbers']['phone2'];
    }
    fraudAnalysisModel.addCustomerInfo(customer);

    // Products
    var products = fraudInData['products'];
    for (var l in products) {
        fraudAnalysisModel.addProduct(products[l]);
    }
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



function showPaymentModal(payment) {

    var paymentModal = $('#paymentModal');

    // Create KO-bindings
    extractSpecLines(payment);

    paymentModal.find('.modal-title').text("Payment Id: " + payment.externalId);
    paymentModal.find('.payment-total').text(payment.totalValue.withVat);
    paymentModal.find('.payment-credited').text(payment.totalCreditValue.withVat);
    paymentModal.find('.payment-finalized').text(payment.totalFinalized.withVat);
    paymentModal.find('.payment-unfinalized').text(payment.totalUnfinalized.withVat);

    paymentModal.modal('show');
}

function extractSpecLines(payment) {

    specLineModel.reset()

    var paymentDiffs = payment['paymentDiffs']
    for (pos in paymentDiffs) {
        var paymentSpec = paymentDiffs[pos]['paymentSpecification']

        if (paymentSpec.lines.length > 0) {
            for (var n in paymentSpec.lines) {
                var line = paymentSpec.lines[n]
                addLineSum(line);
                if (paymentDiffs[pos].type === "AUTHORIZE") {
                    specLineModel.addAuth(line);
                } else if (paymentDiffs[pos].type === "DEBIT") {
                    specLineModel.addDeb(line);
                } else if (paymentDiffs[pos].type === "ANNUL") {
                    specLineModel.addAnnul(line);
                } else if (paymentDiffs[pos].type === "CREDIT") {
                    specLineModel.addCred(line);
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
var fraudAnalysisModel = new FraudAnalysisModel();

ko.applyBindings(resultViewModel, document.getElementById('searchtable'));
ko.applyBindings(searchViewModel, document.getElementById('searchform'));
ko.applyBindings(searchViewWidgetsModel, document.getElementById('widgets'));


