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
import { AbstractConnectedPointsPlot } from "./AbstractConnectedPointsPlot";
import { DummyCanvasContext } from "../Utils/DummyCanvasContext";
import { Geometry } from "../Graphics/Geometry";
import { PlotDrawingOrderType } from "./Plot";
import { HtmlUtil } from "../Utils/HtmlUtil";
var LabelConnectedPointsPlot = (function (_super) {
    __extends(LabelConnectedPointsPlot, _super);
    function LabelConnectedPointsPlot(chart, config) {
        var _this = _super.call(this, chart, config) || this;
        _this.size = {
            width: 30,
            height: 20
        };
        _this.textTheme = {
            fontFamily: 'Arial',
            fontSize: 12,
            fontStyle: 'bold',
            fillColor: 'black',
            textBaseline: 'alphabetic'
        };
        _this.angle = 4;
        _this.padding = 8;
        _this._plotThemeKey = 'labelConnectedPoints';
        return _this;
    }
    Object.defineProperty(LabelConnectedPointsPlot.prototype, "height", {
        get: function () {
            return this.padding + this.size.height + this.actualTheme.stroke.width;
        },
        enumerable: false,
        configurable: true
    });
    LabelConnectedPointsPlot.prototype.draw = function () {
        if (!this.visible)
            return;
        var params = this._valueDrawParams();
        if (params.values.length === 0)
            return;
        var context = params.context, projection = params.projection, values = this.connectedPointsSeries.values;
        var pOHLC = this.chart.barDataSeries();
        for (var i = params.startIndex; i < params.endIndex; i++) {
            var value = values[i];
            if (value == null || isNaN(value) || value == 0)
                continue;
            context.beginPath();
            var x = projection.xByRecord(i), y = projection.yByValue(value);
            var high = pOHLC.high.valueAtIndex(i), upValue = high == value, valueTextSize = DummyCanvasContext.measureText(value.toFixed(2), this.textTheme);
            y = upValue ? y - this.padding : y + this.padding;
            this.drawPopupRectangle(params, x, y, valueTextSize, upValue);
            this.drawText(params, value, x, y, valueTextSize, upValue);
        }
    };
    LabelConnectedPointsPlot.prototype.drawValueMarkers = function () {
    };
    LabelConnectedPointsPlot.prototype.hitTest = function (point) {
        var params = this._valueDrawParams(), values = this.connectedPointsSeries.values;
        if (values.length === 0)
            return false;
        var projection = params.projection;
        for (var i = params.startIndex; i < params.endIndex; i++) {
            var value = values[i];
            if (value == null || isNaN(value) || value == 0)
                continue;
            var x = projection.xByRecord(i);
            var y = projection.yByValue(value);
            var pOHLC = this.chart.barDataSeries();
            var high = pOHLC.high.valueAtIndex(i), upValue = high == value;
            if (x - this.size.width <= point.x && point.x <= x + this.size.width) {
                var left = x - (this.size.width / 2), top_1 = upValue
                    ? y - this.padding - this.size.height
                    : y + this.padding + this.angle, width = this.size.width, height = this.size.height - this.angle;
                if (Geometry.isPointInsideOrNearRect(point, { left: left, top: top_1, width: width, height: height }))
                    return true;
            }
        }
        return false;
    };
    LabelConnectedPointsPlot.prototype.drawSelectionPoints = function () {
        if (!this.visible) {
            return;
        }
        var params = this._valueDrawParams(), values = this.connectedPointsSeries.values;
        if (values.length === 0)
            return;
        var projection = params.projection;
        for (var i = params.startIndex; i < params.endIndex; i++) {
            var value = values[i];
            if (value == null || isNaN(value) || value == 0)
                continue;
            var x = projection.xByRecord(i);
            var y = projection.yByValue(value);
            this.drawSelectionCircle(x, y);
        }
    };
    Object.defineProperty(LabelConnectedPointsPlot.prototype, "drawingOrder", {
        get: function () {
            return this.selected ? PlotDrawingOrderType.SelectedPlot : PlotDrawingOrderType.LabelConnectedPlot;
        },
        enumerable: false,
        configurable: true
    });
    LabelConnectedPointsPlot.prototype.updateMinMaxForSomePlotsIfNeeded = function (min, max) {
        var height = this.valueScale.rightPanel.frame.height, pixelsPerUnit = (max - min) / height, yOffset = this.height * pixelsPerUnit * 2;
        return {
            min: min - yOffset,
            max: max + yOffset
        };
    };
    LabelConnectedPointsPlot.prototype.drawPopupRectangle = function (params, x, y, valueTextSize, upValue) {
        if (this.size.width <= valueTextSize.width) {
            this.size.width += (valueTextSize.width - this.size.width) + this.padding;
        }
        var angle = this.angle, height = this.size.height, halfWidth = this.size.width / 2, context = params.context, theme = params.theme.stroke, angleY = upValue ? y - angle : y + angle, rectangleY = upValue ? y - height : y + height, left = x - halfWidth, right = x + halfWidth;
        context.moveTo(x, y);
        context.lineTo(x + angle, angleY);
        context.moveTo(x, y);
        context.lineTo(x - angle, angleY);
        context.lineTo(left, angleY);
        context.lineTo(left, rectangleY);
        context.lineTo(right, rectangleY);
        context.lineTo(right, angleY);
        context.lineTo(x + angle, angleY);
        context.closePath();
        context.scxFillStroke({
            fillColor: HtmlUtil.isDarkColor(theme.strokeColor) ? '#eee' : '#7f7e7e'
        }, theme);
    };
    LabelConnectedPointsPlot.prototype.drawText = function (params, value, x, y, valueTextSize, upValue) {
        var context = params.context, valueAsString = value.toFixed(2), textY = upValue
            ? y - this.angle - (this.size.height - this.angle - valueTextSize.height) * (4 / 3)
            : y + this.angle - (this.size.height - this.angle - valueTextSize.height) * (1 / 4) + valueTextSize.height, textX = x - (valueTextSize.width / 2);
        this.textTheme.fillColor = params.theme.stroke.strokeColor;
        context.scxApplyTextTheme(this.textTheme);
        context.fillText(valueAsString, textX, textY);
    };
    return LabelConnectedPointsPlot;
}(AbstractConnectedPointsPlot));
export { LabelConnectedPointsPlot };
//# sourceMappingURL=LabelConnectedPointsPlot.js.map