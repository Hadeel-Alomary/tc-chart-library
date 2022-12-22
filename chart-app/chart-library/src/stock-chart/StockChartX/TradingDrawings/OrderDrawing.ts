import {TradingOrder} from '../../../services/trading/broker/models';
import {ChartAccessorService, ChartTooltipType} from '../../../services/chart';
import {BrowserUtils, Tc} from '../../../utils';
import {TradingOrderSideType} from '../../../services/trading/broker/models/trading-order-side';
import {TradingOrderType} from '../../../services/trading/broker/models/trading-order-type';
import {ChartPoint, IPoint} from '../../StockChartX/Graphics/ChartPoint';
import {IRect} from '../../StockChartX/Graphics/Rect';
import {DummyCanvasContext} from '../../StockChartX/Utils/DummyCanvasContext';
import {Chart, ChartEvent} from '../Chart';
import {Geometry} from '../../StockChartX/Graphics/Geometry';
import {Gesture, WindowEvent} from '../../StockChartX/Gestures/Gesture';
import {TradingColorThemeElement, TradingDrawingsDefaultSettings, TradingOrderTheme} from './TradingDrawingsDefaultSettings';
import {ThemedTradingDrawing} from './ThemedTradingDrawing';
import {ThemeType} from '../ThemeType';
import {TradingService} from '../../../services/trading';

export class OrderDrawing extends ThemedTradingDrawing<TradingOrderTheme> {
    static get className(): string {
        return 'tradingOrder';
    }

    private _cancelBounds: IRect;
    private _quantityBounds: IRect;
    private _orderDetailsBounds: IRect;
    private _bounds: IRect;

    protected _order: TradingOrder;
    private _tradingService: TradingService;

    protected _orderDetailsText: string;

    get visible(): boolean {
        if(!this.chart){
            return false;
        }
        return ChartAccessorService.instance.getTradingService().showOrderDrawings;
    }

    set visible(value: boolean) {
        if(!this.chart){
            return;
        }

        ChartAccessorService.instance.getTradingService().showPositionDrawings = value;
    }

    constructor(chart:Chart, order: TradingOrder) {
        super(chart);

        this.theme = this.chart.getThemeType() == ThemeType.Light ?
            TradingDrawingsDefaultSettings.getTradingOrderTheme().Light : TradingDrawingsDefaultSettings.getTradingOrderTheme().Dark;

        this.setChartPoint(order);
        this._tradingService = ChartAccessorService.instance.getTradingService();
        this._order = order;
        this.setColorsAndFonts();
    }

    public getOrder():TradingOrder {
        return this._order;
    }

    public setOrder(order: TradingOrder) {
        this.setChartPoint(order);
        this._order = order;
    }

    public draw() {
        if (!this.visible)
            return;

        let point = this.cartesianPoint();
        if (!point) {
            return;
        }

        this.drawLine();
        if(this._tradingService.hasCancelOrderOption(this._order.id)){
            this.drawCancelBox();
        }
        this.drawQuantityBox();
        this.drawOrderDetailsBox();
    }

    public drawValueMarkers() {
        if (!this.visible)
            return;

        let context = this.chartPanel.context,
            value = this.chartPoint.value,
            text = `${this.chartPanel.formatValue(Tc._2digits(value))}`,
            theme = this.actualTheme,
            textSize = DummyCanvasContext.measureText(text, theme.valueMarketText),
            padding = 2,
            bounds = this.bounds(),
            x = Math.round(bounds.left + bounds.width + 22),
            y = Math.round(bounds.top + (2 * padding)),
            width = Math.round(this.chartPanel.valueScale.rightFrame.width),
            height = Math.round(textSize.height + (2 * padding));


        if(BrowserUtils.isMobile()) {
            x = this.chartPanel.contentFrame.right + 2;
        }

        context.beginPath();
        context.rect(x, y, width, height);
        context.scxFillStroke(theme.valueMarkerFill, theme.line);

        context.scxApplyTextTheme(theme.valueMarketText);
        context.fillText(text, x + padding, y + textSize.height - 1);
    }

    private drawLine() {
        let point = this.cartesianPoint(),
            context = this.chartPanel.context,
            frame = this.chartPanel.contentFrame,
            theme = this.actualTheme;

        context.beginPath();
        context.moveTo(frame.left, point.y);
        context.lineTo(frame.right, point.y);
        context.scxStroke(theme.dashedLine);
    }

    private drawCancelBox() {
        let context = this.chartPanel.context,
            theme = this.actualTheme,
            padding = 5,
            bounds = this._cancelBounds,
            x = bounds.left,
            y = bounds.top,
            width = bounds.width,
            height = bounds.height;

        context.beginPath();
        context.rect(x, y, width, height);
        context.scxFillStroke(theme.fill, theme.line);

        context.scxApplyTextTheme(theme.cancelText);
        context.fillText(this.getCancelText(), x + padding, y + (3 * padding) - 1);
    }

