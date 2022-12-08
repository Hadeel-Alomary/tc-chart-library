import { __extends } from "tslib";
import { Drawing } from "../Drawing";
import { DrawingCalculationUtil } from "../../Utils/DrawingCalculationUtil";
import { ChannelBase } from './ChannelBase';
var RaffRegressionDrawing = (function (_super) {
    __extends(RaffRegressionDrawing, _super);
    function RaffRegressionDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(RaffRegressionDrawing, "className", {
        get: function () {
            return 'raffRegression';
        },
        enumerable: false,
        configurable: true
    });
    RaffRegressionDrawing.prototype._calculateDrawingPoints = function (points) {
        var point1 = points[0].x < points[1].x ? points[0] : points[1], point2 = points[1].x > points[0].x ? points[1] : points[0], projection = this.projection;
        var r1 = projection.recordByX(point1.x), r2 = projection.recordByX(point2.x);
        var record1 = Math.min(r1, r2), record2 = Math.max(r1, r2);
        var dataSeries = this.chart.primaryBarDataSeries();
        var recordCount = record2 - record1 + 1, values = [];
        for (var i = 0; i < recordCount; i++) {
            values.push(dataSeries.close.valueAtIndex(record1 + i));
        }
        var regression = DrawingCalculationUtil.calculateLinearRegression(values);
        var slope = regression.slope, leftValue = regression.firstValue, rightValue = leftValue + (slope * (recordCount - 1));
        var highGap = 0, lowGap = 0;
        for (var i = record1, j = 0; i < record2; i++, j++) {
            var currentValue = leftValue + slope * j;
            var currentHighGap = dataSeries.high.valueAtIndex(i) - currentValue;
            var currentLowGap = currentValue - dataSeries.low.valueAtIndex(i);
            if (currentHighGap > 0 && currentHighGap > highGap) {
                highGap = currentHighGap;
            }
            if (currentLowGap > 0 && currentLowGap > lowGap) {
                lowGap = currentLowGap;
            }
        }
        var gap = Math.max(highGap, lowGap);
        var y1 = projection.yByValue(leftValue + gap), y2 = projection.yByValue(rightValue + gap), y3 = projection.yByValue(leftValue), y4 = projection.yByValue(rightValue), y5 = projection.yByValue(leftValue - gap), y6 = projection.yByValue(rightValue - gap);
        return [
            { x: point1.x, y: y1 },
            { x: point2.x, y: y2 },
            { x: point1.x, y: y3 },
            { x: point2.x, y: y4 },
            { x: point1.x, y: y5 },
            { x: point2.x, y: y6 }
        ];
    };
    return RaffRegressionDrawing;
}(ChannelBase));
export { RaffRegressionDrawing };
Drawing.register(RaffRegressionDrawing);
//# sourceMappingURL=RaffRegressionDrawing.js.map