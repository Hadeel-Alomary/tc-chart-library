import { __extends } from "tslib";
import { ChartAnnotation } from './ChartAnnotation';
import { Geometry } from '../Graphics/Geometry';
import { ChartAccessorService, ChartTooltipType } from '../../../services/chart';
var NewsChartAnnotation = (function (_super) {
    __extends(NewsChartAnnotation, _super);
    function NewsChartAnnotation(chart, config) {
        var _this = _super.call(this, chart, config) || this;
        _this.width = 12;
        _this.height = 10;
        _this.padding = 10;
        if (!config.categoryNews) {
            throw new Error('cannot find data for chart annotation');
        }
        _this.categoryNews = config.categoryNews;
        return _this;
    }
    NewsChartAnnotation.prototype.draw = function () {
        var x = this.bounds().left;
        if (!this.xInsideView(x)) {
            return;
        }
        var bounds = this.bounds(), y = bounds.top, height = bounds.height, width = bounds.width, context = this.context, theme = {
            strokeColor: '#3572B0',
            lineStyle: 'solid',
            width: 1
        };
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x, y + height);
        context.lineTo(x + width, y + height);
        context.lineTo(x + width, y);
        context.lineTo(x + (width / 2), y + height - 3);
        context.lineTo(x, y);
        context.lineTo(x + width, y);
        context.scxStroke(theme);
    };
    NewsChartAnnotation.prototype.bounds = function () {
        var x = this.projection.xByRecord(this.getRecord()), y = this.projection.yByValue(this.getCandleHigh());
        return {
            left: Math.round(x - (this.width / 2)),
            top: Math.round(y - this.height - this.padding - this.getOffsetDistance()),
            width: this.width,
            height: this.height
        };
    };
    NewsChartAnnotation.prototype.isVisible = function () {
        return true;
    };
    NewsChartAnnotation.prototype.hitTest = function (point) {
        var record = this.getRecord();
        var x = this.projection.xByRecord(record);
        if (!this.xInsideView(x)) {
            return false;
        }
        return Geometry.isPointInsideOrNearRect(point, this.bounds());
    };
    NewsChartAnnotation.prototype.handleMouseHoverGesture = function (gesture, event) {
        _super.prototype.handleMouseHoverGesture.call(this, gesture, event);
        var bounds = this.bounds();
        if (Geometry.isPointInsideOrNearRect(event.pointerPosition, this.bounds())) {
            ChartAccessorService.instance.getChartTooltipService().show(ChartTooltipType.News, {
                chartPanel: this.chartPanel,
                mousePosition: { x: bounds.left, y: bounds.top - bounds.height },
                newsId: this.categoryNews.id
            });
        }
        else {
            ChartAccessorService.instance.getChartTooltipService().hide(ChartTooltipType.News);
        }
    };
    NewsChartAnnotation.prototype.handleMouseClickGesture = function (gesture, event) {
    };
    NewsChartAnnotation.prototype.xInsideView = function (x) {
        return !(x < 0 || this.chartPanel.contentFrame.left + this.chartPanel.contentFrame.width < x);
    };
    NewsChartAnnotation.prototype.getOffsetDistance = function () {
        return (this.height + this.padding) * this.offset;
    };
    return NewsChartAnnotation;
}(ChartAnnotation));
export { NewsChartAnnotation };
//# sourceMappingURL=NewsChartAnnotation.js.map