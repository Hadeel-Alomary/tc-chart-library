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
import { Drawing } from "../Drawing";
import { Geometry } from "../../Graphics/Geometry";
import { DummyCanvasContext } from "../../Utils/DummyCanvasContext";
import { HtmlUtil } from "../../Utils/HtmlUtil";
import { TimeSpan } from "../../Data/TimeFrame";
import { ThemedDrawing } from '../ThemedDrawing';
var CrossLineDrawing = (function (_super) {
    __extends(CrossLineDrawing, _super);
    function CrossLineDrawing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.intradDayTimeIntervals = [TimeSpan.MILLISECONDS_IN_MINUTE, TimeSpan.MILLISECONDS_IN_HOUR];
        return _this;
    }
    Object.defineProperty(CrossLineDrawing, "className", {
        get: function () {
            return 'crossLine';
        },
        enumerable: true,
        configurable: true
    });
    CrossLineDrawing.prototype.bounds = function () {
        var point = this.cartesianPoint(0);
        if (!point)
            return null;
        var frame = this.chartPanel.contentFrame;
        return {
            left: frame.left,
            top: frame.top,
            width: frame.width,
            height: frame.height
        };
    };
    CrossLineDrawing.prototype.hitTest = function (point) {
        var p = this.cartesianPoint(0);
        return point && Geometry.isValueNearValue(point.x, p.x) || Geometry.isValueNearValue(point.y, p.y);
    };
    CrossLineDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var point = this.cartesianPoint(0);
        if (!point)
            return;
        var context = this.context, frame = this.chartPanel.contentFrame;
        context.beginPath();
        context.moveTo(point.x, frame.top);
        context.lineTo(point.x, frame.bottom);
        context.scxStroke(this.getDrawingTheme().line);
        context.moveTo(frame.right, point.y);
        context.lineTo(frame.left, point.y);
        context.scxStroke(this.getDrawingTheme().line);
        if (this.selected) {
            this._drawSelectionMarkers({ x: point.x, y: point.y });
        }
        this.drawVerticalValue();
        this.drawHorizontalValue();
    };
    CrossLineDrawing.prototype.drawVerticalValue = function () {
        var textTheme = { fontFamily: 'Calibri', fontSize: 12, fillColor: '#555', decoration: '' };
        var point = this.cartesianPoint(0), frame = this.chartPanel.contentFrame, context = this.chartPanel.context, text = this.getFormattedDate(point.x), theme = this.getDrawingTheme(), textSize = DummyCanvasContext.measureText(text, textTheme), padding = 5, valuePosition = { x: point.x, y: Math.round(frame.bottom - padding) };
        context.scxApplyFillTheme({ fillColor: theme.line.strokeColor });
        var x = valuePosition.x + padding, y = valuePosition.y - textSize.height - (2 * padding), width = textSize.width + (padding * 2), height = textSize.height + (padding * 2);
        context.fillRect(x, y, width, height);
        textTheme.fillColor = HtmlUtil.isDarkColor(theme.line.strokeColor) ? 'white' : 'black';
        context.scxApplyTextTheme(textTheme);
        context.fillText(text, x + padding, y + textSize.height + (padding / 2));
    };
    CrossLineDrawing.prototype.getFormattedDate = function (x) {
        var date = this.projection.dateByColumn(this.projection.columnByX(x));
        if (this.intradDayTimeIntervals.indexOf(this.chart.timeInterval) !== -1)
            return moment(date).format("DD-MM-YYYY , HH:mm:ss");
        return moment(date).format("DD-MM-YYYY");
    };
    CrossLineDrawing.prototype.drawHorizontalValue = function () {
        var textTheme = { fontFamily: 'Calibri', fontSize: 12, fillColor: '#555', decoration: '' };
        var point = this.cartesianPoint(0), frame = this.chartPanel.contentFrame, context = this.chartPanel.context, value = this.projection.valueByY(point.y), text = this.chartPanel.formatValue(value), theme = this.getDrawingTheme(), textSize = DummyCanvasContext.measureText(text, textTheme), padding = 5, valuePosition = { x: Math.round(frame.right - padding), y: point.y };
        context.scxApplyFillTheme({ fillColor: theme.line.strokeColor });
        var x = valuePosition.x - textSize.width - (2 * padding), y = valuePosition.y - textSize.height - (3 * padding), width = textSize.width + (padding * 2), height = textSize.height + (padding * 2);
        context.fillRect(x, y, width, height);
        textTheme.fillColor = HtmlUtil.isDarkColor(theme.line.strokeColor) ? 'white' : 'black';
        context.scxApplyTextTheme(textTheme);
        context.fillText(text, x + padding, y + (3 * padding));
    };
    CrossLineDrawing.prototype.shouldDrawMarkers = function () {
        return false;
    };
    return CrossLineDrawing;
}(ThemedDrawing));
export { CrossLineDrawing };
Drawing.register(CrossLineDrawing);
//# sourceMappingURL=CrossLineDrawing.js.map