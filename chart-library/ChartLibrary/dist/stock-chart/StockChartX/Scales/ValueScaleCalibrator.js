import { ClassRegistrar } from "../Utils/ClassRegistrar";
import { JsUtil } from "../Utils/JsUtil";
var ValueScaleCalibratorRegistrar = (function () {
    function ValueScaleCalibratorRegistrar() {
    }
    Object.defineProperty(ValueScaleCalibratorRegistrar, "registeredCalibrators", {
        get: function () {
            return this._calibrators.registeredItems;
        },
        enumerable: true,
        configurable: true
    });
    ValueScaleCalibratorRegistrar.register = function (typeOrClassName, constructor) {
        if (typeof typeOrClassName === 'string')
            this._calibrators.register(typeOrClassName, constructor);
        else
            this._calibrators.register(typeOrClassName.className, typeOrClassName);
    };
    ValueScaleCalibratorRegistrar.deserialize = function (state) {
        if (!state)
            return null;
        var calibrator = this._calibrators.createInstance(state.className);
        calibrator.loadState(state);
        return calibrator;
    };
    ValueScaleCalibratorRegistrar._calibrators = new ClassRegistrar();
    return ValueScaleCalibratorRegistrar;
}());
var ValueScaleCalibrator = (function () {
    function ValueScaleCalibrator(config) {
        this._majorTicks = [];
        this._minorTicks = [];
        this._options = {};
        if (config) {
            this.loadState({ options: config });
        }
    }
    Object.defineProperty(ValueScaleCalibrator, "className", {
        get: function () {
            return '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValueScaleCalibrator.prototype, "majorTicks", {
        get: function () {
            return this._majorTicks;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValueScaleCalibrator.prototype, "minorTicks", {
        get: function () {
            return this._minorTicks;
        },
        enumerable: true,
        configurable: true
    });
    ValueScaleCalibrator.prototype.calibrate = function (valueScale) {
        this._majorTicks.length = 0;
        this._minorTicks.length = 0;
    };
    ValueScaleCalibrator.prototype._calibrateMinorTicks = function (ticksCount) {
        var majorTicks = this.majorTicks;
        for (var i = 0, count = majorTicks.length; i < count - 1; i++) {
            var tick1 = majorTicks[i], tick2 = majorTicks[i + 1], width = (tick2.y - tick1.y) / (ticksCount + 1);
            for (var j = 1; j <= ticksCount; j++) {
                this.minorTicks.push({
                    y: Math.round(tick1.y + j * width)
                });
            }
        }
    };
    ValueScaleCalibrator.prototype.saveState = function () {
        return {
            className: this.constructor.className,
            options: Object.keys(this._options).length == 0 ? null : JsUtil.clone(this._options)
        };
    };
    ValueScaleCalibrator.prototype.loadState = function (state) {
        this._options = (state && JsUtil.clone(state.options)) || {};
    };
    return ValueScaleCalibrator;
}());
export { ValueScaleCalibrator };
JsUtil.applyMixins(ValueScaleCalibrator, [ValueScaleCalibratorRegistrar]);
//# sourceMappingURL=ValueScaleCalibrator.js.map