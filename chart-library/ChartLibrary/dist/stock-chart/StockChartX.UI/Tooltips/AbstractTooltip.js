import { TimeSpan } from "../../StockChartX/Data/TimeFrame";
var AbstractTooltip = (function () {
    function AbstractTooltip() {
        this.shown = false;
    }
    AbstractTooltip.prototype.isIntradayChart = function (chart) {
        return chart.timeInterval < TimeSpan.MILLISECONDS_IN_DAY;
    };
    AbstractTooltip.prototype.setPosition = function (chartPanel, mousePosition, htmlId, width, flipped) {
        var offset = chartPanel.rootDiv.offset();
        var panelLeft = offset.left;
        var panelTop = offset.top;
        var tooltipWidth = width ? width : AbstractTooltip.defaultWidth;
        var absoluteMouseLeft = panelLeft + mousePosition.x;
        var absoluteMouseTop = panelTop + mousePosition.y;
        var left = flipped ? absoluteMouseLeft - AbstractTooltip.offset - tooltipWidth : absoluteMouseLeft + AbstractTooltip.offset;
        var top = absoluteMouseTop + AbstractTooltip.offset;
        $(htmlId).css('left', left).css('top', top);
        this.forceTooltipWithinScreenBounds($(htmlId).get(0), left, top, tooltipWidth);
    };
    AbstractTooltip.prototype.forceTooltipWithinScreenBounds = function (element, left, top, width) {
        if (!element) {
            return;
        }
        if ((left >= 0) && (width < window.innerWidth) && ((top + 225) < window.innerHeight)) {
            return;
        }
        var elementRectangle = element.getBoundingClientRect();
        if (left < 0) {
            $(element).css('left', 0 + "px");
        }
        if (window.innerWidth < (left + elementRectangle.width)) {
            var outOfScreenWidth = left + elementRectangle.width - window.innerWidth;
            var newLeft = left - outOfScreenWidth;
            $(element).css('left', newLeft + "px");
        }
        if (window.innerHeight < (top + elementRectangle.height)) {
            var outOfScreenHeight = top + elementRectangle.height - window.innerHeight;
            var newTop = top - outOfScreenHeight;
            $(element).css('top', newTop + "px");
        }
    };
    AbstractTooltip.offset = 10;
    AbstractTooltip.defaultWidth = 150;
    return AbstractTooltip;
}());
export { AbstractTooltip };
//# sourceMappingURL=AbstractTooltip.js.map