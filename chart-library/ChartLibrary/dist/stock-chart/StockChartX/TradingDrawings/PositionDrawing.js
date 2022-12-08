import { __extends } from "tslib";
import { ChartAccessorService, ChartTooltipType } from '../../../services/chart';
import { BrowserUtils, StringUtils, Tc } from '../../../utils';
import { ChartPoint } from '../../StockChartX/Graphics/ChartPoint';
import { DummyCanvasContext } from '../../StockChartX/Utils/DummyCanvasContext';
import { ChartEvent } from '../Chart';
import { Geometry } from '../../StockChartX/Graphics/Geometry';
import { TradingDrawingsDefaultSettings } from './TradingDrawingsDefaultSettings';
import { ThemedTradingDrawing } from './ThemedTradingDrawing';
import { ThemeType } from '../ThemeType';
var PositionDrawing = (function (_super) {
    __extends(PositionDrawing, _super);
    function PositionDrawing(chart, position) {
        var _this = _super.call(this, chart) || this;
        _this.theme = chart.getThemeType() == ThemeType.Light ?
            TradingDrawingsDefaultSettings.getTradingPositionTheme().Light : TradingDrawingsDefaultSettings.getTradingPositionTheme().Dark;
        _this.chartPoint = new ChartPoint({ x: 0, value: position.averagePrice });
        _this._position = position;
        _this._tradingService = ChartAccessorService.instance.getTradingService();
        return _this;
    }
    Object.defineProperty(PositionDrawing, "className", {
        get: function () {
            return 'tradingPosition';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PositionDrawing.prototype, "visible", {
        get: function () {
            if (!this.chart) {
                return false;
            }
            return ChartAccessorService.instance.getTradingService().showPositionDrawings;
        },
        set: function (value) {
            if (!this.chart) {
                return;
            }
            ChartAccessorService.instance.getTradingService().showPositionDrawings = value;
        },
        enumerable: false,
        configurable: true
    });
    PositionDrawing.prototype.bounds = function () {
        this.setBounds();
        return this._bounds;
    };
    PositionDrawing.prototype.hitTest = function (point) {
        if (!this.visible)
            return false;
        return point && Geometry.isPointInsideOrNearRect(point, this.bounds());
    };
    PositionDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var point = this.cartesianPoint();
        if (!point) {
            return;
        }
        this.drawLine();
        this.drawCancelBox();
        if (this._reverseBounds) {
            this.drawReverseBox();
        }
        this.drawQuantityBox();
        this.drawCostDiffBox();
    };
    PositionDrawing.prototype.drawValueMarkers = function () {
        if (!this.visible)
            return;
        var context = this.chartPanel.context, value = this.chartPoint.value, text = "" + this.chartPanel.formatValue(Tc._2digits(value)), theme = this.actualTheme, textSize = DummyCanvasContext.measureText(text, theme.valueMarketText), padding = 2, bounds = this.bounds(), x = Math.round(bounds.left + bounds.width + 22), y = Math.round(bounds.top + (2 * padding)), width = Math.round(this.chartPanel.valueScale.rightFrame.width), height = Math.round(textSize.height + (2 * padding));
        if (BrowserUtils.isMobile()) {
            x = this.chartPanel.contentFrame.right + 2;
        }
        context.beginPath();
        context.rect(x, y, width, height);
        context.scxFillStroke(theme.valueMarkerFill, theme.borderLine);
        context.scxApplyTextTheme(theme.valueMarketText);
        context.fillText(text, x + padding, y + textSize.height - 1);
    };
    PositionDrawing.prototype.drawLine = function () {
        var point = this.cartesianPoint(), context = this.chartPanel.context, frame = this.chartPanel.contentFrame, theme = this.actualTheme;
        context.beginPath();
        context.moveTo(frame.left, point.y);
        context.lineTo(frame.right, point.y);
        context.scxStroke(theme.dashedLine);
    };
    PositionDrawing.prototype.drawCancelBox = function () {
        var context = this.chartPanel.context, theme = this.actualTheme, padding = 5, bounds = this._cancelBounds, x = bounds.left, y = bounds.top, width = bounds.width, height = bounds.height;
        context.beginPath();
        context.rect(x, y, width, height);
        context.scxFillStroke(theme.fill, theme.borderLine);
        context.scxApplyTextTheme(theme.cancelText);
        context.fillText(this.getCancelText(), x + padding, y + (3 * padding) - 1);
    };
    PositionDrawing.prototype.drawReverseBox = function () {
        var context = this.chartPanel.context, theme = this.actualTheme, bounds = this._reverseBounds, x = bounds.left, y = bounds.top, width = bounds.width, height = bounds.height;
        context.beginPath();
        context.rect(x, y, width, height);
        context.scxFillStroke(theme.fill, theme.borderLine);
        this.drawReverseArrows();
    };
    PositionDrawing.prototype.drawReverseArrows = function () {
        this.drawUpArrow();
        this.drawDownArrow();
    };
    PositionDrawing.prototype.drawUpArrow = function () {
        var context = this.context, boxBounds = this._reverseBounds, arrowBounds = this.getArrowBounds(), height = arrowBounds.height, halfWidth = arrowBounds.halfWidth, halfTailWidth = arrowBounds.halfTailWidth, triangleHeight = arrowBounds.triangleHeight, x = boxBounds.left + boxBounds.width / 2 - halfWidth, y = boxBounds.top + triangleHeight, theme = { fillColor: '#ff0000' };
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + halfWidth, y + triangleHeight);
        context.lineTo(x + halfTailWidth, y + triangleHeight);
        context.lineTo(x + halfTailWidth, y + height);
        context.lineTo(x - halfTailWidth, y + height);
        context.lineTo(x - halfTailWidth, y + triangleHeight);
        context.lineTo(x - halfWidth, y + triangleHeight);
        context.closePath();
        context.scxFill(theme);
    };
    PositionDrawing.prototype.drawDownArrow = function () {
        var context = this.context, boxBounds = this._reverseBounds, arrowBounds = this.getArrowBounds(), height = arrowBounds.height, halfWidth = arrowBounds.halfWidth, halfTailWidth = arrowBounds.halfTailWidth, triangleHeight = arrowBounds.triangleHeight, padding = 2, x = boxBounds.left + boxBounds.width / 2 + halfWidth, y = boxBounds.top + boxBounds.height / 2 + triangleHeight + padding, theme = { fillColor: '#00ff00' };
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x - halfWidth, y - triangleHeight);
        context.lineTo(x - halfTailWidth, y - triangleHeight);
        context.lineTo(x - halfTailWidth, y - height);
        context.lineTo(x + halfTailWidth, y - height);
        context.lineTo(x + halfTailWidth, y - triangleHeight);
        context.lineTo(x + halfWidth, y - triangleHeight);
        context.closePath();
        context.scxFill(theme);
    };
    PositionDrawing.prototype.drawQuantityBox = function () {
        var context = this.chartPanel.context, theme = this.actualTheme, padding = 5, bounds = this._quantityBounds, x = bounds.left, y = bounds.top, width = bounds.width, height = bounds.height;
        context.beginPath();
        context.rect(x, y, width, height);
        context.scxFillStroke(theme.coloredFill, theme.borderLine);
        context.scxApplyTextTheme(theme.quantityText);
        context.fillText(this.getQuantityText(), x + padding, y + (3 * padding) - 1);
    };
    PositionDrawing.prototype.drawCostDiffBox = function () {
        var context = this.chartPanel.context, theme = $.extend(true, {}, this.actualTheme), padding = 5, bounds = this._costDiffBounds, x = bounds.left, y = bounds.top, width = bounds.width, height = bounds.height;
        context.beginPath();
        context.rect(x, y, width, height);
        context.scxFillStroke(theme.fill, theme.borderLine);
        theme.text.fillColor = this.getCostDiffTextColor();
        context.scxApplyTextTheme(theme.text);
        context.fillText(this.getCostDiffText(), x + padding, y + (3 * padding) - 1);
    };
    PositionDrawing.prototype.getTextSize = function (text) {
        return DummyCanvasContext.measureText(text, this.actualTheme.text);
    };
    PositionDrawing.prototype.getReverseBoxWidth = function () {
        return 14;
    };
    PositionDrawing.prototype.getArrowBounds = function () {
        var width = 10, height = 10;
        return {
            width: width,
            height: height,
            halfWidth: width / 2 - 1,
            halfTailWidth: width / 3 / 2,
            triangleHeight: height / 2 - 1,
        };
    };
    PositionDrawing.prototype.setBounds = function () {
        var point = this.cartesianPoint(), frame = this.chartPanel.contentFrame, cancelTextSize = this.getTextSize(this.getCancelText()), quantityTextSize = this.getTextSize(this.getQuantityText()), costDiffTextSize = this.getTextSize(this.getCostDiffText()), padding = 5, rightMargin = Math.round(frame.right - 20), top = Math.round(point.y - (costDiffTextSize.height / 2) - padding), height = costDiffTextSize.height + (padding * 2);
        if (BrowserUtils.isMobile()) {
            this._cancelBounds = {
                left: (2 * padding),
                top: top,
                width: cancelTextSize.width + (2 * padding),
                height: height
            };
            if (this._tradingService.hasReversePositionOption()) {
                this._reverseBounds = {
                    left: this._cancelBounds.left + this.getReverseBoxWidth(),
                    top: top,
                    width: this.getReverseBoxWidth(),
                    height: height
                };
            }
            this._quantityBounds = {
                left: !this._reverseBounds ? this._cancelBounds.left + this._cancelBounds.width : this._reverseBounds.left + this._cancelBounds.width,
                top: top,
                width: quantityTextSize.width + (2 * padding),
                height: height
            };
            this._costDiffBounds = {
                left: this._quantityBounds.left + this._quantityBounds.width,
                top: top,
                width: costDiffTextSize.width + 2 * padding,
                height: height
            };
            this._bounds = {
                left: this._cancelBounds.left,
                top: top,
                width: !this._reverseBounds ? this._cancelBounds.width + this._quantityBounds.width + this._costDiffBounds.width :
                    this._cancelBounds.width + this._reverseBounds.width + this._quantityBounds.width + this._costDiffBounds.width,
                height: height
            };
        }
        else {
            this._cancelBounds = {
                left: rightMargin - cancelTextSize.width - (2 * padding),
                top: top,
                width: cancelTextSize.width + (2 * padding),
                height: height
            };
            if (this._tradingService.hasReversePositionOption()) {
                this._reverseBounds = {
                    left: this._cancelBounds.left - this.getReverseBoxWidth() - (2 * padding),
                    top: top,
                    width: this.getReverseBoxWidth() + (2 * padding),
                    height: height
                };
            }
            this._quantityBounds = {
                left: !this._reverseBounds ? this._cancelBounds.left - quantityTextSize.width - (2 * padding) : this._reverseBounds.left - quantityTextSize.width - (2 * padding),
                top: top,
                width: quantityTextSize.width + (2 * padding),
                height: height
            };
            this._costDiffBounds = {
                left: this._quantityBounds.left - costDiffTextSize.width - (2 * padding),
                top: top,
                width: costDiffTextSize.width + (2 * padding),
                height: height
            };
            this._bounds = {
                left: this._costDiffBounds.left,
                top: top,
                width: this.getBoundsWidth(),
                height: height
            };
        }
    };
    PositionDrawing.prototype.getBoundsWidth = function () {
        if (this._reverseBounds) {
            return this._cancelBounds.width + this._reverseBounds.width + this._quantityBounds.width + this._costDiffBounds.width;
        }
        return this._cancelBounds.width + this._quantityBounds.width + this._costDiffBounds.width;
    };
    PositionDrawing.prototype.getCancelText = function () {
        return "X";
    };
    PositionDrawing.prototype.getQuantityText = function () {
        return "" + this._position.quantity;
    };
    PositionDrawing.prototype.getCostDiffText = function () {
        var value = null;
        if (this._position.profitLoss) {
            value = StringUtils.formatVariableDigitsNumber(this._position.profitLoss);
        }
        else {
            value = StringUtils.formatVariableDigitsNumber(Math.abs(this._position.totalCost - this._position.currentTotalCost));
        }
        return "" + value;
    };
    PositionDrawing.prototype.getCostDiffTextColor = function () {
        if (this._position.profitLoss) {
            if (this._position.profitLoss >= 0) {
                return this.chart.getThemeType() == ThemeType.Dark ? '#0f0' : '#080';
            }
            else {
                return 'red';
            }
        }
        else {
            if (this._position.totalCost < this._position.currentTotalCost) {
                return this.chart.getThemeType() == ThemeType.Dark ? '#0f0' : '#080';
            }
            else if (this._position.totalCost > this._position.currentTotalCost) {
                return 'red';
            }
            else {
                return this.chart.getThemeType() == ThemeType.Dark ? 'white' : 'black';
            }
        }
    };
    PositionDrawing.prototype._handleClickGesture = function (gesture, event) {
        _super.prototype._handleClickGesture.call(this, gesture, event);
        if (this._tradingService.hasClosePositionOption() && Geometry.isPointInsideOrNearRect(event.pointerPosition, this._cancelBounds)) {
            this.fire(ChartEvent.CLOSE_POSITION, this._position);
        }
        else if (!this._tradingService.hasClosePositionOption() && Geometry.isPointInsideOrNearRect(event.pointerPosition, this._cancelBounds)) {
            this.fire(ChartEvent.SELL_POSITION, this._position.symbol);
        }
        else if (this._reverseBounds && Geometry.isPointInsideOrNearRect(event.pointerPosition, this._reverseBounds)) {
            this.fire(ChartEvent.REVERSE_POSITION, this._position);
        }
        else if (Geometry.isPointInsideOrNearRect(event.pointerPosition, this._bounds)) {
            this.fire(ChartEvent.BOUND_POSITION_CLICKED, this._position);
        }
    };
    PositionDrawing.prototype._handleDoubleClickGesture = function () {
        _super.prototype._handleDoubleClickGesture.call(this);
        if (!this._tradingService.hasClosePositionOption()) {
            this.fire(ChartEvent.SELL_POSITION, this._position.symbol);
        }
    };
    PositionDrawing.prototype._handleMouseHover = function (gesture, event) {
        _super.prototype._handleMouseHover.call(this, gesture, event);
        var tooltipText = 'ربح / خسارة';
        if (Geometry.isPointInsideOrNearRect(event.pointerPosition, this._cancelBounds)) {
            tooltipText = this._tradingService.hasClosePositionOption() ? 'إغلاق الصفقة' : 'بيع';
        }
        else if (Geometry.isPointInsideOrNearRect(event.pointerPosition, this._quantityBounds)) {
            tooltipText = 'الكمية';
        }
        else if (this._reverseBounds && Geometry.isPointInsideOrNearRect(event.pointerPosition, this._reverseBounds)) {
            tooltipText = 'عكس الصفقة';
        }
        if (Geometry.isPointInsideOrNearRect(event.pointerPosition, this._bounds)) {
            ChartAccessorService.instance.getChartTooltipService().show(ChartTooltipType.Trading, {
                chartPanel: this.chartPanel,
                mousePosition: event.pointerPosition,
                text: ChartAccessorService.instance.translate(tooltipText)
            });
        }
        else {
            ChartAccessorService.instance.getChartTooltipService().hide(ChartTooltipType.Trading);
        }
    };
    return PositionDrawing;
}(ThemedTradingDrawing));
export { PositionDrawing };
//# sourceMappingURL=PositionDrawing.js.map