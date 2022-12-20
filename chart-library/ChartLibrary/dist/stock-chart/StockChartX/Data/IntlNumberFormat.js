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
import { JsUtil } from "../Utils/JsUtil";
var IntlNumberFormat = (function (_super) {
    __extends(IntlNumberFormat, _super);
    function IntlNumberFormat(locale, options) {
        var _this = _super.call(this, locale) || this;
        _this._createFormat(options);
        return _this;
    }
    Object.defineProperty(IntlNumberFormat, "className", {
        get: function () {
            return NumberFormatClasses.IntlNumberFormat;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IntlNumberFormat.prototype, "options", {
        get: function () {
            return this._numberFormat.resolvedOptions();
        },
        set: function (value) {
            this._createFormat(value);
        },
        enumerable: true,
        configurable: true
    });
    IntlNumberFormat.prototype._onLocaleChanged = function () {
        this._createFormat();
    };
    IntlNumberFormat.prototype._createFormat = function (options) {
        var locale = this.locale || 'en';
        if (!options) {
            options = this._numberFormat && this._numberFormat.resolvedOptions();
        }
        this._numberFormat = new Intl.NumberFormat(locale, options || undefined);
    };
    IntlNumberFormat.prototype.format = function (value) {
        return this._numberFormat.format(value);
    };
    IntlNumberFormat.prototype.setDecimalDigits = function (value) {
        if (JsUtil.isNegativeNumber(value))
            throw new Error('Value must be greater or equal to zero.');
        var options = this._numberFormat.resolvedOptions();
        options.minimumFractionDigits = options.maximumFractionDigits = value;
        this._createFormat(options);
    };
    IntlNumberFormat.prototype.saveState = function () {
        var state = _super.prototype.saveState.call(this);
        state.options = JsUtil.clone(this.options);
        return state;
    };
    IntlNumberFormat.prototype.loadState = function (state) {
        _super.prototype.loadState.call(this, state);
        this._createFormat(state && state.options);
    };
    return IntlNumberFormat;
}(NumberFormat));
export { IntlNumberFormat };
NumberFormat.register(IntlNumberFormat);
//# sourceMappingURL=IntlNumberFormat.js.map