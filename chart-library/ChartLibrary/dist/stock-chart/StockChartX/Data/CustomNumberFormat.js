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
import { NumberFormat } from "./NumberFormat";
import { JsUtil } from "../Utils/JsUtil";
var CustomNumberFormat = (function (_super) {
    __extends(CustomNumberFormat, _super);
    function CustomNumberFormat(format) {
        var _this = _super.call(this) || this;
        _this.formatString = format || '%f';
        return _this;
    }
    Object.defineProperty(CustomNumberFormat, "className", {
        get: function () {
            return 'StockChartX.CustomNumberFormat';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomNumberFormat.prototype, "formatString", {
        get: function () {
            return this._formatString;
        },
        set: function (value) {
            this._formatString = value;
            this._parseFormat();
        },
        enumerable: true,
        configurable: true
    });
    CustomNumberFormat.prototype._parseFormat = function () {
        var format = this.formatString;
        if (!format || typeof format !== 'string')
            throw new TypeError("Format specifier must be a string.");
        var regex = /%(\+)?([0 ]|'(.))?(-)?([0-9]+)?(\.([0-9]+))?([bcdfoxXeEgG])/g;
        var matches = regex.exec(format);
        this._options = {
            sign: matches[1] === '+',
            padding: matches[2] == null
                ? ' '
                : matches[2].substring(0, 1) === "'"
                    ? matches[3]
                    : matches[2],
            alignLeft: matches[4] === '-',
            width: matches[5] != null ? matches[5] : false,
            precision: matches[7] != null ? matches[7] : false,
            type: matches[8]
        };
    };
    CustomNumberFormat.prototype.format = function (value) {
        var numberValue = Number(value);
        var options = this._options, valueStr = "";
        switch (options.type) {
            case 'b':
                valueStr = numberValue.toString(2);
                break;
            case 'c':
                valueStr = String.fromCharCode(numberValue);
                break;
            case 'd':
                valueStr = parseInt(numberValue.toString(), 10).toString();
                break;
            case 'f':
                valueStr = options.precision === false ? value.toString() : numberValue.toFixed(options.precision);
                break;
            case 'o':
                valueStr = numberValue.toString(8);
                break;
            case 'x':
                valueStr = numberValue.toString(16).toLowerCase();
                break;
            case 'X':
                valueStr = numberValue.toString(16).toUpperCase();
                break;
            case 'e':
            case 'E':
                valueStr = options.precision === false
                    ? numberValue.toExponential()
                    : numberValue.toExponential(options.precision);
                valueStr = options.type === 'e'
                    ? valueStr.toLowerCase()
                    : valueStr.toUpperCase();
                break;
            case 'g':
            case 'G':
                var fValue = options.precision === false
                    ? value.toString()
                    : numberValue.toFixed(options.precision);
                var eValue = options.precision === false
                    ? numberValue.toExponential()
                    : numberValue.toExponential(options.precision);
                valueStr = fValue.length < eValue.length ? fValue : eValue;
                valueStr = options.type === 'g' ? valueStr.toLowerCase() : valueStr.toUpperCase();
                break;
            default:
                throw 'Unknown value type "' + options.type + '" detected.';
        }
        var shouldAlign = options.width !== false && options.width > valueStr.length;
        if (shouldAlign && !options.alignLeft && options.padding !== ' ') {
            valueStr = JsUtil.padStr(valueStr, {
                width: options.width,
                alignLeft: options.alignLeft,
                padding: Number(options.padding),
            });
            shouldAlign = false;
        }
        switch (options.type) {
            case 'd':
            case 'f':
            case 'e':
            case 'E':
            case 'g':
            case 'G':
                if (value < 0) {
                    if (valueStr[0] !== '-')
                        valueStr = '-' + valueStr;
                }
                else if (options.sign) {
                    valueStr = '+' + valueStr;
                }
                break;
        }
        if (shouldAlign) {
            valueStr = JsUtil.padStr(valueStr, {
                width: options.width,
                alignLeft: options.alignLeft,
                padding: Number(options.padding),
            });
        }
        return valueStr;
    };
    CustomNumberFormat.prototype.saveState = function () {
        var state = _super.prototype.saveState.call(this);
        state.formatString = this.formatString;
        return state;
    };
    CustomNumberFormat.prototype.loadState = function (state) {
        _super.prototype.loadState.call(this, state);
        this.formatString = state && state.formatString;
    };
    CustomNumberFormat.prototype.setDecimalDigits = function (value) {
    };
    return CustomNumberFormat;
}(NumberFormat));
export { CustomNumberFormat };
NumberFormat.register(CustomNumberFormat);
//# sourceMappingURL=CustomNumberFormat.js.map