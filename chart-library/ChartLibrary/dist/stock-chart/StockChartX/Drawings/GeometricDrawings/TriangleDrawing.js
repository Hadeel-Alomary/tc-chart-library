import { __extends } from "tslib";
import { Drawing } from "../Drawing";
import { Geometry } from "../../Graphics/Geometry";
import { GestureState } from "../../Gestures/Gesture";
import { ThemedDrawing } from '../ThemedDrawing';
var TriangleDrawing = (function (_super) {
    __extends(TriangleDrawing, _super);
    function TriangleDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(TriangleDrawing, "className", {
        get: function () {
            return 'triangle';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TriangleDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 3;
        },
        enumerable: false,
        configurable: true
    });
    TriangleDrawing.prototype.bounds = function () {
        var points = this.cartesianPoints();
        if (points.length < this.pointsNeeded)
            return null;
        var left = Math.min(points[0].x, points[1].x, points[2].x), top = Math.min(points[0].y, points[1].y, points[2].y), width = Math.max(points[0].x, points[1].x, points[2].x) - left, height = Math.max(points[0].y, points[1].y, points[2].y) - top;
        return {
            left: left,
            top: top,
            width: width,
            height: height
        };
    };
    TriangleDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        return points.length > 1 && Geometry.isPointNearPolygon(point, points);
    };
    TriangleDrawing.prototype._handlePanGesture = function (gesture, event) {
        switch (gesture.state) {
            case GestureState.STARTED:
                var points = this.cartesianPoints();
                for (var i = 0; i < points.length; i++) {
                    if (Geometry.isPointNearPoint(event.pointerPosition, points[i])) {
                        this._setDragPoint(i);
                        return true;
                    }
                }
                break;
            case GestureState.CONTINUED:
                if (this._dragPoint >= 0) {
                    var magnetChartPoint = this._magnetChartPointIfNeeded(event.pointerPosition);
                    this.chartPoints[this._dragPoint].moveToPoint(magnetChartPoint, this.projection);
                    return true;
                }
                break;
        }
        return false;
    };
    TriangleDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints(), context = this.context, theme = this.getDrawingTheme();
        if (points.length > 1) {
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            for (var i = 1; i < points.length; i++)
                context.lineTo(points[i].x, points[i].y);
            context.closePath();
            context.scxFillStroke(this.getDrawingTheme().fill, this.getDrawingTheme().line);
        }
        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    };
    return TriangleDrawing;
}(ThemedDrawing));
export { TriangleDrawing };
Drawing.register(TriangleDrawing);
//# sourceMappingURL=TriangleDrawing.js.map