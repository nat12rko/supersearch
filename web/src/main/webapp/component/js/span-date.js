define(['knockout'], function (ko) {
    function SpanDate(data) {
        var self = this;
        self.raw = (data && data.raw);
        self.date;
        if (self.raw) {
            self.date = new Date(self.raw).customFormat('#YYYY#-#MM#-#DD# #hh#:#mm#:#ss#');
        }
    }
    return SpanDate;
});