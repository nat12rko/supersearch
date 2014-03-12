function SearchViewModel() {
    var self = this;
    self.searchString = ko.observable();

    self.fromDate = ko.observable();
    self.toDate = ko.observable();


    self.availableSystems = ko.observableArray([
        {text: 'Ehandel', id: 'ECOMMERCE'},
        {text: 'Bedrägeri', id: 'FRAUD'},
        {text: 'Limit', id: 'LIMIT'},
        {text: 'Multiupplys', id: 'MULTIUPPLYS'}
    ]);


    self.systems = ko.observableArray(['ECOMMERCE', 'FRAUD', 'LIMIT', 'MULTIUPPLYS']);

    self.availableCountries = ko.observableArray([
        {text: 'Sverige', id: 'SE'},
        {text: 'Finland', id: 'FI'},
        {text: 'Norge', id: 'NO'},
        {text: 'Danmark', id: 'DK'}
    ]);
    self.countryCodes = ko.observableArray(['SE']);


    self.search = function () {
        resultViewModel.search();
    }


    self.countryCodes.subscribe(function(newValue) {
        resultViewModel.search();

    });

    self.systems.subscribe(function(newValue) {
        resultViewModel.search();

    });

    self.fromDate.subscribe(function(newValue) {
        resultViewModel.search();

    });

    self.toDate.subscribe(function(newValue) {
        resultViewModel.search();

    });
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

ko.applyBindings(resultViewModel, document.getElementById('searchtable'));
ko.applyBindings(searchViewModel, document.getElementById('searchform'));

$(function(){
    $('.input-daterange').datepicker({
        todayBtn: "linked",
        forceParse: false,
        keyboardNavigation: false,
        todayHighlight: true,
        calendarWeeks: true,
        language: "sv"
    });
});
