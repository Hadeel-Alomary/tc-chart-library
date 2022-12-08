import {ChartComponent} from "./Controls/ChartComponent";
import {CrossHairView} from "./CrossHairView";
import {Chart, ChartEvent} from "./Chart";
import {JsUtil} from "./Utils/JsUtil";
import {IPoint} from "./Graphics/ChartPoint";
import {Gesture, GestureState, WindowEvent} from "./Gestures/Gesture";
import {CrossHair, CrossHairType, ICrossHairConfig, ICrossHairState} from "./CrossHair";
import {ChartSideContextMenu} from "../StockChartX.UI/ChartSideContextMenu";
import {ChartAccessorService} from '../../services/chart';
import {MathUtils} from '../../utils/math.utils';

export interface ICrossHairOptions {
    crossHairType: string;
}

const EVENTS_SUFFIX = '.scxCrossHair';

/**
 * Represents chart's cross hair cursor.
 * @param {Object} config The configuration object.
 * @param {Chart} config.chart The parent chart.
 * @constructor CrossHair
 * @requires JQuery
 */
export class CrossHairImplementation extends ChartComponent implements CrossHair{
    private _view: CrossHairView = new CrossHairView(this);
    private _options: ICrossHairOptions;
    private _visible = true;
    private _chartSideContextMenu: ChartSideContextMenu;
    private _currentPositionPrice: number;
    private _currentPositionPanelIndex: number;

    /**
     * Gets/Sets cross hair type.
     * @name crossHairType
     * @type {CrossHairType}
     * @default {@linkcode CrossHairType.NONE}
     * @memberOf CrossHair#
     * @example
     *  crossHair.crossHairType = CrossHairType.MARKERS;
     */
    get crossHairType(): string {
        return this._options.crossHairType;
    }

    set crossHairType(type: string) {
        let oldType = this._options.crossHairType;

        if (oldType !== type) {
            this._options.crossHairType = type;
            this._view.updateVisibility();

            this.chart.fireValueChanged(ChartEvent.CROSS_HAIR_CHANGED, type, oldType);
        }
    }

    /**
     * The flag that indicates whether cross hair is visible.
     * It does not change cross hair type.
     * @name visible
     * @type {boolean}
     * @memberOf CrossHair#
     */
    get visible(): boolean {
        return this._visible;
    }

    set visible(value: boolean) {
        this._visible = value;
    }

    constructor(config: ICrossHairConfig) {
        super(config);
        this._chartSideContextMenu = new ChartSideContextMenu({
            onItemSelected: (menuItem, checked) => {
                let isAlertItem = menuItem.data('id') == ChartSideContextMenu.MenuItem.ALERT || menuItem.parents().data('id') == ChartSideContextMenu.MenuItem.ALERT;
                let isBuyItem = menuItem.data('id') == ChartSideContextMenu.MenuItem.BUY || menuItem.parents().data('id') == ChartSideContextMenu.MenuItem.BUY;
                let isSellItem = menuItem.data('id') == ChartSideContextMenu.MenuItem.SELL || menuItem.parents().data('id') == ChartSideContextMenu.MenuItem.SELL;
                let isStopItem = menuItem.data('id') == ChartSideContextMenu.MenuItem.STOP || menuItem.parents().data('id') == ChartSideContextMenu.MenuItem.STOP;
                if(isAlertItem) {
                    this.onAlertSelected();
                } else if(isBuyItem) {
                    this.onBuySelected();
                } else if(isSellItem) {
                    this.onSellSelected();
                } else if(isStopItem){
                    this.onStopSelected();
                }
            },
            onShow: () => {
                let isSymbolTradable = ChartAccessorService.instance.getTradingService().isSymbolTradableByBroker(this.chart.instrument.symbol);
                let isStopSupported = ChartAccessorService.instance.getTradingService().isStopOrderSupportedByBroker();
                let isViewInMainPanel = this._view.isInMainPanel();
                let market = ChartAccessorService.instance.getMarketBySymbol(this.chart.instrument.symbol);
                let priceStep = ChartAccessorService.instance.getMarketsTickSizeService().getTickSize(market.abbreviation, this._currentPositionPrice);
                let tradingPrice = MathUtils.roundToNearestStep(this._currentPositionPrice, priceStep);
                if(isSymbolTradable && isViewInMainPanel) {
                    this._chartSideContextMenu.showTradingOptions( this._currentPositionPrice , tradingPrice);
                } else {
                    this._chartSideContextMenu.hideTradingOptions();
                }

                if(isStopSupported && isSymbolTradable && isViewInMainPanel) {
                    this._chartSideContextMenu.showStopOption();
                } else {
                    this._chartSideContextMenu.hideStopOption();
                }
            }
        });

        this.loadState(<ICrossHairState> config);
    }

