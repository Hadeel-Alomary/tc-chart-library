import { __extends } from "tslib";
import { Drawing } from "../Drawing";
import { Geometry } from "../../Graphics/Geometry";
import { GestureState } from "../../Gestures/Gesture";
import { ThemedDrawing } from '../ThemedDrawing';
var EllipseDrawing = (function (_super) {
    __extends(EllipseDrawing, _super);
    function EllipseDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(EllipseDrawing, "className", {
        get: function () {
            return 'ellipse';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EllipseDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 2;
        },
        enumerable: false,
        configurable: true
    });
    EllipseDrawing.prototype._markerPoints = function (points) {
        points = points || this.cartesianPoints();
        if (points.length === 0)
            return null;
        var center = points[0];
        if (points.length === 1)
            return [{ x: center.x, y: center.y }];
        var horRadius = Geometry.xProjectionLength(points[0], points[1]), verRadius = Geometry.yProjectionLength(points[0], points[1]);
        return [
            { x: center.x - horRadius, y: center.y },
            { x: center.x, y: center.y - verRadius },
            { x: center.x + horRadius, y: center.y },
            { x: center.x, y: center.y + verRadius },
        ];
    };
    EllipseDrawing.prototype.bounds = function () {
        var points = this.cartesianPoints();
        if (points.length < this.pointsNeeded)
            return null;
        var horRadius = Geometry.xProjectionLength(points[0], points[1]), verRadius = Geometry.yProjectionLength(points[0], points[1]);
        return {
            left: points[0].x - horRadius,
            top: points[0].y - verRadius,
            width: 2 * horRadius,
            height: 2 * verRadius
        };
    };
    EllipseDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        return points.length > 1 && Geometry.isPointNearEllipse(point, points[0], points[1]);
    };
    EllipseDrawing.prototype._handlePanGesture = function (gesture, event) {
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
                    switch (this._dragPoint) {
                        case 0:
                        case 2:
                            this.chartPoints[1].moveToX(magnetChartPoint.x, this.projection);
                            break;
                        case 1:
                        case 3:
                            this.chartPoints[1].moveToY(magnetChartPoint.y, this.projection);
                            break;
                    }
                    return true;
                }
                break;
        }
        return false;
    };
    EllipseDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints(), context = this.chartPanel.context, theme = this.getDrawingTheme();
        if (points.length > 1) {
            var horRadius = Geometry.xProjectionLength(points[0], points[1]), verRadius = Geometry.yProjectionLength(points[0], points[1]);
            context.beginPath();
            context.save();
            context.translate(points[0].x, points[0].y);
            if (horRadius !== verRadius)
                context.scale(1, verRadius / horRadius);
            context.arc(0, 0, horRadius, 0, 2 * Math.PI);
            context.restore();
            context.closePath();
            context.scxFillStroke(this.getDrawingTheme().fill, this.getDrawingTheme().line);
        }
        if (this.selected) {
            var markers = this._markerPoints(points);
            this._drawSelectionMarkers(markers);
        }
    };
    return EllipseDrawing;
}(ThemedDrawing));
export { EllipseDrawing };
Drawing.register(EllipseDrawing);
//# sourceMappingURL=EllipseDrawing.js.map