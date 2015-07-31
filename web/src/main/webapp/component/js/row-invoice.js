define(['knockout'], function(ko) {
    function ProductRow(data) {
        this.row = (data && data.row) || "none";
    }
    return ProductRow;
});