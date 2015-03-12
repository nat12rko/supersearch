define(['knockout'], function (ko) {
    function SpanDate(data) {
        var self = this;
        self.raw = (data && data.raw);
        if (self.raw) {
            if (data.mode === "shortDate") {
                self.date = new Date(self.raw).customFormat('#YY#-#MM#-#DD#');
            } else if (data.mode === "date") {
                self.date = new Date(self.raw).customFormat('#YYYY#-#MM#-#DD#');
            } else if (data.mode === "time") {
                self.date = new Date(self.raw).customFormat('#hhh#:#mm#:#ss#');
            } else if (data.mode === "fancy"){

                var today = new Date();
                var yesterday = new Date();
                yesterday.setDate(today.getDate()-1);

                var todayForCompare = today.customFormat('#YYYY#-#MM#-#DD#');
                var yesterdayForCompare = yesterday.customFormat('#YYYY#-#MM#-#DD#');

                var source = new Date(self.raw).customFormat('#YYYY#-#MM#-#DD#');

                if (todayForCompare == source) {
                    self.date = 'Today @' + new Date(self.raw).customFormat(' #hhh#:#mm#:#ss#');
                } else if (yesterdayForCompare == source) {
                    self.date = 'Yesterday @' + new Date(self.raw).customFormat(' #hhh#:#mm#:#ss#');
                } else {
                    self.date = new Date(self.raw).customFormat('#YYYY#-#MM#-#DD# @ #hhh#:#mm#:#ss#');
                }
            } else {
                self.date = new Date(self.raw).customFormat('#YYYY#-#MM#-#DD# #hhh#:#mm#:#ss#');
            }
        }
    }
    return SpanDate;
});