    private drawQuantityBox() {
        let context = this.chartPanel.context,
            theme = this.actualTheme,
            padding = 5,
            bounds = this._quantityBounds,
            x = bounds.left,
            y = bounds.top,
            width = bounds.width,
            height = bounds.height;

        context.beginPath();
        context.rect(x, y, width, height);
        context.scxFillStroke(theme.coloredFill, theme.line);

        context.scxApplyTextTheme(theme.quantityText);
        context.fillText(this.getQuantityText(), x + padding, y + (3 * padding) - 1);
    }

    private drawOrderDetailsBox() {
        let context = this.chartPanel.context,
            theme = this.actualTheme,
            padding = 5,
            bounds = this._orderDetailsBounds,
            x = bounds.left,
            y = bounds.top,
            width = bounds.width,
            height = bounds.height;

        context.beginPath();
        context.rect(x, y, width, height);
        context.scxFillStroke(theme.fill, theme.line);

        context.scxApplyTextTheme(theme.text);

        let xPadding = BrowserUtils.isDesktop() ? x + (2 * padding) : x + padding;

        context.fillText(this.getDetailsText(), xPadding, y + 3 * padding - 2);

        if(BrowserUtils.isDesktop()) {
            this.drawDragMarks();
        }

    }

    private drawDragMarks() {
        let context = this.chartPanel.context,
            theme = this.actualTheme,
            bounds = this._orderDetailsBounds,
            x = bounds.left + 4,
            y = bounds.top + 7,
            width = 2,
            numberOfMarks = 6,
            marksSpacing = 2;

        context.beginPath();
        for(let i = 0; i < numberOfMarks; i++) {
            context.moveTo(x, y);
            context.lineTo(x + width, y);
            y += marksSpacing;
        }
        context.scxStroke(theme.line);
    }

    private getTextSize(text: string) {
        let theme = this.actualTheme;
        return DummyCanvasContext.measureText(text, theme.text);
    }

    private setBounds() {
        let point = this.cartesianPoint(),
            frame = this.chartPanel.contentFrame,
            cancelTextSize = this.getTextSize(this.getCancelText()),
            quantityTextSize = this.getTextSize(this.getQuantityText()),
            orderDetailsTextSize = this.getTextSize(this.getDetailsText()),
            padding = 5,
            rightMargin =  Math.round(frame.right - 20),
            top = Math.round(point.y - (orderDetailsTextSize.height / 2) - padding),
            height = orderDetailsTextSize.height + (padding * 2);


        if(BrowserUtils.isMobile()) {

            this._cancelBounds = {
                left:  (2 * padding),
                top: top,
                width: cancelTextSize.width + (2 * padding),
                height: height
            };

            this._quantityBounds = {
                left: this._cancelBounds.left + this._cancelBounds.width,
                top: top,
                width: quantityTextSize.width + (2 * padding),
                height: height
            };

            this._orderDetailsBounds = {
                left: this._quantityBounds.left + this._quantityBounds.width,
                top: top,
                width: orderDetailsTextSize.width + 2 * padding,
                height: height
            };

            this._bounds = {
                left: this._cancelBounds.left,
                top: top,
                width: this._cancelBounds.width + this._quantityBounds.width + this._orderDetailsBounds.width,
                height: height
            };

        } else {

            this._cancelBounds = {
                left: rightMargin - cancelTextSize.width - (2 * padding),
                top: top,
                width: cancelTextSize.width + (2 * padding),
                height: height
            };

            this._quantityBounds = {
                left: this._cancelBounds.left - quantityTextSize.width - (2 * padding),
                top: top,
                width: quantityTextSize.width + (2 * padding),
                height: height
            };

            this._orderDetailsBounds = {
                left: this._quantityBounds.left - orderDetailsTextSize.width - (3 * padding),
                top: top,
                width: orderDetailsTextSize.width + (3 * padding),
                height: height
            };

            this._bounds = {
                left: this._orderDetailsBounds.left,
                top: top,
                width: this._cancelBounds.width + this._quantityBounds.width + this._orderDetailsBounds.width,
                height: height
            };

        }

    }

    private getCancelText() {
        return `X`;
    }

    private getQuantityText() {
        return `${this._order.quantity}`;
    }

    private getDetailsText() {
        if(!this._orderDetailsText) {
            this.setDetailsText();
        }

        return this._orderDetailsText;
    }

    protected setDetailsText() {
        if (this.isStopOrder()) {
            this._orderDetailsText = ChartAccessorService.instance.translate(this._order.type.arabic);
        }
        else if (this._tradingService.needToConcatSideTextWithTypeText()) {
            this._orderDetailsText = this.concatSideTextWithTypeText();
        } else {
            this._orderDetailsText = ChartAccessorService.instance.translate(this._order.side.arabic);
        }
    }

    private isStopOrder(): boolean{
        return this._order.type.type == TradingOrderType.STOP || this._order.type.type == TradingOrderType.STOP_LIMIT || this._order.type.type == TradingOrderType.STOP_MARKET;
    }

