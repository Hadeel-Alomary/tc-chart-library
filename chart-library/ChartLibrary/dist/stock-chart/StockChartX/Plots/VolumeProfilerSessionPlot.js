import { __extends } from "tslib";
import { Interval, IntervalType } from '../../../services/loader';
import { DataSeriesSuffix } from '../../StockChartX/Data/DataSeries';
import { VolumeProfilerBasePlot } from './VolumeProfilerBasePlot';
import { Geometry } from '../../StockChartX/Graphics/Geometry';
var VolumeProfilerSessionPlot = (function (_super) {
    __extends(VolumeProfilerSessionPlot, _super);
    function VolumeProfilerSessionPlot(chart, config) {
        return _super.call(this, chart, config) || this;
    }
    VolumeProfilerSessionPlot.prototype.isHoveredOverSessionBox = function (point) {
        if (!this.boxes) {
            return false;
        }
        for (var i = 0; i < this.boxes.length; ++i) {
            if (this.boxes[i].fromX <= point.x && point.x <= this.boxes[i].toX) {
                return this.boxes[i].fromY <= point.y && point.y <= this.boxes[i].toY;
            }
        }
        return false;
    };
    VolumeProfilerSessionPlot.prototype.hitTest = function (point) {
        if (!this.boxes) {
            return false;
        }
        for (var i = 0; i < this.boxes.length; ++i) {
            if (this.boxes[i].fromX <= point.x && point.x <= this.boxes[i].toX) {
                for (var j = 0; j < this.boxes[i].rectangles.length; ++j) {
                    if (Geometry.isPointInsideOrNearRect(point, this.boxes[i].rectangles[j])) {
                        return true;
                    }
                }
                return false;
            }
        }
        return false;
    };
    VolumeProfilerSessionPlot.prototype.draw = function () {
        if (!this.visible)
            return;
        var params = this._valueDrawParams();
        this.boxes = this.computeBoxes(params, params.projection);
        this.drawBoxes(params);
    };
    VolumeProfilerSessionPlot.prototype.drawBoxes = function (params) {
        var context = params.context, projection = params.projection;
        var theme = params.theme;
        if (Interval.fromChartInterval(this.chart.timeInterval).type < IntervalType.Day) {
            context.beginPath();
            context.scxFill(theme.fillBox);
            for (var i = 0; i < this.boxes.length; i++) {
                this.drawBox(context, projection, this.boxes[i]);
            }
            if (this.volumeProfilerIndicatorData.data.length) {
                if (theme.showVolumeProfile) {
                    for (var i = 0; i < this.boxes.length; i++) {
                        this.boxes[i].rectangles = [];
                    }
                    context.scxFill(theme.downArea);
                    for (var i = 0; i < this.boxes.length; i++) {
                        if (this.boxes[i].data) {
                            this.drawValueDownBars(this.boxes[i], context, theme);
                        }
                    }
                    context.scxFill(theme.downVolume);
                    for (var i = 0; i < this.boxes.length; i++) {
                        this.boxes[i].rectangles = [];
                        if (this.boxes[i].data) {
                            this.drawVolumeDownBars(this.boxes[i], context, theme);
                        }
                    }
                    context.scxFill(theme.downArea);
                    for (var i = 0; i < this.boxes.length; i++) {
                        if (this.boxes[i].data) {
                            this.drawValueDownBars(this.boxes[i], context, theme);
                        }
                    }
                    context.scxFill(theme.upArea);
                    for (var i = 0; i < this.boxes.length; i++) {
                        if (this.boxes[i].data) {
                            this.drawValueUpBars(this.boxes[i], context, theme);
                        }
                    }
                    context.scxFill(theme.upVolume);
                    for (var i = 0; i < this.boxes.length; i++) {
                        if (this.boxes[i].data) {
                            this.drawVolumeUpBars(this.boxes[i], context, theme);
                        }
                    }
                }
                if (theme.line.strokeEnabled) {
                    for (var i = 0; i < this.boxes.length; i++) {
                        if (this.boxes[i].data) {
                            this.drawPointOfControlLine(this.boxes[i], context);
                        }
                    }
                    context.scxStroke(theme.line);
                }
            }
        }
    };
    VolumeProfilerSessionPlot.prototype.computeBoxes = function (params, projection) {
        var boxes = [];
        var dateSeries = this.chart.getDataSeries(DataSeriesSuffix.DATE);
        var highSeries = this.chart.getDataSeries(DataSeriesSuffix.HIGH);
        var lowSeries = this.chart.getDataSeries(DataSeriesSuffix.LOW);
        var startIndex = null;
        var highest = Number.MIN_VALUE;
        var lowest = Number.MAX_VALUE;
        var dataSeries = this.dataSeries[0];
        var startRangeIndex = this.chart.firstVisibleIndex;
        var endRangeIndex = this.chart.recordCount;
        for (var i = startRangeIndex; i < endRangeIndex; ++i) {
            if (startIndex == null) {
                startIndex = dataSeries.values[i];
                continue;
            }
            highest = Math.max(highest, highSeries.values[i - 1]);
            lowest = Math.min(lowest, lowSeries.values[i - 1]);
            var dataIndex = dataSeries.values[i];
            if ((i + 1) == endRangeIndex) {
                if (dataIndex == startIndex) {
                    dataIndex = i;
                }
            }
            var boxBoundary = startIndex != dataIndex;
            if (boxBoundary) {
                var fromX = projection.xByDate(dateSeries.values[startIndex]);
                var toX = projection.xByDate(dateSeries.values[dataIndex - 1]);
                var toY = projection.yByValue(lowest);
                var fromY = projection.yByValue(highest);
                var box = {
                    boxDate: moment(dateSeries.values[startIndex]).format('YYYY-MM-DD'),
                    fromX: fromX,
                    toX: toX,
                    toY: toY,
                    fromY: fromY,
                    data: null,
                    rectangles: [],
                    maximumVolume: null
                };
                boxes.push(box);
                if (this.chart.lastVisibleIndex < i) {
                    break;
                }
                startIndex = dataIndex;
                highest = Number.MIN_VALUE;
                lowest = Number.MAX_VALUE;
            }
        }
        this.addDataToBoxes(projection, boxes);
        return boxes.reverse();
    };
    VolumeProfilerSessionPlot.prototype.drawBox = function (context, projection, boxDimension) {
        var maximum_Y = boxDimension.fromY;
        var minimum_y = boxDimension.toY;
        var boxHeight = minimum_y - maximum_Y;
        var boxWidth = boxDimension.toX - boxDimension.fromX;
        context.fillRect(boxDimension.fromX, maximum_Y, boxWidth, boxHeight);
    };
    VolumeProfilerSessionPlot.prototype.drawPointOfControlLine = function (box, context) {
        var y = this.projection.yByValue(box.data.pointOfControl);
        context.moveTo(box.fromX, y);
        context.lineTo(box.toX, y);
        box.rectangles.push({ left: box.fromX, top: y, width: box.toX - box.fromX, height: 3 });
    };
    VolumeProfilerSessionPlot.prototype.drawValueDownBars = function (box, context, theme) {
        var maximumVolume = box.maximumVolume;
        for (var i = 0; i < box.data.bars.length; i++) {
            if (!box.data.bars[i].valueArea) {
                continue;
            }
            var boxWidth = theme.boxWidth > 100 ? 100 : theme.boxWidth;
            var quarterDistanceOfTheBox = (box.toX - box.fromX) * (boxWidth / 100);
            var maximumTotalVolumeBasedOnQuarter = maximumVolume / quarterDistanceOfTheBox;
            var padding = 1;
            var height = Math.abs(this.projection.yByValue(box.data.bars[i].toPrice) - this.projection.yByValue(box.data.bars[i].fromPrice)) - padding;
            var upRectWidth = Math.floor(box.data.bars[i].greenVolume / maximumTotalVolumeBasedOnQuarter);
            var downRectWidth = Math.floor(box.data.bars[i].redVolume / maximumTotalVolumeBasedOnQuarter);
            var y = this.projection.yByValue(box.data.bars[i].toPrice) - padding;
            context.fillRect(this.xPosForDownBar(theme, box, upRectWidth, downRectWidth), y - 0.5, downRectWidth, height);
            box.rectangles.push({ left: box.fromX, top: y, width: downRectWidth + upRectWidth, height: height });
        }
    };
    VolumeProfilerSessionPlot.prototype.drawVolumeDownBars = function (box, context, theme) {
        var maximumVolume = box.maximumVolume;
        for (var i = 0; i < box.data.bars.length; i++) {
            if (box.data.bars[i].valueArea) {
                continue;
            }
            var boxWidth = theme.boxWidth > 100 ? 100 : theme.boxWidth;
            var quarterDistanceOfTheBox = (box.toX - box.fromX) * (boxWidth / 100);
            var maximumTotalVolumeBasedOnQuarter = maximumVolume / quarterDistanceOfTheBox;
            var padding = 1;
            var height = Math.abs(this.projection.yByValue(box.data.bars[i].toPrice) - this.projection.yByValue(box.data.bars[i].fromPrice)) - padding;
            var upRectWidth = Math.floor(box.data.bars[i].greenVolume / maximumTotalVolumeBasedOnQuarter);
            var downRectWidth = Math.floor(box.data.bars[i].redVolume / maximumTotalVolumeBasedOnQuarter);
            var y = this.projection.yByValue(box.data.bars[i].toPrice) - padding;
            context.fillRect(this.xPosForDownBar(theme, box, upRectWidth, downRectWidth), y - 0.5, downRectWidth, height);
            box.rectangles.push({ left: box.fromX, top: y, width: downRectWidth + upRectWidth, height: height });
        }
    };
    VolumeProfilerSessionPlot.prototype.drawValueUpBars = function (box, context, theme) {
        var maximumVolume = box.maximumVolume;
        for (var i = 0; i < box.data.bars.length; i++) {
            if (!box.data.bars[i].valueArea) {
                continue;
            }
            var boxWidth = theme.boxWidth > 100 ? 100 : theme.boxWidth;
            var quarterDistanceOfTheBox = (box.toX - box.fromX) * (boxWidth / 100);
            var maximumTotalVolumeBasedOnQuarter = maximumVolume / quarterDistanceOfTheBox;
            var padding = 1;
            var height = Math.abs(this.projection.yByValue(box.data.bars[i].toPrice) - this.projection.yByValue(box.data.bars[i].fromPrice)) - padding;
            var upRectWidth = Math.floor(box.data.bars[i].greenVolume / maximumTotalVolumeBasedOnQuarter);
            var y = this.projection.yByValue(box.data.bars[i].toPrice) - padding;
            context.fillRect(this.xPosForUpBar(theme, box, upRectWidth), y - 0.5, upRectWidth, height);
        }
    };
    VolumeProfilerSessionPlot.prototype.drawVolumeUpBars = function (box, context, theme) {
        var maximumVolume = box.maximumVolume;
        for (var i = 0; i < box.data.bars.length; i++) {
            if (box.data.bars[i].valueArea) {
                continue;
            }
            var boxWidth = theme.boxWidth > 100 ? 100 : theme.boxWidth;
            var quarterDistanceOfTheBox = (box.toX - box.fromX) * (boxWidth / 100);
            var maximumTotalVolumeBasedOnQuarter = maximumVolume / quarterDistanceOfTheBox;
            var padding = 1;
            var height = Math.abs(this.projection.yByValue(box.data.bars[i].toPrice) - this.projection.yByValue(box.data.bars[i].fromPrice)) - padding;
            var upRectWidth = Math.floor(box.data.bars[i].greenVolume / maximumTotalVolumeBasedOnQuarter);
            var y = this.projection.yByValue(box.data.bars[i].toPrice) - padding;
            context.fillRect(this.xPosForUpBar(theme, box, upRectWidth), y - 0.5, upRectWidth, height);
        }
    };
    VolumeProfilerSessionPlot.prototype.xPosForDownBar = function (theme, box, upRectWidth, downRectWidth) {
        if (theme.placement == 'left') {
            return box.fromX - 0.5 + upRectWidth;
        }
        else {
            return box.toX - 0.5 - upRectWidth - downRectWidth;
        }
    };
    VolumeProfilerSessionPlot.prototype.xPosForUpBar = function (theme, box, upRectWidth) {
        if (theme.placement == 'left') {
            return box.fromX - 0.5;
        }
        else {
            return box.toX - 0.5 - upRectWidth;
        }
    };
    VolumeProfilerSessionPlot.prototype.maximumTotalVolume = function (bars) {
        var maximumTotalVolume = [];
        for (var i = 0; i < bars.length; i++) {
            maximumTotalVolume.push(bars[i].totalVolume);
        }
        return Math.max.apply(Math, maximumTotalVolume);
    };
    VolumeProfilerSessionPlot.prototype.addDataToBoxes = function (projection, boxes) {
        if (this.volumeProfilerIndicatorData.data.length == 0) {
            return;
        }
        var _loop_1 = function (boxIndex) {
            var boxData = this_1.volumeProfilerIndicatorData.data.find(function (data) { return data.fromDate.startsWith(boxes[boxIndex].boxDate); });
            if (boxData) {
                boxes[boxIndex].data = boxData;
                boxes[boxIndex].maximumVolume = this_1.maximumTotalVolume(boxData.bars);
            }
        };
        var this_1 = this;
        for (var boxIndex = 0; boxIndex < boxes.length; ++boxIndex) {
            _loop_1(boxIndex);
        }
    };
    return VolumeProfilerSessionPlot;
}(VolumeProfilerBasePlot));
export { VolumeProfilerSessionPlot };
//# sourceMappingURL=VolumeProfilerSessionPlot.js.map