var element = $('#paginatorbuttom');
var elementtop = $('#paginatortop');


var options = {
    bootstrapMajorVersion: 3,
    currentPage: 1,
    numberOfPages: 10,
    totalPages: 10,
    onPageClicked: function (e, originalEvent, type, page) {
        searchViewModel.setPage(page - 1);
    }

}

element.bootstrapPaginator(options);
elementtop.bootstrapPaginator(options);