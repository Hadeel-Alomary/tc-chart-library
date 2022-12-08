import { __extends } from "tslib";
import { Geometry } from "../../Graphics/Geometry";
import { ThemedDrawing } from '../ThemedDrawing';
export var DrawingEvent;
(function (DrawingEvent) {
    DrawingEvent.SIZE_CHANGED = 'drawingSizeChanged';
})(DrawingEvent || (DrawingEvent = {}));
var GeometricMarkerDrawingBase = (function (_super) {
    __extends(GeometricMarkerDrawingBase, _super);
    function GeometricMarkerDrawingBase(chart, config) {
        return _super.call(this, chart, config) || this;
    }
    Object.defineProperty(GeometricMarkerDrawingBase, "subClassName", {
        get: function () {
            return 'abstractMarker';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GeometricMarkerDrawingBase.prototype, "size", {
        get: function () {
            return this._options.size || GeometricMarkerDrawingBase.defaults.size;
        },
        set: function (value) {
            this._setOption('size', value, DrawingEvent.SIZE_CHANGED);
        },
        enumerable: false,
        configurable: true
    });
    GeometricMarkerDrawingBase.prototype.hitTest = function (point) {
        var bounds = this.bounds();
        return bounds && Geometry.isPointInsideOrNearRect(point, bounds);
    };
    GeometricMarkerDrawingBase.defaults = {
        size: {
            width: 20,
            height: 20
        }
    };
    return GeometricMarkerDrawingBase;
}(ThemedDrawing));
export { GeometricMarkerDrawingBase };
//# sourceMappingURL=GeometricMarkerDrawingBase.js.map