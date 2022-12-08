import { __extends } from "tslib";
import { Drawing } from '../Drawing';
import { Geometry } from '../../Graphics/Geometry';
import { GestureState } from '../../Gestures/Gesture';
import { ThemedDrawing } from '../ThemedDrawing';
var RotatedRectangleDrawing = (function (_super) {
    __extends(RotatedRectangleDrawing, _super);
    function RotatedRectangleDrawing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.distanceBeforeRotate = 0;
        _this.rotateState = false;
        return _this;
    }
    Object.defineProperty(RotatedRectangleDrawing, "className", {
        get: function () {
            return 'rotatedRectangle';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RotatedRectangleDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 3;
        },
        enumerable: false,
        configurable: true
    });
    RotatedRectangleDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        if (points.length < this.pointsNeeded) {
            return false;
        }
        var distance = this.calculateDistance();
        var topPoints = this.getTopPoints(distance);
        var bottomPoints = this.getBottomPoints(distance);
        return Geometry.isPointNearPolyline(point, [points[0], points[1]]) ||
            Geometry.isPointNearPolyline(point, topPoints) ||
            Geometry.isPointNearPolyline(point, bottomPoints) ||
            Geometry.isPointNearPolyline(point, [topPoints[1], bottomPoints[1]]) ||
            Geometry.isPointNearPolyline(point, [topPoints[0], bottomPoints[0]]);
    };
    RotatedRectangleDrawing.prototype._markerPoints = function () {
        var points = this.cartesianPoints();
        if (points.length < 2) {
            return points;
        }
        var distance = this.rotateState ? this.distanceBeforeRotate : this.calculateDistance();
        var topPoints = this.getTopPoints(distance);
        var bottomPoints = this.getBottomPoints(distance);
        return [points[0], points[1], topPoints[0], topPoints[1], bottomPoints[0], bottomPoints[1]];
    };
    RotatedRectangleDrawing.prototype.calculateDistance = function () {
        var points = this.cartesianPoints();
        if (points.length != this.pointsNeeded) {
            return 0;
        }
        return Math.abs(this.slope() * points[2].x - points[2].y - this.slope() * points[0].x + points[0].y) / Math.sqrt(Math.pow(this.slope(), 2) + 1);
    };
    RotatedRectangleDrawing.prototype.slope = function () {
        var points = this.cartesianPoints();
        return (points[1].y - points[0].y) / (points[1].x - points[0].x);
    };
    RotatedRectangleDrawing.prototype.draw = function () {
        if (!this.visible) {
            return;
        }
        var points = this.cartesianPoints(), context = this.context, theme = this.getDrawingTheme();
        if (1 < points.length) {
            if (points.length == this.pointsNeeded) {
                this.drawRectangle(context, points, theme);
            }
            else {
                this.drawLine(context, points, theme);
            }
        }
        if (this.selected) {
            this._drawSelectionMarkers(this._markerPoints());
        }
    };
    RotatedRectangleDrawing.prototype.drawLine = function (context, points, theme) {
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        context.lineTo(points[1].x, points[1].y);
        context.scxStroke(theme.line);
    };
    RotatedRectangleDrawing.prototype.drawRectangle = function (context, points, theme) {
        var distance = this.rotateState ? this.distanceBeforeRotate : this.calculateDistance();
        var topPoints = this.getTopPoints(distance);
        var bottomPoints = this.getBottomPoints(distance);
        context.beginPath();
        context.moveTo(topPoints[1].x, topPoints[1].y);
        context.lineTo(topPoints[0].x, topPoints[0].y);
        context.moveTo(topPoints[0].x, topPoints[0].y);
        context.lineTo(bottomPoints[0].x, bottomPoints[0].y);
        context.moveTo(bottomPoints[0].x, bottomPoints[0].y);
        context.lineTo(bottomPoints[1].x, bottomPoints[1].y);
        context.moveTo(bottomPoints[1].x, bottomPoints[1].y);
        context.lineTo(topPoints[1].x, topPoints[1].y);
        context.scxStroke(theme.line);
        context.scxFillPolyLine([bottomPoints[1], bottomPoints[0], topPoints[0], topPoints[1]], theme.fill);
    };
    RotatedRectangleDrawing.prototype._handlePanGesture = function (gesture, event) {
        switch (gesture.state) {
            case GestureState.STARTED:
                var points = this._markerPoints();
                for (var i = 0; i < points.length; i++) {
                    if (Geometry.isPointNearPoint(event.pointerPosition, points[i])) {
                        this._setDragPoint(i);
                        this.rotateState = i < 2;
                        this.distanceBeforeRotate = this.calculateDistance();
                        return true;
                    }
                }
                break;
            case GestureState.CONTINUED:
                if (this._dragPoint >= 0) {
                    var magnetChartPoint = this._magnetChartPointIfNeeded(event.pointerPosition);
                    if (this._dragPoint >= 2) {
                        this.chartPoints[2].moveToPoint(magnetChartPoint, this.projection);
                    }
                    else {
                        this.chartPoints[this._dragPoint].moveToPoint(magnetChartPoint, this.projection);
                    }
                    return true;
                }
                break;
            case GestureState.FINISHED:
                if (this.rotateState) {
                    var point = this._markerPoints()[2];
                    this.chartPoints[2].moveTo(point.x, point.y, this.projection);
                    this.rotateState = false;
                }
                break;
        }
    };
    RotatedRectangleDrawing.prototype.getTopPoints = function (distance) {
        var points = this.cartesianPoints();
        if (this.slope() == 0) {
            return [
                { x: points[1].x, y: points[1].y + distance },
                { x: points[0].x, y: points[0].y + distance }
            ];
        }
        else {
            var x3 = points[1].x + Math.sqrt(Math.pow(distance, 2) / (1 + (1 / Math.pow(this.slope(), 2))));
            var y3 = (-1 / this.slope()) * (x3 - points[1].x) + points[1].y;
            var x4 = points[0].x + Math.sqrt(Math.pow(distance, 2) / (1 + (1 / Math.pow(this.slope(), 2))));
            var y4 = (-1 / this.slope()) * (x4 - points[0].x) + points[0].y;
            return [
                { x: x3, y: y3 },
                { x: x4, y: y4 }
            ];
        }
    };
    RotatedRectangleDrawing.prototype.getBottomPoints = function (distance) {
        var points = this.cartesianPoints();
        if (this.slope() == 0) {
            return [
                { x: points[1].x, y: points[1].y - distance },
                { x: points[0].x, y: points[0].y - distance }
            ];
        }
        else {
            var x5 = points[1].x - Math.sqrt(Math.pow(distance, 2) / (1 + (1 / Math.pow(this.slope(), 2))));
            var y5 = (-1 / this.slope()) * (x5 - points[1].x) + points[1].y;
            var x6 = points[0].x - Math.sqrt(Math.pow(distance, 2) / (1 + (1 / Math.pow(this.slope(), 2))));
            var y6 = (-1 / this.slope()) * (x6 - points[0].x) + points[0].y;
            return [
                { x: x5, y: y5 },
                { x: x6, y: y6 }
            ];
        }
    };
    RotatedRectangleDrawing.prototype.canControlPointsBeManuallyChanged = function () {
        return false;
    };
    return RotatedRectangleDrawing;
}(ThemedDrawing));
export { RotatedRectangleDrawing };
Drawing.register(RotatedRectangleDrawing);
//# sourceMappingURL=RotatedRectangleDrawing.js.map