var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
        enumerable: true,
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