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
import { AbstractConnectedPointsPlot } from "./AbstractConnectedPointsPlot";
import { HtmlUtil } from "../Utils/HtmlUtil";
import { Geometry } from "../Graphics/Geometry";
var LineConnectedPointsPlot = (function (_super) {
    __extends(LineConnectedPointsPlot, _super);
    function LineConnectedPointsPlot(chart, config) {
        var _this = _super.call(this, chart, config) || this;
        _this._plotThemeKey = 'lineConnectedPoints';
        return _this;
    }
    LineConnectedPointsPlot.prototype.draw = function () {
        if (!this.visible)
            return;
        var params = this._valueDrawParams();
        if (params.values.length === 0)
            return;
        this.drawColoredLine(params, true, params.theme.upLine);
        this.drawColoredLine(params, false, params.theme.downLine);
    };
    LineConnectedPointsPlot.prototype.drawValueMarkers = function () {
        if (!this.showValueMarkers)
            return;
        var marker = this.chart.valueMarker, markerTheme = marker.theme, drawParams = this._valueDrawParams();
        if (drawParams.values.length === 0)
            return;
        var lastIdx = Math.ceil(this.chart.dateScale.lastVisibleRecord);
        if (!this.dataSeries[0].valueAtIndex(lastIdx)) {
            lastIdx = drawParams.values.length - 1;
        }
        var beforeLastIndex = drawParams.values.length - 2, isUp = drawParams.values[lastIdx] > drawParams.values[beforeLastIndex], fillColor = drawParams.theme[isUp ? 'upLine' : 'downLine'].strokeColor;
        markerTheme.fill.fillColor = fillColor;
        markerTheme.text.fillColor = HtmlUtil.isDarkColor(fillColor) ? 'white' : 'black';
        marker.draw(drawParams.values[lastIdx], this.panelValueScale, this.valueMarkerOffset, this.plotType);
    };
    LineConnectedPointsPlot.prototype.hitTest = function (point) {
        var params = this._valueDrawParams();
        if (params.values.length === 0)
            return false;
        for (var i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            var value = params.values[i];
            if (value == null)
                continue;
            var x = this.projection.xByColumn(column);
            if (x <= point.x && point.x <= x + this.chart.dateScale.columnWidth) {
                var nextX = this.projection.xByColumn(column + 1);
                var nextEntry = Math.min(i + 1, params.endIndex);
                var y = this.projection.yByValue(value);
                var nextY = this.projection.yByValue(params.values[nextEntry]);
                if (Geometry.isPointNearLine(point, { x: x, y: y }, { x: nextX, y: nextY }))
                    return true;
            }
        }
        return false;
    };
    LineConnectedPointsPlot.prototype.drawSelectionPoints = function () {
        if (!this.visible) {
            return;
        }
        var params = this._valueDrawParams();
        if (params.values.length === 0)
            return;
        var projection = params.projection;
        for (var i = params.endIndex - 10; i >= params.startIndex; i = i - 10) {
            var value = params.values[i];
            if (value == null || isNaN(value))
                continue;
            var x = projection.xByRecord(i), y = projection.yByValue(value);
            this.drawSelectionCircle(x, y);
        }
    };
    LineConnectedPointsPlot.prototype.drawColoredLine = function (params, upLine, theme) {
        var context = params.context, projection = params.projection;
        var count = this.connectedPointsSeries.length, values = this.connectedPointsSeries.values;
        var lastValue = Infinity;
        context.beginPath();
        for (var i = 0; i < count; i++) {
            var value = values[i];
            if (value == null || isNaN(value) || value == 0)
                continue;
            var x = projection.xByRecord(i), y = projection.yByValue(value), firstPoint = false;
            if (lastValue == Infinity) {
                lastValue = value;
                firstPoint = true;
            }
            else {
                var down = lastValue > value;
                lastValue = value;
                firstPoint = false;
                if (down == upLine) {
                    context.moveTo(x, y);
                    continue;
                }
            }
            if (!firstPoint)
                context.lineTo(x, y);
            context.moveTo(x, y);
        }
        context.scxApplyStrokeTheme(theme);
        context.stroke();
    };
    return LineConnectedPointsPlot;
}(AbstractConnectedPointsPlot));
export { LineConnectedPointsPlot };
//# sourceMappingURL=LineConnectedPointsPlot.js.map