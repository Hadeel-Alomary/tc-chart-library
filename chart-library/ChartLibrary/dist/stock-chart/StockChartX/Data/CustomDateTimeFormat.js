import { __extends } from "tslib";
import { DateTimeFormat } from "./DateTimeFormat";
var CustomDateTimeFormat = (function (_super) {
    __extends(CustomDateTimeFormat, _super);
    function CustomDateTimeFormat(format) {
        var _this = _super.call(this) || this;
        _this.formatString = format;
        return _this;
    }
    Object.defineProperty(CustomDateTimeFormat, "className", {
        get: function () {
            return 'StockChartX.CustomDateTimeFormat';
        },
        enumerable: false,
        configurable: true
    });
    CustomDateTimeFormat.prototype.format = function (date) {
        var momentDate = moment(date);
        moment.locale(this.locale);
        return momentDate.format(this.formatString);
    };
    CustomDateTimeFormat.prototype.saveState = function () {
        var state = _super.prototype.saveState.call(this);
        state.formatString = this.formatString;
        return state;
    };
    CustomDateTimeFormat.prototype.loadState = function (state) {
        _super.prototype.loadState.call(this, state);
        this.formatString = state.formatString;
    };
    return CustomDateTimeFormat;
}(DateTimeFormat));
export { CustomDateTimeFormat };
DateTimeFormat.register(CustomDateTimeFormat);
//# sourceMappingURL=CustomDateTimeFormat.js.map