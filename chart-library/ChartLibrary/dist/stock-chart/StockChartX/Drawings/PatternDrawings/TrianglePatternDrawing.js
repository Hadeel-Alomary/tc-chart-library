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
var TrianglePatternDrawing = (function (_super) {
    __extends(TrianglePatternDrawing, _super);
    function TrianglePatternDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(TrianglePatternDrawing, "className", {
        get: function () {
            return 'trianglePattern';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TrianglePatternDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 4;
        },
        enumerable: true,
        configurable: true
    });
    TrianglePatternDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        var extendedTrianglePoints = this.getExtendedTrianglePoints();
        return points.length > 1 && Geometry.isPointNearPolyline(point, points) ||
            Geometry.isPointNearPolyline(point, extendedTrianglePoints) ||
            Geometry.isPointNearPolyline(point, [extendedTrianglePoints[0], extendedTrianglePoints[2]]);
    };
    TrianglePatternDrawing.prototype._handlePanGesture = function (gesture, event) {
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
            case GestureState.FINISHED:
                if (this._dragPoint) {
                    this._setDragPoint(DrawingDragPoint.NONE);
                    return true;
                }
                break;
        }
        return false;
    };
    TrianglePatternDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints();
        if (points.length > 1) {
            this.context.beginPath();
            this.context.scxStrokePolyline(points, this.getDrawingTheme().line);
            this.drawTextInBox(this.getDrawingTheme().line, points[0], 'A', points[1].y > points[0].y);
            this.drawTextInBox(this.getDrawingTheme().line, points[1], 'B', points[0].y > points[1].y);
            if (points.length == this.pointsNeeded - 1 || points.length == this.pointsNeeded) {
                this.drawTextInBox(this.getDrawingTheme().line, points[2], 'C', points[1].y > points[2].y);
            }
            if (points.length == this.pointsNeeded) {
                this.drawTextInBox(this.getDrawingTheme().line, points[3], 'D', points[2].y > points[3].y);
                this.drawTriangle();
            }
        }
        if (this.selected)
            this._drawSelectionMarkers(points);
    };
    TrianglePatternDrawing.prototype.drawTriangle = function () {
        var extendedTrianglePoints = this.getExtendedTrianglePoints();
        this.drawLine(extendedTrianglePoints[2], extendedTrianglePoints[0]);
        this.drawLine(extendedTrianglePoints[2], extendedTrianglePoints[1]);
        this.drawLine(extendedTrianglePoints[0], extendedTrianglePoints[1]);
        this.context.scxFillPolyLine([extendedTrianglePoints[2], extendedTrianglePoints[0], extendedTrianglePoints[1]], this.getDrawingTheme().fill);
        this.context.scxStroke(this.getDrawingTheme().line);
    };
    TrianglePatternDrawing.prototype.getExtendedTrianglePoints = function () {
        var points = this.cartesianPoints();
        var sortedPoints = this.getSortedPoints();
        var slopePoint02 = this.slope(points[0], points[2]);
        var slopePoint13 = this.slope(points[1], points[3]);
        var trianglePoint1X = (((points[0].x * slopePoint02) - points[0].y - (points[1].x * slopePoint13) + points[1].y) / (slopePoint02 - slopePoint13));
        var trianglePoint1Y = (trianglePoint1X - points[1].x) * slopePoint13 + points[1].y;
        var trianglePoint3;
        var trianglePoint2Y = 0;
        if (trianglePoint1X >= sortedPoints[0].x) {
            trianglePoint3 = sortedPoints[0];
        }
        else {
            trianglePoint3 = sortedPoints[sortedPoints.length - 1];
        }
        if (points[0].x == trianglePoint3.x || points[2].x == trianglePoint3.x) {
            trianglePoint2Y = (trianglePoint3.x - points[1].x) * slopePoint13 + points[1].y;
        }
        else {
            trianglePoint2Y = (trianglePoint3.x - points[0].x) * slopePoint02 + points[0].y;
        }
        return [
            { x: trianglePoint1X, y: trianglePoint1Y },
            { x: trianglePoint3.x, y: trianglePoint2Y },
            { x: trianglePoint3.x, y: trianglePoint3.y }
        ];
    };
    TrianglePatternDrawing.prototype.drawLine = function (point1, point2) {
        var context = this.context;
        context.moveTo(point1.x, point1.y);
        context.lineTo(point2.x, point2.y);
    };
    TrianglePatternDrawing.prototype.slope = function (point1, point2) {
        return (point2.y - point1.y) / (point2.x - point1.x);
    };
    TrianglePatternDrawing.prototype.getSortedPoints = function () {
        var points = this.cartesianPoints();
        var listOfPoints = [points[0], points[1], points[2], points[3]];
        var sortedPoints = listOfPoints.sort(function (a, b) {
            if (a.x < b.x)
                return -1;
            if (a.x > b.x)
                return 1;
            return 0;
        });
        return sortedPoints;
    };
    return TrianglePatternDrawing;
}(ThemedDrawing));
export { TrianglePatternDrawing };
Drawing.register(TrianglePatternDrawing);
//# sourceMappingURL=TrianglePatternDrawing.js.map