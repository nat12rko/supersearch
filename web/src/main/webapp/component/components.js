ko.components.register("product-row", {
    viewModel: { require: 'component/js/product-row.js?timestamp='+new Date().getTime()},
    template: {require: 'text!../../component/html/product-row.html?timestamp='+new Date().getTime()},
    synchronous: true
});
ko.components.register("product-row-multiupplys", {
    viewModel: { require: 'component/js/product-row-multiupplys.js?timestamp='+new Date().getTime()},
    template: {require: 'text!../../component/html/product-row-multiupplys.html?timestamp='+new Date().getTime()},
    synchronous: true

});
ko.components.register("product-row-fraud", {
    viewModel: { require: 'component/js/product-row-fraud.js?timestamp='+new Date().getTime()},
    template: {require: 'text!../../component/html/product-row-fraud.html?timestamp='+new Date().getTime()} ,
    synchronous: true
});
ko.components.register("product-row-limit", {
    viewModel: { require: 'component/js/product-row-limit.js?timestamp='+new Date().getTime()},
    template: {require: 'text!../../component/html/product-row-limit.html?timestamp='+new Date().getTime()},
    synchronous: true
});
ko.components.register("product-row-ecommerce", {
    viewModel: { require: 'component/js/product-row-ecommerce.js?timestamp='+new Date().getTime()},
    template: {require: 'text!../../component/html/product-row-ecommerce.html?timestamp='+new Date().getTime()} ,
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

