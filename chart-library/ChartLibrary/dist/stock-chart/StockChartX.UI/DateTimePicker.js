var DateTimePicker = (function () {
    function DateTimePicker(domObject, options) {
        this.picker = domObject.datetimepicker(options);
    }
    DateTimePicker.prototype.getDate = function () {
        return moment(this.picker.data("DateTimePicker").date()).format();
    };
    DateTimePicker.prototype.setDate = function (value) {
        var formattedValue = moment(value).format('DD/MM/YYYY HH:mm');
        this.picker.data("DateTimePicker").date(formattedValue);
    };
    return DateTimePicker;
}());
export { DateTimePicker };
//# sourceMappingURL=DateTimePicker.js.map