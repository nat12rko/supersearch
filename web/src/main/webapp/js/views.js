function SearchViewModel() {
    var self = this;
    self.searchString = ko.observable();

    self.fromDate = ko.observable();
    self.toDate = ko.observable();


    self.availableSystems = ko.observableArray(['ECOMMERCE', 'FRAUD', 'LIMIT', 'MULTIUPPLYS']);
    self.systems = ko.observableArray(['ECOMMERCE', 'FRAUD', 'LIMIT', 'MULTIUPPLYS']);

    self.availableCountries = ko.observableArray(['SE', 'FI', 'NO', 'DK']);
    self.countryCodes = ko.observableArray(['SE']);


    self.search = function () {
        resultViewModel.search();
    }
}

function ResultViewModel() {
    var self = this;
    self.tasksURI = "http://localhost:8080/rest/search";

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

        var jsonData = ko.toJSON(searchViewModel);

        if (!jsonData) {
            jsonData = formToJSON();
        }
        self.ajax(self.tasksURI, 'POST', jsonData).done(function (data) {
                self.hits.removeAll();
                for (var i = 0; i < data.hits.length; i++) {
                    self.hits.push(data.hits[i]);
                }
            }
        );
    }
    self.search();
}

var resultViewModel = new ResultViewModel();
var searchViewModel = new SearchViewModel();

ko.applyBindings(resultViewModel, document.getElementById('searchtable'));
ko.applyBindings(searchViewModel, document.getElementById('searchform'));


function objectToView(ob, element) {
    if (ob.type === "creditcase") {
        createMultiupplysRow(element, ob);
    } else {
        createGenericRow(element, ob);
    }
    return ob;
}

function createMultiupplysRow(element, ob) {
    $(element).append("<td>Multiupplys</td>")
    $(element).append("<td>" + ob.object.publicReferenceNumber + "</td>")
    $(element).append("<td>" + ob.object.application.applicant.governmentId.value + "</td>")
    $(element).append("<td>" + ob.object.creditCaseTags.EXTERNAL_REFERENCE + "</td>")
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