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
import { VolumeProfilerBasePlot } from './VolumeProfilerBasePlot';
import { Geometry } from '../../StockChartX/Graphics/Geometry';
import { Tc } from '../../../utils';
var VolumeProfilerVisibleRangePlot = (function (_super) {
    __extends(VolumeProfilerVisibleRangePlot, _super);
    function VolumeProfilerVisibleRangePlot() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rectangles = [];
        return _this;
    }
    VolumeProfilerVisibleRangePlot.prototype.hitTest = function (point) {
        for (var j = 0; j < this.rectangles.length; ++j) {
            if (Geometry.isPointInsideOrNearRect(point, this.rectangles[j])) {
                return true;
            }
        }
        return false;
    };
    VolumeProfilerVisibleRangePlot.prototype.draw = function () {
        if (!this.visible)
            return;
        if (this.volumeProfilerIndicatorData.data.length == 0) {
            return;
        }
        Tc.assert(this.volumeProfilerIndicatorData.data.length == 1, "should have one bar group");
        var params = this._valueDrawParams();
        this.drawBars(params);
    };
    VolumeProfilerVisibleRangePlot.prototype.getData = function () {
        return this.volumeProfilerIndicatorData.data[0];
    };
    VolumeProfilerVisibleRangePlot.prototype.maximumTotalVolume = function () {
        var maximumTotalVolume = [];
        for (var i = 0; i < this.getData().bars.length; i++) {
            maximumTotalVolume.push(this.getData().bars[i].totalVolume);
        }
        return Math.max.apply(Math, maximumTotalVolume);
    };
    VolumeProfilerVisibleRangePlot.prototype.drawBars = function (params) {
        var context = params.context;
        this.rectangles = [];
        var theme = params.theme;
        context.beginPath();
        if (theme.showVolumeProfile) {
            this.drawUpDownBars(context, theme);
        }
        if (theme.line.strokeEnabled) {
            this.drawPointOfControlLine(context, theme);
        }
    };
    VolumeProfilerVisibleRangePlot.prototype.drawPointOfControlLine = function (context, theme) {
        var y = this.projection.yByValue(this.getData().pointOfControl);
        context.moveTo(0, y);
        context.lineTo(this.getChartWidthInPixels(), y);
        context.scxStroke(theme.line);
        this.rectangles.push({ left: 0, top: y, width: this.getChartWidthInPixels(), height: 3 });
    };
    VolumeProfilerVisibleRangePlot.prototype.getChartWidthInPixels = function () {
        return this.projection.xByRecord(this.chart.lastVisibleIndex + 1);
    };
    VolumeProfilerVisibleRangePlot.prototype.drawUpDownBars = function (context, theme) {
        var chartWidth = this.getChartWidthInPixels();
        var boxWidth = theme.boxWidth > 100 ? 100 : theme.boxWidth;
        var quarterDistanceOfTheBox = Math.floor(chartWidth * (boxWidth / 100));
        var maximumTotalVolumeBasedOnQuarter = Math.floor(this.maximumTotalVolume() / quarterDistanceOfTheBox);
        for (var i = 0; i < this.getData().bars.length; i++) {
            var padding = 1;
            var height = Math.abs(this.projection.yByValue(this.getData().bars[i].toPrice) - this.projection.yByValue(this.getData().bars[i].fromPrice)) - padding;
            var upRectWidth = Math.floor(this.getData().bars[i].greenVolume / maximumTotalVolumeBasedOnQuarter);
            var downRectWidth = Math.floor(this.getData().bars[i].redVolume / maximumTotalVolumeBasedOnQuarter);
            var y = this.projection.yByValue(this.getData().bars[i].toPrice) - padding;
            context.scxFill(this.getData().bars[i].valueArea ? theme.downArea : theme.downVolume);
            context.fillRect(this.xPosForDownBars(theme, chartWidth, downRectWidth, upRectWidth), y - 0.5, downRectWidth, height);
            context.scxFill(this.getData().bars[i].valueArea ? theme.upArea : theme.upVolume);
            context.fillRect(this.xPosForUpBars(theme, chartWidth, upRectWidth), y - 0.5, upRectWidth, height);
            this.rectangles.push({ left: chartWidth - downRectWidth - upRectWidth, top: y, width: downRectWidth + upRectWidth, height: height });
        }
    };
    VolumeProfilerVisibleRangePlot.prototype.xPosForDownBars = function (theme, chartWidth, downRectWidth, upRectWidth) {
        if (theme.placement == 'left') {
            return this.projection.xByRecord(this.chart.firstVisibleRecord - 1) + upRectWidth - 0.5;
        }
        else {
            return chartWidth - downRectWidth - upRectWidth - 0.5;
        }
    };
    VolumeProfilerVisibleRangePlot.prototype.xPosForUpBars = function (theme, chartWidth, upRectWidth) {
        if (theme.placement == 'left') {
            return this.projection.xByRecord(this.chart.firstVisibleRecord - 1) - 0.5;
        }
        else {
            return chartWidth - upRectWidth - 0.5;
        }
    };
    return VolumeProfilerVisibleRangePlot;
}(VolumeProfilerBasePlot));
export { VolumeProfilerVisibleRangePlot };
//# sourceMappingURL=VolumeProfilerVisibleRangePlot.js.map