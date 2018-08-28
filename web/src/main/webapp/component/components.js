ko.components.register("search-row", {
    viewModel: { require: 'component/js/search-row.js?timestamp='+new Date().getTime()},
    template: {require: 'text!../../component/html/search-row.html?timestamp='+new Date().getTime()},
    synchronous: true
});
ko.components.register("row-multiupplys", {
    viewModel: { require: 'component/js/row-multiupplys.js?timestamp='+new Date().getTime()},
    template: {require: 'text!../../component/html/row-multiupplys.html?timestamp='+new Date().getTime()},
    synchronous: true

});
ko.components.register("row-invoice", {
    viewModel: { require: 'component/js/row-invoice.js?timestamp='+new Date().getTime()},
    template: {require: 'text!../../component/html/row-invoice.html?timestamp='+new Date().getTime()},
    synchronous: true
});
ko.components.register("row-fraud", {
    viewModel: { require: 'component/js/row-fraud.js?timestamp='+new Date().getTime()},
    template: {require: 'text!../../component/html/row-fraud.html?timestamp='+new Date().getTime()} ,
    synchronous: true
});
ko.components.register("row-limit", {
    viewModel: { require: 'component/js/row-limit.js?timestamp='+new Date().getTime()},
    template: {require: 'text!../../component/html/row-limit.html?timestamp='+new Date().getTime()},
    synchronous: true
});
ko.components.register("row-ecommerce", {
    viewModel: {require: 'component/js/row-ecommerce.js?timestamp=' + new Date().getTime()},
    template: {require: 'text!../../component/html/row-ecommerce.html?timestamp=' + new Date().getTime()},
    synchronous: true
});
ko.components.register("row-creditrequest", {
    viewModel: {require: 'component/js/row-creditrequest.js?timestamp=' + new Date().getTime()},
    template: {require: 'text!../../component/html/row-creditrequest.html?timestamp=' + new Date().getTime()},
    synchronous: true
});
ko.components.register("span-date", {
    viewModel: { require: 'component/js/span-date.js?timestamp='+new Date().getTime()},
    template: {require: 'text!../../component/html/span-date.html?timestamp='+new Date().getTime()} ,
    synchronous: true
});
ko.components.register("span-search", {
    viewModel: { require: 'component/js/span-search.js?timestamp='+new Date().getTime()},
    template: {require: 'text!../../component/html/span-search.html?timestamp='+new Date().getTime()} ,
    synchronous: true
});
ko.components.register("searchlist-item-header", {
    viewModel: { require: 'component/js/searchlist-item-header.js?timestamp='+new Date().getTime()},
    template: {require: 'text!../../component/html/searchlist-item-header.html?timestamp='+new Date().getTime()} ,
    synchronous: true
});
ko.components.register("multiupplys-info", {
    viewModel: { require: 'component/js/multiupplys-info.js?timestamp='+new Date().getTime()},
    template: {require: 'text!../../component/html/multiupplys-info.html?timestamp='+new Date().getTime()} ,
    synchronous: true
});
ko.components.register("ecommerce-info", {
    viewModel: { require: 'component/js/ecommerce-info.js?timestamp='+new Date().getTime()},
    template: {require: 'text!../../component/html/ecommerce-info.html?timestamp='+new Date().getTime()} ,
    synchronous: false
});

ko.components.register("row-paymentandorapplicationupdate", {
    viewModel: { require: 'component/js/row-paymentandorapplicationupdate.js?timestamp='+new Date().getTime()},
    template: {require: 'text!../../component/html/row-paymentandorapplicationupdate.html?timestamp='+new Date().getTime()} ,
    synchronous: true
});


ko.components.register("paymentandorapplicationupdate-info", {
    viewModel: { require: 'component/js/paymentandorapplicationupdate-info.js?timestamp='+new Date().getTime()},
    template: {require: 'text!../../component/html/paymentandorapplicationupdate-info.html?timestamp='+new Date().getTime()} ,
    synchronous: true
});