    private concatSideTextWithTypeText(): string {
        return ChartAccessorService.instance.translate(this._order.side.arabic) + ' ' + ChartAccessorService.instance.translate(this._order.type.arabic);
    }

    protected setColorsAndFonts() {
        let colors = this.getDrawingColors();

        let orderColor = colors.solidColor;
        let orderColorWithOpacity = colors.opaqueColor;
        this.theme.text.fillColor = this._tradingService.useDarkLightTextColor() ? this.theme.text.fillColor : orderColor;
        this.theme.coloredFill.fillColor = orderColor;
        this.theme.cancelText.fillColor = orderColor;
        this.theme.valueMarkerFill.fillColor = orderColor;
        this.theme.line.strokeColor = orderColor;
        this.theme.dashedLine.strokeColor = orderColor;
        this.theme.line.strokeColor = orderColorWithOpacity;
        this.theme.text.fontFamily = this.isArabic() ? 'DroidArabicKufi-Bold' : 'Calibri';
    }

    private getDrawingColors():TradingColorThemeElement {
        if(this._order.side.type == TradingOrderSideType.SELL || this._order.side.type == TradingOrderSideType.SELL_SHORT || this.isStopOrder()){
            return this.theme.sellColors;
        }

        return this.theme.buyColors;
    }

    protected setChartPoint(order: TradingOrder) {
        this.chartPoint = new ChartPoint({x: 0, value: order.price, record: 0});
    }

    protected isArabic(): boolean {
        return ChartAccessorService.instance.isArabic();
    }

    protected getPrice() {
        return this._order.price;
    }

    protected fireEditOrderEvent(newPrice: number) {
        this.hideTooltipOnEvent();
        let eventValue = {orderId: this._order.id, newPrice: newPrice};
        this.fire(ChartEvent.EDIT_ORDER, eventValue);
    }

    protected fireCancelOrderEvent() {
        this.hideTooltipOnEvent();
        this.fire(ChartEvent.CANCEL_ORDER, this._order.id);
    }

    protected canMove(point: IPoint): boolean {
        if(!this._cancelBounds) {
            return false;
        }

        if(!this._tradingService.canMoveOrder(this._order.id)){
            return false
        }
        return !Geometry.isPointInsideOrNearRect(point, this._cancelBounds);
    }

    protected bounds(): IRect {
        this.setBounds();
        return this._bounds;
    }

    protected hitTest(point: IPoint): boolean {
        if (!this.visible)
            return false;
        return point && Geometry.isPointInsideOrNearRect(point, this.bounds());
    }

    protected _handleClickGesture(gesture: Gesture, event: WindowEvent) {
        super._handleClickGesture(gesture, event);

        if(Geometry.isPointInsideOrNearRect(event.pointerPosition, this._cancelBounds)) {
            this.fireCancelOrderEvent()
        }
    }

    protected _handleDoubleClickGesture(): void {
        super._handleDoubleClickGesture();
        this.fireEditOrderEvent(this.getPrice());
    }

    protected _handleMouseHover(gesture: Gesture, event: WindowEvent) {
        super._handleMouseHover(gesture, event);

        let tooltipText = '';
        if(Geometry.isPointInsideOrNearRect(event.pointerPosition, this._cancelBounds)) {
            tooltipText = 'إلغاء';
        } else if(Geometry.isPointInsideOrNearRect(event.pointerPosition, this._quantityBounds)) {
            tooltipText = 'الكمية';
        }

        if(Geometry.isPointInsideOrNearRect(event.pointerPosition, this._cancelBounds) || Geometry.isPointInsideOrNearRect(event.pointerPosition, this._quantityBounds)) {
            ChartAccessorService.instance.getChartTooltipService().show(ChartTooltipType.Trading, {
                chartPanel: this.chartPanel,
                mousePosition: event.pointerPosition,
                text: ChartAccessorService.instance.translate(tooltipText)
            });
        } else {
            ChartAccessorService.instance.getChartTooltipService().hide(ChartTooltipType.Trading);
        }
    }

    protected handleDragFinished() {
        super.handleDragFinished();

        let value = this.chartPoint.value,
            newPrice = Tc._2digits(value);

        if(this.getPrice() != newPrice)
            this.fireEditOrderEvent(newPrice);
    }

    protected handleDragStarted() {
        super.handleDragStarted();

        this.fire(ChartEvent.DISABLE_REFRESH_TRADING_DRAWINGS);
    }

    protected hideTooltipOnEvent() {
        // MA when firing an event, a modal is opened with a mask that could disrupt tooltip. So, wait for some
        // time (for the mask to load) and then hide the tooltip.
        window.setTimeout( () => {
            ChartAccessorService.instance.getChartTooltipService().hide(ChartTooltipType.Trading);
        }, 100);
    }

}


export interface ChartEditOrderEventValue {
    orderId:string,
    newPrice:number
}
