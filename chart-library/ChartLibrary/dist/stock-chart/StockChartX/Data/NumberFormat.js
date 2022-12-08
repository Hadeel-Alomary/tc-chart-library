import { ClassRegistrar } from "../Utils/ClassRegistrar";
import { JsUtil } from "../Utils/JsUtil";
export var NumberFormatClasses;
(function (NumberFormatClasses) {
    NumberFormatClasses["IntlNumberFormat"] = "StockChartX.IntlNumberFormat";
    NumberFormatClasses["ValueScaleNumberFormat"] = "StockChartX.ValueScaleNumberFormat";
})(NumberFormatClasses || (NumberFormatClasses = {}));
var NumberFormatRegistrar = (function () {
    function NumberFormatRegistrar() {
    }
    Object.defineProperty(NumberFormatRegistrar, "registeredFormatters", {
        get: function () {
            return this._formatters.registeredItems;
        },
        enumerable: false,
        configurable: true
    });
    NumberFormatRegistrar.register = function (typeOrClassName, constructor) {
        if (typeof typeOrClassName === 'string')
            this._formatters.register(typeOrClassName, constructor);
        else
            this._formatters.register(typeOrClassName.className, typeOrClassName);
    };
    NumberFormatRegistrar.deserialize = function (state) {
        if (!state)
            return null;
        if (state.className == NumberFormatClasses.IntlNumberFormat) {
            return this._formatters.createInstance(NumberFormatClasses.ValueScaleNumberFormat);
        }
        var format = this._formatters.createInstance(state.className);
        format.loadState(state);
        return format;
    };
    NumberFormatRegistrar._formatters = new ClassRegistrar();
    return NumberFormatRegistrar;
}());
var NumberFormat = (function () {
    function NumberFormat(locale) {
        this._locale = locale;
    }
    Object.defineProperty(NumberFormat, "className", {
        get: function () {
            return '';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NumberFormat.prototype, "locale", {
        get: function () {
            return this._locale;
        },
        set: function (value) {
            if (this._locale !== value) {
                this._locale = value;
                this._onLocaleChanged();
            }
        },
        enumerable: false,
        configurable: true
    });
    NumberFormat.prototype._onLocaleChanged = function () {
    };
    NumberFormat.prototype.saveState = function () {
        return {
            className: this.constructor.className,
            locale: this.locale,
        };
    };
    NumberFormat.prototype.loadState = function (state) {
        this._locale = state && state.locale;
    };
    return NumberFormat;
}());
export { NumberFormat };
JsUtil.applyMixins(NumberFormat, [NumberFormatRegistrar]);
//# sourceMappingURL=NumberFormat.js.map