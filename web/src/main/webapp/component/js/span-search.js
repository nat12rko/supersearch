define(['knockout'], function(ko) {
    function SpanSearch(data) {
        var self = this;
        self.value= (data && data.value) || "";

        self.search = function(){
            loadValueToSearch(self.value);
        }
    }
    return SpanSearch;
});
