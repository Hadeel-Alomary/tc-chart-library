import { LineStyle } from '../Theme';
import { JsUtil } from "../Utils/JsUtil";
import { HtmlUtil } from "../Utils/HtmlUtil";
import { Geometry } from "../Graphics/Geometry";
import { PlotType } from '../../StockChartX/Plots/Plot';
var defaultTheme = {
    line: {
        width: 1,
        strokeColor: '#cc0a0a',
        lineStyle: LineStyle.SOLID
    }
};
var HorizontalLine = (function () {
    function HorizontalLine(config) {
        if (!config || typeof config !== 'object') {
            throw new TypeError("Config expected.");
        }
        this.options = {};
        if (typeof config.value === 'undefined') {
            throw new TypeError('Value expected');
        }
        this.value = config.value;
        this.theme = config.theme ? config.theme : JsUtil.clone(defaultTheme);
    }
    Object.defineProperty(HorizontalLine.prototype, "theme", {
        get: function () {
            return this.options.theme;
        },
        set: function (value) {
            this.options.theme = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HorizontalLine.prototype, "value", {
        get: function () {
            return this.options.value;
        },
        set: function (value) {
            this.options.value = value;
        },
        enumerable: true,
        configurable: true
    });
    HorizontalLine.prototype.setColor = function (color) {
        this.theme.line.strokeColor = color;
    };
    HorizontalLine.prototype.getColor = function () {
        return this.theme.line.strokeColor;
    };
    HorizontalLine.prototype.setLineStyle = function (style) {
        this.theme.line.lineStyle = style;
    };
    HorizontalLine.prototype.getLineStyle = function () {
        return this.theme.line.lineStyle;
    };
    HorizontalLine.prototype.setLineWidth = function (width) {
        this.theme.line.width = width;
    };
    HorizontalLine.prototype.getLineWidth = function () {
        return this.theme.line.width;
    };
    HorizontalLine.prototype.draw = function (indicator) {
        if (!indicator.visible)
            return;
        var context = indicator.chartPanel.context, projection = indicator.chartPanel.projection, y = projection.yByValue(this.value);
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(indicator.chartPanel.frame.right, y);
        context.closePath();
        context.scxApplyStrokeTheme(this.theme.line);
        context.stroke();
    };
    HorizontalLine.prototype.drawValueMarkers = function (indicator) {
        if (!indicator.showValueMarkers) {
            return;
        }
        var marker = indicator.chart.valueMarker;
        marker.theme.fill.fillColor = this.theme.line.strokeColor;
        marker.theme.text.fillColor = HtmlUtil.isDarkColor(this.theme.line.strokeColor) ? 'white' : 'black';
        marker.draw(this.value, indicator.plots[0].panelValueScale, 0, PlotType.INDICATOR);
    };
    HorizontalLine.prototype.hitTest = function (point, indicator) {
        return Geometry.isPointNearPoint(point, {
            x: point.x,
            y: indicator.chartPanel.projection.yByValue(this.value)
        });
    };
    return HorizontalLine;
}());
export { HorizontalLine };
//# sourceMappingURL=HorizontalLine.js.map