define(['knockout'], function (ko) {
    function ProductRow(data) {
        var self = this;
        self.row = (data && data.row) || "none";

        self.show = function(){
            return ;
        }
    }

    return ProductRow;
});