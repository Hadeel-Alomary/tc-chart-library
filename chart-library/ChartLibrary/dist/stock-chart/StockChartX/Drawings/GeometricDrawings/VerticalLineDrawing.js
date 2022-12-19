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
import { Drawing } from "../Drawing";
import { Geometry } from "../../Graphics/Geometry";
import { TimeSpan } from "../../Data/TimeFrame";
import { DummyCanvasContext } from "../../Utils/DummyCanvasContext";
import { HtmlUtil } from "../../Utils/HtmlUtil";
import { ThemedDrawing } from '../ThemedDrawing';
import { BrowserUtils } from '../../../../utils';
var VerticalLineDrawing = (function (_super) {
    __extends(VerticalLineDrawing, _super);
    function VerticalLineDrawing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.intradDayTimeIntervals = [TimeSpan.MILLISECONDS_IN_MINUTE, TimeSpan.MILLISECONDS_IN_HOUR];
        return _this;
    }
    Object.defineProperty(VerticalLineDrawing, "className", {
        get: function () {
            return 'verticalLine';
        },
        enumerable: false,
        configurable: true
    });
    VerticalLineDrawing.prototype.bounds = function () {
        var point = this.cartesianPoint(0);
        if (!point)
            return null;
        var frame = this.chartPanel.contentFrame;
        return {
            left: point.x,
            top: frame.top,
            width: 1,
            height: frame.height
        };
    };
    VerticalLineDrawing.prototype.hitTest = function (point) {
        var p = this.cartesianPoint(0);
        return point && Geometry.isValueNearValue(point.x, p.x);
    };
    VerticalLineDrawing.prototype.draw = function () {
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
        if (this.selected) {
            var y = Math.round(frame.top + frame.height / 2);
            this._drawSelectionMarkers({ x: point.x, y: y });
        }
        this.drawValue();
    };
    VerticalLineDrawing.prototype.drawValue = function () {
        var textTheme = { fontFamily: 'Calibri', fontSize: 12, fillColor: '#555', decoration: '' };
        var point = this.cartesianPoint(0), frame = this.chartPanel.contentFrame, context = this.chartPanel.context, text = this.getFormattedDate(point.x), theme = this.getDrawingTheme();
        if (BrowserUtils.isMobile()) {
            var padding = 2, valuePosition = { x: point.x, y: Math.round(frame.bottom - padding) };
            textTheme.fillColor = 'black';
            textTheme.fontSize = 9;
            var textSize = DummyCanvasContext.measureText(text, textTheme);
            context.scxApplyTextTheme(textTheme);
            context.fillText(text, valuePosition.x + padding, valuePosition.y);
        }
        else {
            var textSize = DummyCanvasContext.measureText(text, textTheme), padding = 5, valuePosition = { x: point.x, y: Math.round(frame.bottom - padding) };
            context.scxApplyFillTheme({ fillColor: theme.line.strokeColor });
            var x = valuePosition.x + padding, y = valuePosition.y - textSize.height - (2 * padding), width = textSize.width + (padding * 2), height = textSize.height + (padding * 2);
            context.fillRect(x, y, width, height);
            textTheme.fillColor = HtmlUtil.isDarkColor(theme.line.strokeColor) ? 'white' : 'black';
            context.scxApplyTextTheme(textTheme);
            context.fillText(text, x + padding, y + textSize.height + (padding / 2));
        }
    };
    VerticalLineDrawing.prototype.getFormattedDate = function (x) {
        var date = this.projection.dateByColumn(this.projection.columnByX(x));
        if (this.intradDayTimeIntervals.indexOf(this.chart.timeInterval) !== -1)
            return moment(date).format("DD-MM-YYYY , HH:mm:ss");
        return moment(date).format("DD-MM-YYYY");
    };
    VerticalLineDrawing.prototype.shouldDrawMarkers = function () {
        return false;
    };
    return VerticalLineDrawing;
}(ThemedDrawing));
export { VerticalLineDrawing };
Drawing.register(VerticalLineDrawing);
//# sourceMappingURL=VerticalLineDrawing.js.map