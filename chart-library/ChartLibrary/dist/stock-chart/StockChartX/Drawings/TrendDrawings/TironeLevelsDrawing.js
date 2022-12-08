import { __extends } from "tslib";
import { Drawing } from "../Drawing";
import { Geometry } from "../../Graphics/Geometry";
import { GestureState } from "../../Gestures/Gesture";
import { DataSeriesSuffix } from "../../Data/DataSeries";
import { ThemedDrawing } from '../ThemedDrawing';
var TironeLevelsDrawing = (function (_super) {
    __extends(TironeLevelsDrawing, _super);
    function TironeLevelsDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(TironeLevelsDrawing, "className", {
        get: function () {
            return 'tironeLevels';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TironeLevelsDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 2;
        },
        enumerable: false,
        configurable: true
    });
    TironeLevelsDrawing.prototype.bounds = function () {
        var points = this.cartesianPoints();
        if (points.length < this.pointsNeeded)
            return null;
        return {
            left: points[0].x,
            top: points[0].y,
            width: points[1].x - points[0].x,
            height: points[1].y - points[0].y
        };
    };
    TironeLevelsDrawing.prototype.hitTest = function (point) {
        if (this.chartPoints.length < this.pointsNeeded)
            return false;
        var p = this._drawingPoints;
        return Geometry.isPointNearLine(point, p[0], p[1]) ||
            Geometry.isPointNearLine(point, p[2], p[3]) ||
            Geometry.isPointNearLine(point, p[4], p[5]);
    };
    TironeLevelsDrawing.prototype._handlePanGesture = function (gesture, event) {
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
    TironeLevelsDrawing.prototype._finishUserDrawing = function () {
        _super.prototype._finishUserDrawing.call(this);
        var points = this.cartesianPoints();
        if (points[0].x > points[1].x) {
            this.chartPoints[0].moveToPoint(points[1], this.projection);
            this.chartPoints[1].moveToPoint(points[0], this.projection);
        }
        this._drawingPoints = this._calculateDrawingPoints(points);
    };
    TironeLevelsDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints();
        if (points.length === 0)
            return;
        var context = this.context, theme = this.getDrawingTheme();
        if (points.length > 1) {
            context.beginPath();
            var p = this._drawingPoints = this._calculateDrawingPoints(points);
            this._moveMainLineYPoint(p[2].y, p[3].y);
            context.moveTo(p[0].x, p[0].y);
            context.lineTo(p[1].x, p[1].y);
            context.moveTo(p[2].x, p[2].y);
            context.lineTo(p[3].x, p[3].y);
            context.moveTo(p[4].x, p[4].y);
            context.lineTo(p[5].x, p[5].y);
            context.scxStroke(theme.line);
            points = this._getMainLinePoints();
        }
        if (this.selected)
            this._drawSelectionMarkers(points);
    };
    TironeLevelsDrawing.prototype._calculateDrawingPoints = function (points) {
        var point1 = points[0], point2 = points[1], projection = this.projection, r1 = projection.recordByX(point1.x), r2 = projection.recordByX(point2.x);
        var record1 = Math.min(r1, r2), record2 = Math.max(r1, r2);
        var high = this.chart.primaryDataSeries(DataSeriesSuffix.HIGH), highestHigh = 0;
        for (var i = record1; i < record2; i++) {
            var value_1 = high.valueAtIndex(i);
            if (value_1 > highestHigh) {
                highestHigh = value_1;
            }
        }
        var low = this.chart.primaryDataSeries(DataSeriesSuffix.LOW), lowestLow = highestHigh;
        for (var i = record1; i < record2; i++) {
            var value_2 = low.valueAtIndex(i);
            if (value_2 < lowestLow) {
                lowestLow = value_2;
            }
        }
        var value = highestHigh - ((highestHigh - lowestLow) / 3);
        var y1 = projection.yByValue(value), y2 = y1;
        value = lowestLow + (highestHigh - lowestLow) / 2;
        var y3 = projection.yByValue(value), y4 = y3;
        value = lowestLow + (highestHigh - lowestLow) / 3;
        var y5 = projection.yByValue(value), y6 = y5;
        return [
            { x: point1.x, y: y1 },
            { x: point2.x, y: y2 },
            { x: point1.x, y: y3 },
            { x: point2.x, y: y4 },
            { x: point1.x, y: y5 },
            { x: point2.x, y: y6 }
        ];
    };
    TironeLevelsDrawing.prototype._getMainLinePoints = function () {
        return [
            this._drawingPoints[2],
            this._drawingPoints[3]
        ];
    };
    TironeLevelsDrawing.prototype._moveMainLineYPoint = function (y1, y2) {
        this.chartPoints[0].moveToY(y1, this.projection);
        this.chartPoints[1].moveToY(y2, this.projection);
    };
    return TironeLevelsDrawing;
}(ThemedDrawing));
export { TironeLevelsDrawing };
Drawing.register(TironeLevelsDrawing);
//# sourceMappingURL=TironeLevelsDrawing.js.map