    private onAlertSelected() {
        this.chart.fireValueChanged(ChartEvent.ADD_ALERT, {price: this._currentPositionPrice, panelIndex:  this._currentPositionPanelIndex});
    }

    private onBuySelected() {
        if(!ChartAccessorService.instance.getTradingService().isSymbolTradableByBroker(this.chart.instrument.symbol)) {
            return;
        }
        this.chart.fireValueChanged(ChartEvent.BUY_SYMBOL, this._currentPositionPrice);
    }

    private onSellSelected() {
        if(!ChartAccessorService.instance.getTradingService().isSymbolTradableByBroker(this.chart.instrument.symbol)) {
            return;
        }
        this.chart.fireValueChanged(ChartEvent.SELL_SYMBOL, this._currentPositionPrice);
    }

    private onStopSelected() {
        if(!ChartAccessorService.instance.getTradingService().isSymbolTradableByBroker(this.chart.instrument.symbol)) {
            return;
        }
        this.chart.fireValueChanged(ChartEvent.STOP_SYMBOL, this._currentPositionPrice);
    }

    showTradingContextMenu(e: JQueryEventObject, price: number, panelIndex: number): void {
        this._currentPositionPrice = MathUtils.roundAccordingMarket(price, this.chart.instrument.symbol);
        this._currentPositionPanelIndex = panelIndex;
        this._chartSideContextMenu.show(e);
    }

    /**
     * @inheritdoc
     */
    protected _subscribeEvents() {
        super._subscribeEvents();

        this.chart
            .on(ChartEvent.THEME_CHANGED + EVENTS_SUFFIX, () => {
                this.applyTheme();
            })
            .on(ChartEvent.LOCALE_CHANGED + EVENTS_SUFFIX, () => {
                this.update();
            })
            .on(ChartEvent.TIME_INTERVAL_CHANGED + EVENTS_SUFFIX, () => {
                this.update();
            });
    }

    /**
     * @inheritdoc
     */
    protected _unsubscribeEvents() {
        this.chart.off(EVENTS_SUFFIX);

        super._unsubscribeEvents();
    }

    /**
     * Layouts elements.
     * @method layout
     * @memberOf CrossHair#
     */
    layout() {
        this._view.layout();
    }

    /**
     * Applies theme to the HTML controls.
     * @method applyTheme
     * @memberOf CrossHair#
     */
    applyTheme() {
        let theme = this.chart.theme.crossHair;

        this._view.applyTheme(theme);
    }

    /**
     * Updates markers text and size.
     * @method update
     * @memberOf CrossHair#
     */
    update() {
        this._view.updateMarkers();
        this._view.updatePosition(true);
    }

    /**
     * Shows cross hair (if cross hair type is not set to NONE).
     * @method show
     * @memberOf CrossHair#
     */
    show() {
        this.visible = true;
        this._view.updatePosition(true);
        this._view.updateVisibility(true);
    }

    /**
     * Hides cross hair.
     * @method hide
     * @memberOf CrossHair#
     */
    hide() {
        this.visible = false;
        this._view.updateVisibility(false);
    }

    /**
     * @inheritdoc
     */
    saveState(): ICrossHairState {
        return JsUtil.clone(this._options);
    }

    /**
     * @inheritdoc
     */
    loadState(state: ICrossHairState) {
        this._options = <ICrossHairOptions> {};
        this.crossHairType = (state && state.crossHairType) || CrossHairType.NONE;
    }

    /**
     * Moves cross hair into a given position.
     * @method setPosition
     * @param {Point} point The destination point.
     * @param {Boolean} [animated = true] The flag that indicates whether animation frame should be requested to set the position.
     * @memberOf CrossHair#
     * @example
     *  crossHair.setPosition({x: 100, y: 200});
     */
    setPosition(point: IPoint, animated?: boolean) {
        this._view.setPosition(point, animated);
    }

    /**
     * Handles mouse hover gesture event.
     * @method handleMouseHoverGesture
     * @param {Gesture} gesture The mouse hover gesture.
     * @param {Object} event The event object.
     * @memberOf CrossHair#
     * @private
     */
    handleMouseHoverGesture(gesture: Gesture, event: WindowEvent) {
        switch (gesture.state) {
            case GestureState.STARTED:
                this._view.updateVisibility(true);
                break;
            case GestureState.FINISHED:
                this._view.updateVisibility(false);
                break;
            case GestureState.CONTINUED:
                if (this.crossHairType !== CrossHairType.NONE)
                    this.setPosition(event.pointerPosition, true);
                break;
        }
    }

    draw() {

    }

    /**
     * @inheritdoc
     */
    destroy() {
        this._view.destroy();

        super.destroy();
    }

}
