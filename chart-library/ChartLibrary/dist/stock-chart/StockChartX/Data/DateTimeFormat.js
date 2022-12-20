import { ClassRegistrar } from "../Utils/ClassRegistrar";
import { JsUtil } from "../Utils/JsUtil";
var DateTimeFormatRegistrar = (function () {
    function DateTimeFormatRegistrar() {
    }
    Object.defineProperty(DateTimeFormatRegistrar, "registeredFormatters", {
        get: function () {
            return this._formatters.registeredItems;
        },
        enumerable: true,
        configurable: true
    });
    DateTimeFormatRegistrar.register = function (typeOrClassName, constructor) {
        if (typeof typeOrClassName === 'string')
            this._formatters.register(typeOrClassName, constructor);
        else
            this._formatters.register(typeOrClassName.className, typeOrClassName);
    };
    DateTimeFormatRegistrar.deserialize = function (state) {
        if (!state)
            return null;
        var format = this._formatters.createInstance(state.className);
        format.loadState(state);
        return format;
    };
    DateTimeFormatRegistrar._formatters = new ClassRegistrar();
    return DateTimeFormatRegistrar;
}());
var DateTimeFormat = (function () {
    function DateTimeFormat() {
    }
    Object.defineProperty(DateTimeFormat, "className", {
        get: function () {
            return '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateTimeFormat.prototype, "locale", {
        get: function () {
            return this._locale;
        },
        set: function (value) {
            if (this._locale !== value) {
                this._locale = value;
                this._onLocaleChanged();
            }
        },
        enumerable: true,
        configurable: true
    });
    DateTimeFormat.prototype._onLocaleChanged = function () {
    };
    DateTimeFormat.prototype.saveState = function () {
        return {
            className: this.constructor.className,
            locale: this.locale
        };
    };
    DateTimeFormat.prototype.loadState = function (state) {
        this.locale = state.locale;
    };
    return DateTimeFormat;
}());
export { DateTimeFormat };
JsUtil.applyMixins(DateTimeFormat, [DateTimeFormatRegistrar]);
//# sourceMappingURL=DateTimeFormat.js.map