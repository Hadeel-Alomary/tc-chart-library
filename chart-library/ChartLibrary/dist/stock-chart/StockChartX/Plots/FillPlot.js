import { __extends } from "tslib";
import { Plot } from "./Plot";
var FillPlot = (function (_super) {
    __extends(FillPlot, _super);
    function FillPlot(chart, config) {
        var _this = _super.call(this, chart, config) || this;
        _this._plotThemeKey = 'fillPlot';
        _this.plotStyle = 'fill';
        return _this;
    }
    FillPlot.prototype.draw = function () {
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
        context.fillStyle = params.theme.fill.fillColor;
        context.fill();
    };
    FillPlot.prototype.drawSelectionPoints = function () {
    };
    FillPlot.prototype.getFirstNotNullValueIndex = function (dataserie) {
        var index = 0, isContinue = true;
        while (isContinue && index < dataserie.length) {
            if (dataserie.values[index] == null)
                index++;
            else
                isContinue = false;
        }
        return index;
    };
    FillPlot.prototype.getLastNotNullValueIndex = function (dataserie) {
        var index = dataserie.length, isContinue = true;
        while (isContinue && index > 0) {
            if (dataserie.values[index] == null)
                index--;
            else
                isContinue = false;
        }
        return index;
    };
    FillPlot.prototype.drawValueMarkers = function () {
    };
    return FillPlot;
}(Plot));
export { FillPlot };
//# sourceMappingURL=FillPlot.js.map