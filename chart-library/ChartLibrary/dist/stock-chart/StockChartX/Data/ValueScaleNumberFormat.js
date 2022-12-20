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
import { NumberFormat, NumberFormatClasses } from './NumberFormat';
import { StringUtils } from '../../../utils';
var ValueScaleNumberFormat = (function (_super) {
    __extends(ValueScaleNumberFormat, _super);
    function ValueScaleNumberFormat(locale) {
        var _this = _super.call(this, locale) || this;
        _this._maxVisibleValue = 100;
        _this._options = {
            numberOfDigits: 3,
        };
        return _this;
    }
    Object.defineProperty(ValueScaleNumberFormat, "className", {
        get: function () {
            return NumberFormatClasses.ValueScaleNumberFormat;
        },
        enumerable: true,
        configurable: true
    });
    ValueScaleNumberFormat.prototype.format = function (value) {
        var formattedValue = '';
        var numberOfDigits = Math.ceil(this._maxVisibleValue).toString().length;
        if (numberOfDigits > 7) {
            formattedValue = StringUtils.formatMoney(value / 1000000, 2) + 'M';
        }
        else if (numberOfDigits > 5) {
            formattedValue = StringUtils.formatMoney(value / 1000, 2) + 'K';
        }
        else {
            formattedValue = StringUtils.formatMoney(value, this._options.numberOfDigits);
        }
        return StringUtils.markLeftToRightInRightToLeftContext(formattedValue);
    };
    ValueScaleNumberFormat.prototype.formatAllDigits = function (value) {
        return StringUtils.markLeftToRightInRightToLeftContext(StringUtils.formatMoney(value, this._options.numberOfDigits));
    };
    ValueScaleNumberFormat.prototype.setDecimalDigits = function (value) {
        this._options.numberOfDigits = value;
    };
    ValueScaleNumberFormat.prototype.setMaxVisibleValue = function (maxValue) {
        this._maxVisibleValue = maxValue;
    };
    ValueScaleNumberFormat.prototype.saveState = function () {
        var state = _super.prototype.saveState.call(this);
        state.numberOfDigits = this._options.numberOfDigits;
        return state;
    };
    ValueScaleNumberFormat.prototype.loadState = function (state) {
        _super.prototype.loadState.call(this, state);
        this._options.numberOfDigits = state.numberOfDigits;
    };
    return ValueScaleNumberFormat;
}(NumberFormat));
export { ValueScaleNumberFormat };
NumberFormat.register(ValueScaleNumberFormat);
//# sourceMappingURL=ValueScaleNumberFormat.js.map