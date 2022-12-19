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
import { ChartAnnotation } from './ChartAnnotation';
import { DummyCanvasContext } from '../Utils/DummyCanvasContext';
import { Geometry } from '../Graphics/Geometry';
import { ChartAccessorService, ChartTooltipType } from '../../../services/chart';
var SplitChartAnnotation = (function (_super) {
    __extends(SplitChartAnnotation, _super);
    function SplitChartAnnotation(chart, config) {
        var _this = _super.call(this, chart, config) || this;
        _this.width = 16;
        _this.height = 16;
        _this.padding = 5;
        if (!config.splitValue) {
            throw new Error('cannot find data for chart annotation');
        }
        _this.splitValue = config.splitValue;
        return _this;
    }
    SplitChartAnnotation.prototype.draw = function () {
        var x = this.projection.xByRecord(this.getRecord());
        if (!this.xInsideView(x)) {
            return;
        }
        var y = this.projection.yByValue(this.getCandleHigh()) - this.getOffsetDistance(), bounds = this.bounds();
        this.context.scxApplyStrokeTheme({
            strokeColor: '#888',
            lineStyle: 'solid',
            width: 1
        });
        this.context.strokeRect(bounds.left, bounds.top, bounds.width, bounds.height);
        this.context.scxApplyFillTheme({
            fillColor: '#97CCFA'
        });
        this.context.fillRect(bounds.left, bounds.top, bounds.width, bounds.height);
        var textTheme = {
            fontSize: 12,
            fontStyle: 'normal',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            fillColor: '#000'
        };
        var textSize = DummyCanvasContext.measureText('B', textTheme);
        this.context.scxApplyTextTheme(textTheme);
        this.context.fillText('B', x - textSize.width / 2, y - this.padding - (this.height / 2) + 4.5);
    };
    SplitChartAnnotation.prototype.bounds = function () {
        var x = this.projection.xByRecord(this.getRecord()), y = this.projection.yByValue(this.getCandleHigh());
        return {
            left: x - (this.width / 2),
            top: y - this.height - this.padding - this.getOffsetDistance(),
            width: this.width,
            height: this.height
        };
    };
    SplitChartAnnotation.prototype.isVisible = function () {
        return true;
    };
    SplitChartAnnotation.prototype.hitTest = function (point) {
        var record = this.getRecord();
        var x = this.projection.xByRecord(record);
        if (!this.xInsideView(x)) {
            return false;
        }
        if (this.chart.hoveredRecord < record - 25 || record + 25 < this.chart.hoveredRecord) {
            ChartAccessorService.instance.getChartTooltipService().hide(ChartTooltipType.Split);
            return false;
        }
        return Geometry.isPointInsideOrNearRect(point, this.bounds());
    };
    SplitChartAnnotation.prototype.handleMouseHoverGesture = function (gesture, event) {
        _super.prototype.handleMouseHoverGesture.call(this, gesture, event);
        if (Geometry.isPointInsideOrNearRect(event.pointerPosition, this.bounds())) {
            ChartAccessorService.instance.getChartTooltipService().show(ChartTooltipType.Split, {
                chartPanel: this.chartPanel,
                mousePosition: event.pointerPosition,
                data: { data: this.splitValue, date: this.date }
            });
        }
        else {
            ChartAccessorService.instance.getChartTooltipService().hide(ChartTooltipType.Split);
        }
    };
    SplitChartAnnotation.prototype.handleMouseClickGesture = function (gesture, event) {
    };
    SplitChartAnnotation.prototype.xInsideView = function (x) {
        if (x < 0 || this.chartPanel.contentFrame.left + this.chartPanel.contentFrame.width < x) {
            return false;
        }
        return true;
    };
    SplitChartAnnotation.prototype.getOffsetDistance = function () {
        return (this.height + this.padding) * this.offset;
    };
    return SplitChartAnnotation;
}(ChartAnnotation));
export { SplitChartAnnotation };
//# sourceMappingURL=SplitChartAnnotation.js.map