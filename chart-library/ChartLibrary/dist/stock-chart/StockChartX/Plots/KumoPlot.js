import { __extends } from "tslib";
import { Plot } from "./Plot";
var KumoPlot = (function (_super) {
    __extends(KumoPlot, _super);
    function KumoPlot(chart, config) {
        var _this = _super.call(this, chart, config) || this;
        if (!KumoPlot.pattern) {
            KumoPlot.pattern = document.createElement('canvas');
        }
        return _this;
    }
    KumoPlot.prototype.draw = function () {
        if (!this.visible)
            return;
        var params = this._barDrawParams();
        if (params.values.length === 0)
            return;
        var context = this.context, projection = this.projection, x, y, value;
        context.beginPath();
        value = this.dataSeries[0].values[params.startIndex];
        x = projection.xByRecord(params.startIndex);
        y = projection.yByValue(value);
        context.moveTo(x, y);
        for (var i = params.startIndex + 1; i <= params.endIndex; i++) {
            value = this.dataSeries[0].values[i];
            if (value == null)
                continue;
            x = projection.xByRecord(i);
            y = projection.yByValue(value);
            context.lineTo(x, y);
        }
        value = this.dataSeries[1].values[params.endIndex + 1];
        if (value == null) {
            value = this.dataSeries[1].values[this.getLastNotNullValueIndex(this.dataSeries[1])];
            params.endIndex = this.getLastNotNullValueIndex(this.dataSeries[0]);
        }
        x = projection.xByRecord(params.endIndex);
        y = projection.yByValue(value);
        context.lineTo(x, y);
        for (var i = params.endIndex; i >= params.startIndex; i--) {
            value = this.dataSeries[1].values[i];
            if (value == null)
                continue;
            x = projection.xByRecord(i);
            y = projection.yByValue(value);
            context.lineTo(x, y);
        }
        value = this.dataSeries[0].values[params.startIndex];
        if (value == null) {
            value = this.dataSeries[0].values[this.getFirstNotNullValueIndex(this.dataSeries[0])];
            params.startIndex = this.getFirstNotNullValueIndex(this.dataSeries[0]);
        }
        x = projection.xByRecord(params.startIndex);
        y = projection.yByValue(value);
        context.lineTo(x, y);
        context.fillStyle = this.buildCloudPattern(context);
        context.fill();
    };
    KumoPlot.prototype.drawSelectionPoints = function () {
    };
    KumoPlot.prototype.buildCloudPattern = function (context) {
        var params = this._barDrawParams();
        var maxX = 0;
        var maxY = 0;
        var flipPoints = [];
        var flipDirections = [];
        var projection = this.projection;
        for (var i = params.startIndex + 1; i <= params.endIndex; i++) {
            var value1 = this.dataSeries[0].values[i];
            var value2 = this.dataSeries[1].values[i];
            if (value1 == null || value2 == null)
                continue;
            var x = projection.xByRecord(i);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, projection.yByValue(value1), projection.yByValue(value2));
            if (flipDirections.length == 0) {
                flipDirections.push(value1 < value2 ? 'down' : 'up');
            }
            var nextValue1 = this.dataSeries[0].values[i + 1];
            var nextValue2 = this.dataSeries[1].values[i + 1];
            if (nextValue1 == null || nextValue2 == null)
                continue;
            var diffValue1 = value1 - value2;
            var diffValue2 = nextValue1 - nextValue2;
            if (diffValue1 == 0 && diffValue2 == 0)
                continue;
            if ((diffValue1 * diffValue2) <= 0) {
                flipDirections.push(nextValue1 < nextValue2 ? 'down' : 'up');
                var nextX = projection.xByRecord(i + 1);
                var ratio = Math.abs(diffValue1) / (Math.abs(diffValue1) + Math.abs(diffValue2));
                var crossX = Math.floor(x + (nextX - x) * ratio);
                flipPoints.push(crossX);
            }
        }
        if (maxX == 0 || maxY == 0) {
            return context;
        }
        var pattern = KumoPlot.pattern;
        pattern.width = maxX;
        pattern.height = maxY;
        var pctx = pattern.getContext('2d');
        var up = flipDirections.shift() == 'up';
        var previousX = 0;
        flipPoints.forEach(function (flipPoint) {
            var color = up ? params.theme.upColor.fillColor : params.theme.downColor.fillColor;
            pctx.fillStyle = color;
            pctx.fillRect(previousX, 0, flipPoint - previousX, maxY);
            up = flipDirections.shift() == 'up';
            previousX = flipPoint;
        });
        if (previousX < maxX) {
            var color = up ? params.theme.upColor.fillColor : params.theme.downColor.fillColor;
            pctx.fillStyle = color;
            pctx.fillRect(previousX, 0, maxX - previousX, maxY);
        }
        if (pattern.height == 0) {
            return context;
        }
        return context.createPattern(pattern, "no-repeat");
    };
    KumoPlot.prototype.getFirstNotNullValueIndex = function (dataserie) {
        var index = 0, isContinue = true;
        while (isContinue && index < dataserie.length) {
            if (dataserie.values[index] == null)
                index++;
            else
                isContinue = false;
        }
        return index;
    };
    KumoPlot.prototype.getLastNotNullValueIndex = function (dataserie) {
        var index = dataserie.length, isContinue = true;
        while (isContinue && index > 0) {
            if (dataserie.values[index] == null)
                index--;
            else
                isContinue = false;
        }
        return index;
    };
    return KumoPlot;
}(Plot));
export { KumoPlot };
//# sourceMappingURL=KumoPlot.js.map