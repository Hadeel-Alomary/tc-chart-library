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
import { GeometricMarkerDrawingBase } from "./GeometricMarkerDrawingBase";
import { JsUtil } from "../../Utils/JsUtil";
export var DrawingEvent;
(function (DrawingEvent) {
    DrawingEvent.ARROW_HEAD_RATIO_CHANGED = 'drawingArrowHeadRatioChanged';
    DrawingEvent.ARROW_TAIL_RATIO_CHANGED = 'drawingArrowTailRatioChanged';
    DrawingEvent.TEXT_CHANGED = 'drawingTextChanged';
})(DrawingEvent || (DrawingEvent = {}));
var ArrowDrawingBase = (function (_super) {
    __extends(ArrowDrawingBase, _super);
    function ArrowDrawingBase(chart, config) {
        return _super.call(this, chart, config) || this;
    }
    Object.defineProperty(ArrowDrawingBase.prototype, "text", {
        get: function () {
            return this._options.text || '';
        },
        set: function (value) {
            value = value || '';
            this._setOption('text', value, DrawingEvent.TEXT_CHANGED);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArrowDrawingBase.prototype, "headRatio", {
        get: function () {
            return this._options.headRatio || ArrowDrawingBase.defaults.headRatio;
        },
        set: function (value) {
            if (!JsUtil.isPositiveNumber(value) || value >= 1)
                throw new Error("Value must be in range (0..1).");
            this._setOption('headRatio', value, DrawingEvent.ARROW_HEAD_RATIO_CHANGED);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArrowDrawingBase.prototype, "tailRatio", {
        get: function () {
            return this._options.tailRatio || ArrowDrawingBase.defaults.tailRatio;
        },
        set: function (value) {
            if (!JsUtil.isPositiveNumber(value) || value >= 1)
                throw new Error("Value must be in range (0..1).");
            this._setOption('tailRatio', value, DrawingEvent.ARROW_TAIL_RATIO_CHANGED);
        },
        enumerable: true,
        configurable: true
    });
    ArrowDrawingBase.defaults = {
        size: null,
        headRatio: 0.5,
        tailRatio: 0.5
    };
    return ArrowDrawingBase;
}(GeometricMarkerDrawingBase));
export { ArrowDrawingBase };
//# sourceMappingURL=ArrowDrawingBase.js.map