
import {Chart} from "../../StockChartX/Chart";
import {TimeSpan} from "../../StockChartX/Data/TimeFrame";
import {ChartPanel} from "../../StockChartX/ChartPanels/ChartPanel";
import {IPoint} from "../../StockChartX/Graphics/ChartPoint";

export abstract class AbstractTooltip {

    protected static offset: number = 10;
    protected static defaultWidth: number = 150;
    protected shown: boolean = false;

    constructor() {

    }

    protected isIntradayChart(chart: Chart) {
        return chart.timeInterval < TimeSpan.MILLISECONDS_IN_DAY;
    }

    protected setPosition(chartPanel: ChartPanel, mousePosition: IPoint, htmlId: string, width?: number, flipped?: boolean) {

        let offset = chartPanel.rootDiv.offset();
        let panelLeft = offset.left;
        let panelTop = offset.top;
        let tooltipWidth = width ? width : AbstractTooltip.defaultWidth;

        let absoluteMouseLeft = panelLeft + mousePosition.x;
        let absoluteMouseTop = panelTop + mousePosition.y;

        let left: number = flipped ? absoluteMouseLeft - AbstractTooltip.offset - tooltipWidth : absoluteMouseLeft + AbstractTooltip.offset;
        let top: number = absoluteMouseTop + AbstractTooltip.offset;

        $(htmlId).css('left', left).css('top', top);

        this.forceTooltipWithinScreenBounds($(htmlId).get(0), left, top, tooltipWidth);
    }

    private forceTooltipWithinScreenBounds(element: HTMLElement, left: number, top: number, width: number) {

        /**************************Handle Exception****************************/
        /*Exception Message: Cannot read property 'getBoundingClientRect' of undefined */
        /* NK in some cases user moves the mouse over candle or indicator (plot) and an element still in creating state (I saw it on safari).
        So, we end with an exception because the element is not initialized yet.*/
        if (!element) {
            return;
        }
        /**********************************************************************/

        // MA performance optimization, since getBoundingClientRect is cpu intensive.
        // Don't try to force tooltip within screen bounds unless it is close to the
        // screen bounds.
        if((left >= 0) && (width < window.innerWidth) && ((top + 225) < window.innerHeight)) {
            return;
        }

        // HA : there was a problem when try to hover on news thar are close to screen , you will se flicker in whole site .
        let elementRectangle = element.getBoundingClientRect();

        if(left < 0) {
            $(element).css('left', 0 + "px");
        }

        if (window.innerWidth < (left + elementRectangle.width)) {
            let outOfScreenWidth: number = left + elementRectangle.width - window.innerWidth;
            let newLeft = left - outOfScreenWidth;
            $(element).css('left', newLeft + "px");
        }

        if (window.innerHeight < (top + elementRectangle.height)) {
            let outOfScreenHeight = top + elementRectangle.height - window.innerHeight;
            let newTop = top - outOfScreenHeight;
            $(element).css('top', newTop + "px");
        }

    }

}
