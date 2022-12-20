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
import { Drawing, DrawingDragPoint } from '../Drawing';
import { Geometry } from '../../Graphics/Geometry';
import { GestureState } from '../../Gestures/Gesture';
import { ThemedDrawing } from '../ThemedDrawing';
var DisjointAngleDrawing = (function (_super) {
    __extends(DisjointAngleDrawing, _super);
    function DisjointAngleDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(DisjointAngleDrawing, "className", {
        get: function () {
            return 'disjointAngle';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisjointAngleDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 3;
        },
        enumerable: true,
        configurable: true
    });
    DisjointAngleDrawing.prototype.onMoveChartPointInUserDrawingState = function () {
        if (this.pointsCompleted()) {
            this.chartPoints[2].date = this.chartPoints[1].date;
        }
    };
    DisjointAngleDrawing.prototype.onAddNewChartPointInUserDrawingState = function () {
        if (this.pointsCompleted()) {
            this.chartPoints[2].date = this.chartPoints[1].date;
        }
    };
    DisjointAngleDrawing.prototype.hitTest = function (point) {
        if (!this.pointsCompleted()) {
            return false;
        }
        var markerPoints = this._markerPoints();
        return Geometry.isPointNearPolyline(point, [markerPoints[0], markerPoints[1]]) ||
            Geometry.isPointNearPolyline(point, [markerPoints[2], markerPoints[3]]);
    };
    DisjointAngleDrawing.prototype._markerPoints = function () {
        var points = this.cartesianPoints();
        if (this.pointsCompleted()) {
            var distance = points[1].y - points[0].y;
            return [
                { x: points[0].x, y: points[0].y },
                { x: points[1].x, y: points[1].y },
                { x: points[2].x, y: points[2].y },
                { x: points[0].x, y: points[2].y + distance },
            ];
        }
        else {
            return points;
        }
    };
    DisjointAngleDrawing.prototype.draw = function () {
        if (!this.visible) {
            return;
        }
        var points = this._markerPoints(), context = this.context, theme = this.getDrawingTheme();
        if (1 < points.length) {
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            context.lineTo(points[1].x, points[1].y);
            if (this.pointsCompleted()) {
                context.moveTo(points[2].x, points[2].y);
                context.lineTo(points[3].x, points[3].y);
                context.scxStroke(this.getDrawingTheme().line);
                context.scxFillPolyLine(points, this.getDrawingTheme().fill);
            }
            else {
                context.scxStroke(this.getDrawingTheme().line);
            }
        }
        if (this.selected) {
            this._drawSelectionMarkers(this._markerPoints());
        }
    };
    DisjointAngleDrawing.prototype.savePointsBeforeDragging = function (points) {
        var _this = this;
        this.beforeDraggingCartesianPoints = [];
        points.forEach(function (point) {
            _this.beforeDraggingCartesianPoints.push({ x: point.x, y: point.y });
        });
    };
    DisjointAngleDrawing.prototype._handlePanGesture = function (gesture, event) {
        switch (gesture.state) {
            case GestureState.STARTED:
                var points = this._markerPoints();
                var cartesianPoints = this._markerPoints();
                for (var i = 0; i < points.length; i++) {
                    if (Geometry.isPointNearPoint(event.pointerPosition, points[i])) {
                        this._setDragPoint(i);
                        this.savePointsBeforeDragging(this._markerPoints());
                        return true;
                    }
                }
                break;
            case GestureState.CONTINUED:
                if (this._dragPoint >= 0) {
                    var magnetChartPoint = this._magnetChartPointIfNeeded(event.pointerPosition);
                    if (this._dragPoint >= 0) {
                        switch (this._dragPoint) {
                            case 0:
                                this.chartPoints[0].moveToPoint(magnetChartPoint, this.projection);
                                break;
                            case 1:
                                this.chartPoints[1].moveToPoint(magnetChartPoint, this.projection);
                                var point1YDiff = this.beforeDraggingCartesianPoints[1].y - this.cartesianPoints()[1].y;
                                this.chartPoints[2].moveToX(magnetChartPoint.x, this.projection);
                                this.chartPoints[2].moveToY(this.beforeDraggingCartesianPoints[2].y + point1YDiff, this.projection);
                                break;
                            case 2:
                                this.chartPoints[2].moveToY(magnetChartPoint.y, this.projection);
                                break;
                            case 3:
                                var point3YDiff = this.beforeDraggingCartesianPoints[3].y - magnetChartPoint.y;
                                this.chartPoints[0].moveToY(this.beforeDraggingCartesianPoints[0].y + point3YDiff, this.projection);
                                break;
                        }
                    }
                    return true;
                }
                break;
            case GestureState.FINISHED:
                this._setDragPoint(DrawingDragPoint.NONE);
                break;
        }
    };
    DisjointAngleDrawing.prototype.canControlPointsBeManuallyChanged = function () {
        return false;
    };
    return DisjointAngleDrawing;
}(ThemedDrawing));
export { DisjointAngleDrawing };
Drawing.register(DisjointAngleDrawing);
//# sourceMappingURL=DisjointAngleDrawing.js.map