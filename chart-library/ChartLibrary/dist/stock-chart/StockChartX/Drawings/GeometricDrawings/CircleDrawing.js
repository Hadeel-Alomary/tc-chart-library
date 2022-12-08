import { __extends } from "tslib";
import { Drawing } from "../Drawing";
import { Geometry } from "../../Graphics/Geometry";
import { GestureState } from "../../Gestures/Gesture";
import { ThemedDrawing } from '../ThemedDrawing';
var CircleDrawing = (function (_super) {
    __extends(CircleDrawing, _super);
    function CircleDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(CircleDrawing, "className", {
        get: function () {
            return 'circle';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CircleDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 2;
        },
        enumerable: false,
        configurable: true
    });
    CircleDrawing.prototype.bounds = function () {
        var points = this.cartesianPoints();
        if (points.length < this.pointsNeeded)
            return null;
        var radius = Geometry.length(points[0], points[1]);
        return {
            left: points[0].x - radius,
            top: points[0].y - radius,
            width: 2 * radius,
            height: 2 * radius
        };
    };
    CircleDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        return points.length > 1 && Geometry.isPointNearCircle(point, points[0], points[1]);
    };
    CircleDrawing.prototype._handlePanGesture = function (gesture, event) {
        switch (gesture.state) {
            case GestureState.STARTED:
                var markerPoints = this._markerPoints();
                if (markerPoints && markerPoints.length > 1) {
                    for (var i = 0; i < markerPoints.length; i++) {
                        if (Geometry.isPointNearPoint(event.pointerPosition, markerPoints[i])) {
                            this._setDragPoint(i);
                            return true;
                        }
                    }
                }
                break;
            case GestureState.CONTINUED:
                if (this._dragPoint >= 0) {
                    var magnetChartPoint = this._magnetChartPointIfNeeded(event.pointerPosition);
                    this.chartPoints[1].moveToPoint(magnetChartPoint, this.projection);
                    return true;
                }
                break;
        }
        return false;
    };
    CircleDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints(), context = this.context, theme = this.getDrawingTheme();
        if (points.length > 1) {
            var radius = Geometry.length(points[0], points[1]);
            context.beginPath();
            context.arc(points[0].x, points[0].y, radius, 0, 2 * Math.PI);
            context.scxFillStroke(this.getDrawingTheme().fill, this.getDrawingTheme().line);
        }
        if (this.selected) {
            var markers = this._markerPoints(points);
            this._drawSelectionMarkers(markers);
        }
    };
    CircleDrawing.prototype._markerPoints = function (points) {
        points = points || this.cartesianPoints();
        if (points.length === 0)
            return null;
        var center = points[0];
        if (points.length === 1)
            return [{ x: center.x, y: center.y }];
        var radius = Geometry.length(points[0], points[1]);
        return [
            { x: center.x - radius, y: center.y },
            { x: center.x, y: center.y - radius },
            { x: center.x + radius, y: center.y },
            { x: center.x, y: center.y + radius },
        ];
    };
    CircleDrawing.prototype.canControlPointsBeManuallyChanged = function () {
        return false;
    };
    return CircleDrawing;
}(ThemedDrawing));
export { CircleDrawing };
Drawing.register(CircleDrawing);
//# sourceMappingURL=CircleDrawing.js.map