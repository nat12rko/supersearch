define(['knockout'], function(ko) {
    function ProductRow(data) {
        var self = this;

        self.caption = data.caption;
        self.id = data.id;
        self.timestamp = data.timestamp;
        self.clickUrl = data.clickUrl;
        self.buttonText = (data && data.buttonText);
        self.buttonUrl = (data && data.buttonUrl);
        self.buttonStyle = (data && data.buttonStyle);


        self.clicked = function() {
            return data.clickUrl;
        }

        self.getButtonClass = function() {
            var classes = "btn btn-primary btn-xs";
            if (self.buttonStyle === "danger") {
                classes += " btn-" + data.buttonStyle;
            }
            return classes;
        }

        self.showButton = function(){
            if (self.buttonUrl) {
                return true;
            }
            return false;
        }
    }
    return ProductRow;
});
