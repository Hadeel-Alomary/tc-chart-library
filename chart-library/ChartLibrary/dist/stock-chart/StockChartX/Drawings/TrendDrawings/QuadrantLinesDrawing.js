var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Drawing } from "../Drawing";
import { Geometry } from "../../Graphics/Geometry";
import { GestureState } from "../../Gestures/Gesture";
import { DataSeriesSuffix } from "../../Data/DataSeries";
import { ThemedDrawing } from '../ThemedDrawing';
var QuadrantLinesDrawing = (function (_super) {
    __extends(QuadrantLinesDrawing, _super);
    function QuadrantLinesDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(QuadrantLinesDrawing, "className", {
        get: function () {
            return 'quadrantLines';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QuadrantLinesDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 2;
        },
        enumerable: false,
        configurable: true
    });
    QuadrantLinesDrawing.prototype.bounds = function () {
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
    QuadrantLinesDrawing.prototype.hitTest = function (point) {
        if (this.chartPoints.length < 2)
            return false;
        var p = this._drawingPoints;
        for (var i = 0; i < 5; i++) {
            if (Geometry.isPointNearLine(point, p[i][0], p[i][1]))
                return true;
        }
        return false;
    };
    QuadrantLinesDrawing.prototype._handlePanGesture = function (gesture, event) {
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
    QuadrantLinesDrawing.prototype._finishUserDrawing = function () {
        _super.prototype._finishUserDrawing.call(this);
        var points = this.cartesianPoints();
        if (points[0].x > points[1].x) {
            this.chartPoints[0].moveToPoint(points[1], this.projection);
            this.chartPoints[1].moveToPoint(points[0], this.projection);
        }
        this._drawingPoints = this._calculateDrawingPoints(points);
    };
    QuadrantLinesDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints();
        if (points.length === 0)
            return;
        for (var i = 0; i < points.length; ++i) {
            if (!isFinite(points[i].x)) {
                return;
            }
        }
        var context = this.context, theme = this.getDrawingTheme();
        if (points.length > 1) {
            context.beginPath();
            var p = this._drawingPoints = this._calculateDrawingPoints(points);
            this._moveMainLineYPoint(p[2][0].y, p[2][1].y);
            for (var i_1 = 0; i_1 < 5; i_1++) {
                context.moveTo(p[i_1][0].x, p[i_1][0].y);
                context.lineTo(p[i_1][1].x, p[i_1][1].y);
                context.scxStroke(theme.line);
            }
        }
        if (this.selected)
            this._drawSelectionMarkers(this.cartesianPoints());
    };
    QuadrantLinesDrawing.prototype._calculateDrawingPoints = function (points) {
        var point1 = points[0], point2 = points[1], projection = this.projection;
        var r1 = projection.recordByX(point1.x), r2 = projection.recordByX(point2.x);
        var record1 = Math.min(r1, r2), record2 = Math.max(r1, r2);
        var highestHigh = 0;
        var highDataSeries = this.chart.primaryDataSeries(DataSeriesSuffix.HIGH);
        for (var i = record1; i <= record2; i++) {
            var value_1 = highDataSeries.valueAtIndex(i);
            if (value_1 > highestHigh) {
                highestHigh = value_1;
            }
        }
        var lowestLow = highestHigh;
        var lowDataSeries = this.chart.primaryDataSeries(DataSeriesSuffix.LOW);
        for (var i = record1; i <= record2; i++) {
            var value_2 = lowDataSeries.valueAtIndex(i);
            if (value_2 < lowestLow) {
                lowestLow = value_2;
            }
        }
        var value = highestHigh + ((highestHigh - lowestLow) / 4);
        var linesPoints = [];
        for (var i = 0; i < 5; i++) {
            value -= ((highestHigh - lowestLow) / 4);
            var y1 = projection.yByValue(value), y2 = y1, x1 = point1.x, x2 = point2.x;
            linesPoints.push([{ x: x1, y: y1 }, { x: x2, y: y2 }]);
        }
        return linesPoints;
    };
    QuadrantLinesDrawing.prototype._moveMainLineYPoint = function (y1, y2) {
        this.chartPoints[0].moveToY(y1, this.projection);
        this.chartPoints[1].moveToY(y2, this.projection);
    };
    return QuadrantLinesDrawing;
}(ThemedDrawing));
export { QuadrantLinesDrawing };
Drawing.register(QuadrantLinesDrawing);
//# sourceMappingURL=QuadrantLinesDrawing.js.map