var JsUtil = (function () {
    function JsUtil() {
    }
    JsUtil.isNumber = function (value) {
        return typeof (value) === 'number';
    };
    JsUtil.isFiniteNumber = function (value) {
        return this.isNumber(value) && isFinite(value);
    };
    JsUtil.isFiniteNumberOrNaN = function (value) {
        return this.isNumber(value) && (isFinite(value) || isNaN(value));
    };
    JsUtil.isPositiveNumber = function (value) {
        return this.isFiniteNumber(value) && value > 0;
    };
    JsUtil.isNegativeNumber = function (value) {
        return this.isFiniteNumber(value) && value < 0;
    };
    JsUtil.isPositiveNumberOrNaN = function (value) {
        return this.isNumber(value) && (isNaN(value) || (value > 0 && isFinite(value)));
    };
    JsUtil.isFunction = function (value) {
        return !!(value && value.constructor && value.call && value.apply);
    };
    JsUtil.clone = function (obj) {
        var result = jQuery.extend(true, {}, obj);
        for (var prop in result) {
            if (!result.hasOwnProperty(prop))
                continue;
            var arr = result[prop];
            if (!Array.isArray(arr))
                continue;
            for (var i = 0, count = arr.length; i < count; i++) {
                if (typeof arr[i] === 'object') {
                    arr[i] = this.clone(arr[i]);
                }
            }
        }
        return result;
    };
    JsUtil.extend = function (dst, src) {
        var dstPrototype = dst.prototype;
        var f = function () {
        };
        f.prototype = src.prototype;
        var l = new f();
        dst.prototype = l;
        dst.prototype.constructor = dst;
        for (var key in dstPrototype) {
            dst.prototype[key] = dstPrototype[key];
        }
    };
    JsUtil.applyMixins = function (derivedCtor, baseCtors) {
        baseCtors.forEach(function (baseCtor) {
            Object.getOwnPropertyNames(baseCtor).forEach(function (name) {
                var descriptor = Object.getOwnPropertyDescriptor(baseCtor, name);
                if (descriptor.enumerable && name !== 'constructor') {
                    derivedCtor[name] = baseCtor[name];
                }
            });
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
                if (name !== 'constructor') {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                }
            });
        });
    };
    JsUtil.padStr = function (str, options) {
        var count = options.width - str.length;
        for (var i = 0; i < count; i++) {
            str = options.alignLeft ? str + options.padding : options.padding + str;
        }
        return str;
    };
    JsUtil.filterText = function (text) {
        return ($('<div></div>').text(text).html()).trim();
    };
    JsUtil.guid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    return JsUtil;
}());
export { JsUtil };
Math.roundToDecimals = function (value, decimals) {
    return Number(Math.round(Number(value + 'E' + decimals)) + 'E-' + decimals);
};
if (!Math.trunc) {
    Math.trunc = function (value) {
        return value < 0 ? Math.ceil(value) : Math.floor(value);
    };
}
//# sourceMappingURL=JsUtil.js.map