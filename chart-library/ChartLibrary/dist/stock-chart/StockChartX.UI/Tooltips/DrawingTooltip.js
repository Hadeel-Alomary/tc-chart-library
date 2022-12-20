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
import { ChartTooltipType } from "../../../services/index";
import { MeasuringUtil } from "../../StockChartX/Utils/MeasuringUtil";
import { DrawingCalculationUtil } from "../../StockChartX/Utils/DrawingCalculationUtil";
import { AbstractTooltip } from "./AbstractTooltip";
var IDS = {
    TOOLTIP_ID: '#scxDrawingTooltip',
    CHANGE_VALUE_ID: '#scxDrawingTooltip-changeValue',
    CHANGE_PERCENTAGE_VALUE_ID: '#scxDrawingTooltip-changePercentageValue',
    PERIOD_VALUE_ID: '#scxDrawingTooltip-periodValue',
    BARS_VALUE_ID: '#scxDrawingTooltip-barsValue',
    ANGLE_VALUE_ID: '#scxDrawingTooltip-angleValue'
};
var DrawingTooltip = (function (_super) {
    __extends(DrawingTooltip, _super);
    function DrawingTooltip() {
        return _super.call(this) || this;
    }
    Object.defineProperty(DrawingTooltip, "instance", {
        get: function () {
            if (DrawingTooltip._instance == null) {
                DrawingTooltip._instance = new DrawingTooltip();
            }
            return DrawingTooltip._instance;
        },
        enumerable: true,
        configurable: true
    });
    DrawingTooltip.prototype.show = function (config) {
        if (this.shown)
            this.hide();
        $(IDS.TOOLTIP_ID).addClass('shown');
        this.shown = true;
        this.update(config.points, config.chartPanel);
    };
    DrawingTooltip.prototype.hide = function () {
        if (!this.shown)
            return;
        $(IDS.TOOLTIP_ID).removeClass('shown');
        this.shown = false;
    };
    DrawingTooltip.prototype.getType = function () {
        return ChartTooltipType.Drawing;
    };
    DrawingTooltip.prototype.update = function (points, chartPanel) {
        var point1 = points[0].toPoint(chartPanel.projection);
        var point2 = points[1].toPoint(chartPanel.projection);
        this.updateValues(points, point1, point2, chartPanel);
        this.setPosition(chartPanel, this.getTooltipPosition(point1, point2), IDS.TOOLTIP_ID);
    };
    DrawingTooltip.prototype.updateValues = function (points, point1, point2, panel) {
        var values = MeasuringUtil.getMeasuringValues(points, panel);
        var radians = DrawingCalculationUtil.calculateAngleBetweenTwoPointsInRadians(point1, point2);
        var valuesAsText = this.getTooltipValues(values, radians);
        this.fillHtmlValues(valuesAsText);
    };
    DrawingTooltip.prototype.getTooltipValues = function (values, angleInRadians) {
        var change = values.change.toFixed(2), changePercentage = '(' + values.changePercentage.toFixed(2) + '%)', bars = values.barsCount + ' bars, ', angle = Math.round(DrawingCalculationUtil.convertRadianToDegree(angleInRadians)) + "°";
        return {
            change: change,
            changePercentage: changePercentage,
            bars: bars,
            period: values.period,
            angle: angle
        };
    };
    DrawingTooltip.prototype.fillHtmlValues = function (values) {
        $(IDS.CHANGE_VALUE_ID).text(values.change);
        $(IDS.CHANGE_PERCENTAGE_VALUE_ID).text(values.changePercentage);
        $(IDS.BARS_VALUE_ID).text(values.bars);
        $(IDS.PERIOD_VALUE_ID).text(values.period);
        $(IDS.ANGLE_VALUE_ID).text(values.angle);
    };
    DrawingTooltip.prototype.getTooltipPosition = function (point1, point2) {
        var left = point1.x < point2.x ? point2.x + 5 : point2.x - 5 - $(IDS.TOOLTIP_ID).width(), top = point2.y + 5;
        return {
            x: left,
            y: top
        };
    };
    DrawingTooltip._instance = null;
    return DrawingTooltip;
}(AbstractTooltip));
export { DrawingTooltip };
//# sourceMappingURL=DrawingTooltip.js.map