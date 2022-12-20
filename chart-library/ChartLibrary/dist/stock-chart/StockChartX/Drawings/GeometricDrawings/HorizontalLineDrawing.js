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
import { Drawing } from '../Drawing';
import { Geometry } from '../../Graphics/Geometry';
import { ChartPoint } from '../../Graphics/ChartPoint';
import { DummyCanvasContext } from '../../Utils/DummyCanvasContext';
import { HtmlUtil } from '../../Utils/HtmlUtil';
import { DrawingTextHorizontalPosition, DrawingTextVerticalPosition } from '../DrawingTextPosition';
import { AlertableDrawing } from '../AlertableDrawing';
import { Interval } from '../../../../services/loader';
import { BrowserUtils } from '../../../../utils';
var HorizontalLineDrawing = (function (_super) {
    __extends(HorizontalLineDrawing, _super);
    function HorizontalLineDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(HorizontalLineDrawing, "className", {
        get: function () {
            return 'horizontalLine';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HorizontalLineDrawing.prototype, "text", {
        get: function () {
            if (this._options.text == undefined)
                this._options.text = '';
            return this._options.text;
        },
        set: function (value) {
            this._options.text = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HorizontalLineDrawing.prototype, "textHorizontalPosition", {
        get: function () {
            return this.getDrawingTheme().text.textAlign;
        },
        set: function (value) {
            this.getDrawingTheme().text.textAlign = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HorizontalLineDrawing.prototype, "textVerticalPosition", {
        get: function () {
            return this.getDrawingTheme().text.textVerticalAlign;
        },
        set: function (value) {
            this.getDrawingTheme().text.textVerticalAlign = value;
        },
        enumerable: true,
        configurable: true
    });
    HorizontalLineDrawing.prototype.bounds = function () {
        var point = this.cartesianPoint(0);
        if (!point)
            return null;
        var frame = this.chartPanel.contentFrame;
        return {
            left: frame.left,
            top: point.y,
            width: frame.width,
            height: 1
        };
    };
    HorizontalLineDrawing.prototype.hitTest = function (point) {
        var p = this.cartesianPoint(0);
        return point && Geometry.isValueNearValue(point.y, p.y);
    };
    HorizontalLineDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var point = this.cartesianPoint(0);
        if (!point)
            return;
        var context = this.chartPanel.context, frame = this.chartPanel.contentFrame;
        context.beginPath();
        context.moveTo(frame.left, point.y);
        context.lineTo(frame.right, point.y);
        context.scxStroke(this.getDrawingTheme().line);
        if (this.selected) {
            var x = Math.round(frame.left + frame.width / 2);
            this._drawSelectionMarkers({ x: x, y: point.y });
        }
        this.drawValue();
        if (this.text.length) {
            this.drawText(point);
        }
        this.drawAlertBellIfNeeded();
    };
    HorizontalLineDrawing.prototype.drawValue = function () {
        var textTheme = { fontFamily: 'Calibri', fontSize: 12, fillColor: '#555', decoration: '' };
        var point = this.cartesianPoint(0), frame = this.chartPanel.contentFrame, context = this.chartPanel.context, value = this.projection.valueByY(point.y), text = this.chartPanel.formatValue(value);
        if (BrowserUtils.isMobile()) {
            var padding = 2, valuePosition = { x: Math.round(frame.right - padding), y: point.y };
            textTheme.fillColor = 'black';
            textTheme.fontSize = 9;
            var textSize = DummyCanvasContext.measureText(text, textTheme);
            context.scxApplyTextTheme(textTheme);
            context.fillText(text, valuePosition.x - textSize.width, valuePosition.y - padding);
        }
        else {
            var theme = this.getDrawingTheme(), textSize = DummyCanvasContext.measureText(text, textTheme), padding = 5, valuePosition = { x: Math.round(frame.right - padding), y: point.y };
            var x = valuePosition.x - textSize.width - (2 * padding), y = valuePosition.y - textSize.height - (3 * padding), width = textSize.width + (padding * 2), height = textSize.height + (padding * 2);
            context.scxApplyFillTheme({ fillColor: theme.line.strokeColor });
            context.fillRect(x, y, width, height);
            textTheme.fillColor = HtmlUtil.isDarkColor(theme.line.strokeColor) ? 'white' : 'black';
            context.scxApplyTextTheme(textTheme);
            context.fillText(text, x + padding, y + (3 * padding));
        }
    };
    HorizontalLineDrawing.prototype.drawText = function (point) {
        var context = this.context;
        var textDrawingPoint = {
            x: this.getTextHorizontalPosition(point),
            y: this.getTextVerticalPosition(point)
        };
        context.scxApplyTextTheme(this.getDrawingTheme().text);
        context.fillText(this.text, textDrawingPoint.x, textDrawingPoint.y);
    };
    HorizontalLineDrawing.prototype.getTextHorizontalPosition = function (point) {
        var textTheme = { fontFamily: 'Calibri', fontSize: 12, fillColor: '#555', decoration: '' };
        var position = 0, value = this.projection.valueByY(point.y), yValue = this.chartPanel.formatValue(value), frame = this.chartPanel.contentFrame, padding = 5, yValueBoxWidth = DummyCanvasContext.measureText(yValue, textTheme).width;
        switch (this.textHorizontalPosition) {
            case DrawingTextHorizontalPosition.RIGHT:
                position = frame.right - yValueBoxWidth - (padding * 4);
                break;
            case DrawingTextHorizontalPosition.CENTER:
                position = frame.width / 2;
                break;
            case DrawingTextHorizontalPosition.LEFT:
                position = frame.left + padding;
                break;
            default:
                throw new Error("Unknown horizontal text position type: " + this.textHorizontalPosition);
        }
        return position;
    };
    HorizontalLineDrawing.prototype.isHorizontalLineAlert = function () {
        return true;
    };
    HorizontalLineDrawing.prototype.canAlertExtendRight = function () {
        return true;
    };
    HorizontalLineDrawing.prototype.canAlertExtendLeft = function () {
        return true;
    };
    HorizontalLineDrawing.prototype.getAlertFirstChartPoint = function () {
        return this.chartPoints[0];
    };
    HorizontalLineDrawing.prototype.getAlertIconPoint = function () {
        var point = this.cartesianPoint(0);
        var frame = this.chartPanel.contentFrame;
        point.x = Math.round(frame.left + frame.width / 2);
        return point;
    };
    HorizontalLineDrawing.prototype.getAlertSecondChartPoint = function () {
        var firstPoint = this.chartPoints[0];
        var interval = Interval.fromChartInterval(this.chart.timeInterval);
        var symbol = this.chart.instrument.symbol;
        var nextCandleDate = null;
        return new ChartPoint({
            date: nextCandleDate,
            value: firstPoint.value
        });
    };
    HorizontalLineDrawing.prototype.getTextVerticalPosition = function (point) {
        var position = 0, textSize = DummyCanvasContext.measureText(this.text, this.getDrawingTheme().text), padding = 5;
        switch (this.textVerticalPosition) {
            case DrawingTextVerticalPosition.TOP:
                position = point.y - textSize.height + padding;
                break;
            case DrawingTextVerticalPosition.MIDDLE:
                position = point.y + padding;
                break;
            case DrawingTextVerticalPosition.BOTTOM:
                position = point.y + textSize.height + padding;
                break;
            default:
                throw new Error("Unknown vertical text position type: " + this.textVerticalPosition);
        }
        return position;
    };
    HorizontalLineDrawing.prototype.shouldDrawMarkers = function () {
        return false;
    };
    return HorizontalLineDrawing;
}(AlertableDrawing));
export { HorizontalLineDrawing };
Drawing.register(HorizontalLineDrawing);
//# sourceMappingURL=HorizontalLineDrawing.js.map