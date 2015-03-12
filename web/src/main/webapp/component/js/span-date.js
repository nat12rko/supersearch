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
                self.date = new Date(self.raw).customFormat('#hh#:#mm#:#ss#');
            } else {
                self.date = new Date(self.raw).customFormat('#YYYY#-#MM#-#DD# #hh#:#mm#:#ss#');
            }
        }
    }
    return SpanDate;
});
