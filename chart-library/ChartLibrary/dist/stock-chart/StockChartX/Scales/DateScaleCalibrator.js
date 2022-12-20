import { ClassRegistrar } from "../Utils/ClassRegistrar";
import { JsUtil } from "../Utils/JsUtil";
var DateScaleCalibratorRegistrar = (function () {
    function DateScaleCalibratorRegistrar() {
    }
    Object.defineProperty(DateScaleCalibratorRegistrar, "registeredCalibrators", {
        get: function () {
            return this._calibrators.registeredItems;
        },
        enumerable: true,
        configurable: true
    });
    DateScaleCalibratorRegistrar.register = function (typeOrClassName, constructor) {
        if (typeof typeOrClassName === 'string')
            this._calibrators.register(typeOrClassName, constructor);
        else
            this._calibrators.register(typeOrClassName.className, typeOrClassName);
    };
    DateScaleCalibratorRegistrar.deserialize = function (state) {
        if (!state)
            return null;
        var calibrator = this._calibrators.createInstance(state.className);
        calibrator.loadState(state);
        return calibrator;
    };
    DateScaleCalibratorRegistrar._calibrators = new ClassRegistrar();
    return DateScaleCalibratorRegistrar;
}());
var DateScaleCalibrator = (function () {
    function DateScaleCalibrator(config) {
        this._majorTicks = [];
        this._minorTicks = [];
        this._options = {};
        if (config) {
            this.loadState({ options: config });
        }
    }
    Object.defineProperty(DateScaleCalibrator, "className", {
        get: function () {
            return '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleCalibrator.prototype, "majorTicks", {
        get: function () {
            return this._majorTicks;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleCalibrator.prototype, "minorTicks", {
        get: function () {
            return this._minorTicks;
        },
        enumerable: true,
        configurable: true
    });
    DateScaleCalibrator.prototype.calibrate = function (dateScale) {
        this._majorTicks.length = 0;
        this._minorTicks.length = 0;
    };
    DateScaleCalibrator.prototype._calibrateMinorTicks = function (ticksCount) {
        var majorTicks = this.majorTicks;
        for (var i = 0, count = majorTicks.length; i < count - 1; i++) {
            var tick1 = majorTicks[i], tick2 = majorTicks[i + 1], width = (tick2.x - tick1.x) / (ticksCount + 1);
            for (var j = 1; j <= ticksCount; j++) {
                this.minorTicks.push({
                    x: Math.round(tick1.x + j * width)
                });
            }
        }
    };
    DateScaleCalibrator.prototype.saveState = function () {
        return {
            className: this.constructor.className,
            options: Object.keys(this._options).length == 0 ? null : JsUtil.clone(this._options)
        };
    };
    DateScaleCalibrator.prototype.loadState = function (state) {
        this._options = (state && JsUtil.clone(state.options)) || {};
    };
    return DateScaleCalibrator;
}());
export { DateScaleCalibrator };
JsUtil.applyMixins(DateScaleCalibrator, [DateScaleCalibratorRegistrar]);
//# sourceMappingURL=DateScaleCalibrator.js.map