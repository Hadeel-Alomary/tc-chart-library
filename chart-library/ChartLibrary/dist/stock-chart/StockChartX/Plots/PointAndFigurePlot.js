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
import { BarPlot } from "./BarPlot";
import { Geometry } from "../Graphics/Geometry";
var PointAndFigurePlot = (function (_super) {
    __extends(PointAndFigurePlot, _super);
    function PointAndFigurePlot() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(PointAndFigurePlot.prototype, "boxSize", {
        get: function () {
            return this._boxSize;
        },
        set: function (value) {
            this._boxSize = value;
        },
        enumerable: false,
        configurable: true
    });
    PointAndFigurePlot.prototype.draw = function () {
        if (!this.visible)
            return;
        var params = this._barDrawParams();
        if (params.values.length === 0)
            return;
        params.context.beginPath();
        this._drawColumns(params, true);
        params.context.scxStroke(params.theme.upCandle.border);
        this._drawColumns(params, false);
    };
    PointAndFigurePlot.prototype._drawColumns = function (params, drawXColumns) {
        var context = params.context, projection = params.projection, boxSize = this.boxSize, columnWidth = this.chart.dateScale.columnWidth, barWidth = Math.max(columnWidth * this.columnWidthRatio, this.minWidth), halfBarWidth = Math.round(barWidth / 2), theme = drawXColumns ? null : params.theme.downCandle.border;
        for (var i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            var open_1 = params.open[i], close_1 = params.close[i];
            if (open_1 == null || close_1 == null)
                continue;
            var isRaisingBar = close_1 >= open_1;
            if (drawXColumns !== isRaisingBar)
                continue;
            var x = params.dates ? projection.xByDate(params.dates[i]) : projection.xByColumn(column), low = params.low[i], high = params.high[i];
            while (high - low > 1E-6) {
                var yLow = projection.yByValue(low), yHigh = projection.yByValue(low + boxSize);
                if (drawXColumns) {
                    context.moveTo(x - halfBarWidth, yLow);
                    context.lineTo(x + halfBarWidth, yHigh);
                    context.moveTo(x - halfBarWidth, yHigh);
                    context.lineTo(x + halfBarWidth, yLow);
                }
                else {
                    var horRadius = halfBarWidth, verRadius = (yHigh - yLow) / 2;
                    context.beginPath();
                    context.save();
                    context.translate(x, (yLow + yHigh) / 2);
                    if (horRadius !== verRadius)
                        context.scale(1, verRadius / horRadius);
                    context.arc(0, 0, horRadius, 0, 2 * Math.PI);
                    context.restore();
                    context.closePath();
                    context.scxStroke(theme);
                }
                low += boxSize;
            }
        }
    };
    PointAndFigurePlot.prototype.hitTest = function (point) {
        var params = this._barDrawParams();
        if (params.values.length === 0)
            return false;
        var projection = params.projection, boxSize = this.boxSize, columnWidth = this.chart.dateScale.columnWidth, barWidth = Math.max(columnWidth * this.columnWidthRatio, this.minWidth), halfBarWidth = Math.round(barWidth / 2);
        for (var i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            var open_2 = params.open[i], close_2 = params.close[i], low = params.low[i], high = params.high[i];
            if (open_2 == null || close_2 == null)
                continue;
            var x = params.dates ? projection.xByDate(params.dates[i]) : projection.xByColumn(column);
            if (x - halfBarWidth <= point.x && x + halfBarWidth >= point.x) {
                while (high - low > 1E-6) {
                    var yLow = projection.yByValue(low), yHigh = projection.yByValue(low + boxSize);
                    var rectanglePoint1 = { x: x - halfBarWidth, y: yLow };
                    var rectanglePoint2 = { x: x + halfBarWidth, y: yHigh };
                    if (Geometry.isPointInsideOrNearRectPoints(point, rectanglePoint1, rectanglePoint2))
                        return true;
                    low += boxSize;
                }
            }
        }
    };
    return PointAndFigurePlot;
}(BarPlot));
export { PointAndFigurePlot };
//# sourceMappingURL=PointAndFigurePlot.js.map