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
import { ThemedDrawing } from '../ThemedDrawing';
import { Drawing } from '../Drawing';
import { Geometry } from '../../Graphics/Geometry';
import { GestureState } from '../../Gestures/Gesture';
import { DrawingsHelper } from '../../Helpers/DrawingsHelper';
var GridDrawing = (function (_super) {
    __extends(GridDrawing, _super);
    function GridDrawing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.gridLines = 10;
        return _this;
    }
    Object.defineProperty(GridDrawing, "className", {
        get: function () {
            return 'grid';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 2;
        },
        enumerable: true,
        configurable: true
    });
    GridDrawing.prototype._markerPoints = function () {
        var points = this.cartesianPoints();
        if (points.length === 0) {
            return null;
        }
        return {
            firstPoint: { x: points[0].x, y: points[0].y },
            secondPoint: { x: points[1].x, y: points[1].y },
        };
    };
    GridDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        if (points.length < this.pointsNeeded) {
            return false;
        }
        if (!this.linesPoints) {
            return false;
        }
        var pointsOfLines = this.linesPoints;
        for (var i = 0; i < pointsOfLines.length; i++) {
            var startPoint = pointsOfLines[i][0];
            var endPoint = pointsOfLines[i][1];
            if (Geometry.isPointNearPolyline(point, [startPoint, endPoint]))
                return true;
        }
        return false;
    };
    GridDrawing.prototype._handlePanGesture = function (gesture, event) {
        switch (gesture.state) {
            case GestureState.STARTED:
                if (Geometry.isPointNearPoint(this.cartesianPoint(0), event.pointerPosition))
                    this._setDragPoint(0);
                else if (Geometry.isPointNearPoint(this.cartesianPoint(1), event.pointerPosition))
                    this._setDragPoint(1);
                else
                    return false;
                return true;
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
    GridDrawing.prototype.draw = function () {
        if (!this.visible) {
            return;
        }
        var points = this.cartesianPoints();
        if (points.length === 0)
            return;
        if (points.length > 1) {
            this.drawLines();
        }
        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    };
    GridDrawing.prototype.drawLines = function () {
        var points = this._markerPoints();
        var context = this.context;
        var pointsOfLines = this.linesPoints = this._calculateLinesPoints(points);
        context.beginPath();
        for (var lineNumber = 0; lineNumber < pointsOfLines.length; lineNumber++) {
            var startPoint = { x: pointsOfLines[lineNumber][0].x, y: pointsOfLines[lineNumber][0].y };
            var endPoint = { x: pointsOfLines[lineNumber][1].x, y: pointsOfLines[lineNumber][1].y };
            context.scxStrokePolyline([startPoint, endPoint], this.getDrawingTheme().line);
        }
    };
    GridDrawing.prototype._calculateLinesPoints = function (points) {
        var drawingPoints = [];
        var diffX = points.secondPoint.x - points.firstPoint.x;
        var diffY = points.secondPoint.y - points.firstPoint.y;
        for (var lineNumber = -this.gridLines; lineNumber < this.gridLines; lineNumber++) {
            var startPoint = { x: points.firstPoint.x + diffX * lineNumber, y: points.firstPoint.y - diffY * lineNumber };
            var endPoint = { x: points.secondPoint.x + diffX * lineNumber, y: points.secondPoint.y - diffY * lineNumber };
            var firstExtendedPoint = DrawingsHelper.getExtendedLineEndPoint(endPoint, startPoint, this.chartPanel), secondExtendedPoint = DrawingsHelper.getExtendedLineEndPoint(startPoint, endPoint, this.chartPanel);
            drawingPoints.push([firstExtendedPoint, secondExtendedPoint]);
            startPoint = { x: points.firstPoint.x + diffX * lineNumber, y: points.firstPoint.y + diffY * lineNumber };
            endPoint = { x: points.firstPoint.x + diffX + diffX * lineNumber, y: points.firstPoint.y - diffY + diffY * lineNumber };
            firstExtendedPoint = DrawingsHelper.getExtendedLineEndPoint(endPoint, startPoint, this.chartPanel);
            secondExtendedPoint = DrawingsHelper.getExtendedLineEndPoint(startPoint, endPoint, this.chartPanel);
            drawingPoints.push([firstExtendedPoint, secondExtendedPoint]);
        }
        return drawingPoints;
    };
    return GridDrawing;
}(ThemedDrawing));
export { GridDrawing };
Drawing.register(GridDrawing);
//# sourceMappingURL=GridDrawing.js.map