ko.components.register("product-row", {
    viewModel: { require: 'component/js/product-row.js'},
    template: {require: 'text!../../component/html/product-row.html'}
});
ko.components.register("product-row-multiupplys", {
    viewModel: { require: 'component/js/product-row-multiupplys.js'},
    template: {require: 'text!../../component/html/product-row-multiupplys.html'}
});
ko.components.register("product-row-fraud", {
    viewModel: { require: 'component/js/product-row-fraud.js'},
    template: {require: 'text!../../component/html/product-row-fraud.html'}
});
ko.components.register("product-row-limit", {
    viewModel: { require: 'component/js/product-row-limit.js'},
    template: {require: 'text!../../component/html/product-row-limit.html'}
});
ko.components.register("product-row-ecommerce", {
    viewModel: { require: 'component/js/product-row-ecommerce.js'},
    template: {require: 'text!../../component/html/product-row-ecommerce.html'}
});
ko.components.register("span-date", {
    viewModel: { require: 'component/js/span-date.js'},
    template: {require: 'text!../../component/html/span-date.html'}
});
ko.components.register("span-search", {
    viewModel: { require: 'component/js/span-search.js'},
    template: {require: 'text!../../component/html/span-search.html'}
});

