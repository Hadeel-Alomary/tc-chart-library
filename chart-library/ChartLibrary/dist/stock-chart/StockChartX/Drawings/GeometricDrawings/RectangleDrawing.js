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
import { Drawing } from "../Drawing";
import { Geometry } from "../../Graphics/Geometry";
import { GestureState } from "../../Gestures/Gesture";
import { ThemedDrawing } from '../ThemedDrawing';
var RectangleDrawing = (function (_super) {
    __extends(RectangleDrawing, _super);
    function RectangleDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(RectangleDrawing, "className", {
        get: function () {
            return 'rectangle';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RectangleDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 2;
        },
        enumerable: true,
        configurable: true
    });
    RectangleDrawing.prototype.bounds = function () {
        var points = this.cartesianPoints();
        if (points.length < this.pointsNeeded)
            return null;
        return {
            left: Math.min(points[0].x, points[1].x),
            top: Math.min(points[0].y, points[1].y),
            width: Math.abs(points[0].x - points[1].x),
            height: Math.abs(points[0].y - points[1].y)
        };
    };
    RectangleDrawing.prototype._markerPoints = function (rect) {
        if (!rect)
            rect = this.bounds();
        if (!rect) {
            var point = this.cartesianPoint(0);
            return point && [point];
        }
        var midX = Math.round(rect.left + rect.width / 2), midY = Math.round(rect.top + rect.height / 2), right = rect.left + rect.width, bottom = rect.top + rect.height;
        return [
            { x: rect.left, y: rect.top },
            { x: midX, y: rect.top },
            { x: right, y: rect.top },
            { x: right, y: midY },
            { x: right, y: bottom },
            { x: midX, y: bottom },
            { x: rect.left, y: bottom },
            { x: rect.left, y: midY },
        ];
    };
    RectangleDrawing.prototype._normalizePoints = function () {
        var rect = this.bounds();
        if (rect) {
            var projection = this.projection, points = this.chartPoints;
            points[0].moveTo(rect.left, rect.top, projection);
            points[1].moveTo(rect.left + rect.width, rect.top + rect.height, projection);
        }
    };
    RectangleDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        return points.length > 1 && Geometry.isPointNearRectPoints(point, points[0], points[1]);
    };
    RectangleDrawing.prototype._handlePanGesture = function (gesture, event) {
        switch (gesture.state) {
            case GestureState.STARTED:
                this._normalizePoints();
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
                    var projection = this.projection, points = this.chartPoints;
                    switch (this._dragPoint) {
                        case 0:
                            points[0].moveTo(magnetChartPoint.x, magnetChartPoint.y, projection);
                            break;
                        case 1:
                            points[0].moveToY(magnetChartPoint.y, projection);
                            break;
                        case 2:
                            points[0].moveToY(magnetChartPoint.y, projection);
                            points[1].moveToX(magnetChartPoint.x, projection);
                            break;
                        case 3:
                            points[1].moveToX(magnetChartPoint.x, projection);
                            break;
                        case 4:
                            points[1].moveTo(magnetChartPoint.x, magnetChartPoint.y, projection);
                            break;
                        case 5:
                            points[1].moveToY(magnetChartPoint.y, projection);
                            break;
                        case 6:
                            points[0].moveToX(magnetChartPoint.x, projection);
                            points[1].moveToY(magnetChartPoint.y, projection);
                            break;
                        case 7:
                            points[0].moveToX(magnetChartPoint.x, projection);
                            break;
                    }
                    return true;
                }
                break;
        }
        return false;
    };
    RectangleDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var rect = this.bounds(), context = this.context, theme = this.getDrawingTheme();
        if (rect) {
            context.beginPath();
            context.rect(rect.left, rect.top, rect.width, rect.height);
            context.scxFillStroke(this.getDrawingTheme().fill, this.getDrawingTheme().line);
        }
        if (this.selected) {
            var points = this._markerPoints(rect);
            this._drawSelectionMarkers(points);
        }
    };
    return RectangleDrawing;
}(ThemedDrawing));
export { RectangleDrawing };
Drawing.register(RectangleDrawing);
//# sourceMappingURL=RectangleDrawing.js.map