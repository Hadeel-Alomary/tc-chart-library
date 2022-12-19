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
import { DrawingCalculationUtil } from "../../Utils/DrawingCalculationUtil";
import { ChannelBase } from './ChannelBase';
var ErrorChannelDrawing = (function (_super) {
    __extends(ErrorChannelDrawing, _super);
    function ErrorChannelDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ErrorChannelDrawing, "className", {
        get: function () {
            return 'errorChannel';
        },
        enumerable: false,
        configurable: true
    });
    ErrorChannelDrawing.prototype._calculateDrawingPoints = function (points) {
        var point1 = points[0].x < points[1].x ? points[0] : points[1], point2 = points[1].x > points[0].x ? points[1] : points[0], projection = this.projection, dataSeries = this.chart.primaryBarDataSeries();
        var r1 = projection.recordByX(point1.x), r2 = projection.recordByX(point2.x);
        var record1 = Math.min(r1, r2), record2 = Math.max(r1, r2);
        var high = dataSeries.high, highestHigh = 0;
        for (var i = record1; i < record2; i++) {
            if (high.valueAtIndex(i) > highestHigh) {
                highestHigh = high.valueAtIndex(i);
            }
        }
        var low = dataSeries.low, lowestLow = highestHigh;
        for (var i = record1; i < record2; i++) {
            if (low.valueAtIndex(i) < lowestLow) {
                lowestLow = low.valueAtIndex(i);
            }
        }
        var range = (highestHigh - lowestLow) * 0.5, recordCount = record2 - record1 + 1, values = [];
        for (var i = 0; i < recordCount; i++) {
            values.push(dataSeries.low.valueAtIndex(record1 + i));
        }
        var regression = DrawingCalculationUtil.calculateLinearRegression(values);
        var slope = regression.slope, leftValue = regression.firstValue, rightValue = leftValue + (slope * (recordCount - 1));
        var y1 = projection.yByValue(leftValue + range), y2 = projection.yByValue(rightValue + range), y3 = projection.yByValue(leftValue), y4 = projection.yByValue(rightValue), y5 = projection.yByValue(leftValue - range), y6 = projection.yByValue(rightValue - range);
        return [
            { x: point1.x, y: y1 },
            { x: point2.x, y: y2 },
            { x: point1.x, y: y3 },
            { x: point2.x, y: y4 },
            { x: point1.x, y: y5 },
            { x: point2.x, y: y6 }
        ];
    };
    return ErrorChannelDrawing;
}(ChannelBase));
export { ErrorChannelDrawing };
Drawing.register(ErrorChannelDrawing);
//# sourceMappingURL=ErrorChannelDrawing.js.map