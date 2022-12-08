import { JsUtil } from "../Utils/JsUtil";
import { BrowserUtils } from '../../../utils';
import { PlotType } from '../../StockChartX/Plots/Plot';
var ValueMarker = (function () {
    function ValueMarker(theme) {
        this.theme = theme;
    }
    Object.defineProperty(ValueMarker.prototype, "textOffset", {
        get: function () {
            var offset = this._textOffset;
            return offset != null ? offset : ValueMarker.defaults.textOffset;
        },
        set: function (value) {
            if (value != null && JsUtil.isNegativeNumber(value))
                throw new Error('Text offset must be greater or equal to 0.');
            this._textOffset = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ValueMarker.prototype, "theme", {
        get: function () {
            return this._theme;
        },
        set: function (value) {
            this._theme = value;
        },
        enumerable: false,
        configurable: true
    });
    ValueMarker.prototype.draw = function (value, panelValueScale, offset, plotType) {
        if (plotType == PlotType.PRICE_STYLE) {
            this.drawArrowValueMarker(value, panelValueScale, offset);
        }
        else {
            this.drawRectangleValueMarker(value, panelValueScale, offset);
        }
    };
    ValueMarker.prototype.drawArrowValueMarker = function (value, panelValueScale, offset) {
        var leftFrame = panelValueScale.leftFrame, rightFrame = panelValueScale.rightFrame;
        if (!leftFrame && !rightFrame)
            return;
        var context = panelValueScale.chartPanel.context, text = panelValueScale.formatValue(value), y = panelValueScale.projection.yByValue(value) + offset, theme = this.theme, xTextOffset = this.textOffset, yOffset = theme.text.fontSize / 2 + (BrowserUtils.isMobileScreenDimensions() ? 3 : 1);
        context.save();
        panelValueScale.clip();
        context.beginPath();
        if (leftFrame) {
            var right = leftFrame.right - 1;
            context.moveTo(right, y);
            context.lineTo(right - yOffset, y + yOffset);
            context.lineTo(leftFrame.left, y + yOffset);
            context.lineTo(leftFrame.left, y - yOffset);
            context.lineTo(right - yOffset, y - yOffset);
            context.closePath();
            context.scxFillStroke(theme.fill, theme.line);
            context.scxApplyTextTheme(theme.text);
            context.textAlign = 'right';
            context.textBaseline = "middle";
            context.fillText(text, leftFrame.right - xTextOffset, y);
        }
        if (rightFrame) {
            var right = rightFrame.right - 1;
            context.moveTo(rightFrame.left, y);
            context.lineTo(rightFrame.left + yOffset, y - yOffset);
            context.lineTo(right, y - yOffset);
            context.lineTo(right, y + yOffset);
            context.lineTo(rightFrame.left + yOffset, y + yOffset);
            context.closePath();
            context.scxFillStroke(theme.fill, theme.line);
            theme.text.fillColor = '#fff';
            context.scxApplyTextTheme(theme.text);
            context.textAlign = 'left';
            context.textBaseline = "middle";
            context.fillText(text, rightFrame.left + xTextOffset, y);
        }
        context.restore();
    };
    ValueMarker.prototype.drawRectangleValueMarker = function (value, panelValueScale, offset) {
        var leftFrame = panelValueScale.leftFrame, rightFrame = panelValueScale.rightFrame;
        if (!leftFrame && !rightFrame)
            return;
        var context = panelValueScale.chartPanel.context, text = panelValueScale.formatValue(value), y = panelValueScale.projection.yByValue(value) + offset, theme = this.theme, xTextOffset = this.textOffset, yOffset = theme.text.fontSize / 2 + (BrowserUtils.isMobileScreenDimensions() ? 3 : 1);
        context.save();
        panelValueScale.clip();
        context.beginPath();
        if (leftFrame) {
            var right = leftFrame.right - 1;
            context.beginPath();
            context.rect(leftFrame.left, y - yOffset, right - leftFrame.left, yOffset * 2);
            context.scxFillStroke(theme.fill, theme.line);
            context.scxApplyTextTheme(theme.text);
            context.textAlign = 'right';
            context.textBaseline = "middle";
            context.fillText(text, leftFrame.right - xTextOffset, y);
        }
        if (rightFrame) {
            var right = rightFrame.right - 1;
            context.beginPath();
            context.rect(rightFrame.left, y - yOffset, right - rightFrame.left, yOffset * 2);
            context.scxFillStroke(theme.fill, theme.line);
            theme.text.fillColor = '#fff';
            context.scxApplyTextTheme(theme.text);
            context.textAlign = 'left';
            context.textBaseline = "middle";
            context.fillText(text, rightFrame.left + xTextOffset, y);
        }
        context.restore();
    };
    ValueMarker.defaults = {
        textOffset: 8,
    };
    return ValueMarker;
}());
export { ValueMarker };
//# sourceMappingURL=ValueMarker.js.map