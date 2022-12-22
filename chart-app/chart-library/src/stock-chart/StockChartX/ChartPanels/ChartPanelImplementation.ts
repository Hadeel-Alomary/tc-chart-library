
import {ChartPanel, PanelEvent, PanelMoveDirection, PanelMoveKind} from "./ChartPanel";
import {FrameControl} from "../Controls/FrameControl";
import {IPoint} from "../Graphics/ChartPoint";
import {IEventObject, IValueChangedEvent} from '../Utils/EventableObject';
import {GestureArray} from "../Gestures/GestureArray";
import {PanGesture} from "../Gestures/PanGesture";
import {MouseWheelGesture} from "../Gestures/MouseWheelGesture";
import {ClickGesture} from "../Gestures/ClickGesture";
import {DoubleClickGesture} from "../Gestures/DoubleClickGesture";
import {GestureState, WindowEvent} from '../Gestures/Gesture';
import {ChartPanelsContainer} from "./ChartPanelsContainer";
import {Chart, ChartEvent, ChartState} from "../Chart";
import {ChartPanelValueScale, IChartPanelValueScaleState} from '../Scales/ChartPanelValueScale';
import {INumberFormat} from "../Data/NumberFormat";
import {JsUtil} from "../Utils/JsUtil";
import {Plot, PlotDrawingOrderType, PlotType} from "../Plots/Plot";
import {Drawing} from "../Drawings/Drawing";
import {Projection} from "../Scales/Projection";
import {AddChartAlertEventValue, Indicator} from '../Indicators/Indicator';
import {Rect} from "../Graphics/Rect";
import {Animation} from "../Graphics/Animation";
import {ValueScale} from "../Scales/ValueScale";
import {IMinMaxValues} from "../Data/DataSeries";
import {ChartPanelValueScaleImplementation} from "../Scales/ChartPanelValueScaleImplementation";
import {BrowserUtils, ColorUtils, Tc} from '../../../utils';
import {AxisScaleType} from '../Scales/axis-scale-type';
import {TradingDrawing} from '../TradingDrawings/TradingDrawing';
import {OrderDrawing} from '../TradingDrawings/OrderDrawing';
import {PositionDrawing} from '../TradingDrawings/PositionDrawing';
import {TradingOrder, TradingPosition} from '../../../services/trading/broker/models';
import {TakeProfitDrawing} from '../TradingDrawings/TakeProfitDrawing';
import {StopLossDrawing} from '../TradingDrawings/StopLossDrawing';
import {ValueMarkerOwner, ValueMarkerOwnerOperations} from '../ValueMarkerOwner';
import {IBarDataSeries} from '../../StockChartX/Data/DataManager';
import {PriceStyleSettingsDialog} from '../../StockChartX.UI/PriceStyleSettingsDialog';
import {ChartAlertDrawing} from '../AlertDrawings/ChartAlertDrawing';
import {ChartAlertCrossDrawing} from '../AlertDrawings/ChartAlertCrossDrawing';
import {ChartAlertChannelDrawing} from '../AlertDrawings/ChartAlertChannelDrawing';
import {ThemeType} from '../ThemeType';
import {HtmlUtil} from '../Utils/HtmlUtil';
import {ChartPanelMenu, IChartPanelMenuConfig} from '../../StockChartX.UI/ChartPanelMenu';
import {TAIndicator} from '../Indicators/TAIndicator';
import {ISwipeObject} from '../Graphics/Swipe';
import {ChartAlert} from "../../../services/alert";
import {ChartAccessorService, ViewLoaderType} from "../../../services/chart";

const Class = {
    CONTAINER: 'scxChartPanel',
    SCROLL: 'scxPanelScroll',
    WATERMARK: 'scxWatermark',
    WATERMARK_CONTENT: 'scxWatermarkContent',
    WATERMARK_SYMBOL: 'scxWatermarkSymbol',
    WATERMARK_INFO: 'scxWatermarkInfo',
    WATERMARK_LOGO: 'scxWatermarkLogo',
    TITLE: 'scxPanelTitle',
    TITLE_CAPTION: 'scxPanelTitleCaption',
    TITLE_VALUE: 'scxPanelTitleValue',
    OPTIONS: 'scxPanelOptions',
    OPTIONS_ICON: 'scxPanelTitleIcon',
    OPTIONS_CLOSE: 'scxPanelClose',
    OPTIONS_MOVE_UP: 'scxPanelMoveUp',
    OPTIONS_MOVE_DOWN: 'scxPanelMoveDown',
    OPTIONS_SETTINGS: 'scxPanelSettings',
    OPTIONS_MAXIMIZE: 'scxPanelMaximize',
    OPTIONS_MENU: 'scxPanelMenu'
};

/**
 * Describes chart panel.
 * @param {Object} config The configuration object.
 * @param {ChartPanelsContainer} config.chartPanelsContainer The parent chart panels container.
 * @param {Number} [config.minHeightRatio] The min allowed height ratio.
 * @param {Number} [config.maxHeightRatio] The max allowed height ratio.
 * @param {Number} [config.heightRatio] The height ratio.
 * @param {PanelMoveDirection} [config.moveDirection] The allowed move direction.
 * @param {PanelMoveKind} [config.moveKind] The move kind.
 * @constructor ChartPanel
 * @augments Control
 */
export class ChartPanelImplementation extends FrameControl implements ChartPanel{
    private _panelsContainer: ChartPanelsContainer;

    /**
     * Gets parent chart panels container.
     * @name chartPanelsContainer
     * @type ChartPanelsContainer
     * @readonly
     * @memberOf ChartPanel#
     */
    get chartPanelsContainer(): ChartPanelsContainer {
        return this._panelsContainer;
    }

    /**
     * Gets parent chart.
     * @name chart
     * @type {Chart}
     * @readonly
     * @memberOf ChartPanel#
     */
    get chart(): Chart {
        // MA I needed to make _chart puble to get this to compile!! TODO clean this up
        return this._panelsContainer.chart;
    }

    private _valueScales: ChartPanelValueScale[] = [];
    /**
     * Gets array of value scales.
     * @name valueScales
     * @type {ChartPanelValueScale[]}
     * @readonly
     * @memberOf ChartPanel#
     */
    get valueScales(): ChartPanelValueScale[] {
        return this._valueScales;
    }

    /**
     * Gets value scale.
     * @name valueScale
     * @type {ChartPanelValueScale}
     * @readonly
     * @memberOf ChartPanel#
     */
    get valueScale(): ChartPanelValueScale {
        return this._valueScales[0];
    }

    /**
     * Gets/Sets value formatter.
     * @name formatter
     * @type {IntlNumberFormat | CustomNumberFormat}
     * @memberOf ChartPanel#
     */
    get formatter(): INumberFormat {
        return this.valueScale.formatter;
    }

    set formatter(value: INumberFormat) {
        this.valueScale.formatter = value;
    }

    private _canvas: JQuery;
    /**
     * Gets canvas element.
     * @name canvas
     * @type {jQuery}
     * @readonly
     * @memberOf ChartPanel#
     */
    get canvas(): JQuery {
        return this._canvas;
    }

    private _context: CanvasRenderingContext2D;
    /**
     * Gets canvas rendering context.
     * @name context
     * @type {CanvasRenderingContext2D}
     * @readonly
     * @memberOf ChartPanel#
     */
    get context(): CanvasRenderingContext2D {
        return this._context;
    }

    /**
     * The panel's options.
     * @type {Object}
     * @private
     */
    private _options: IChartPanelOptions;

    /**
     * Gets/Sets current height ratio. The value must be in range [minHeightRatio..maxHeightRatio].
     * @name heightRatio
     * @type {Number}
     * @memberOf ChartPanel#
     */
    get heightRatio(): number {
        return this._options.heightRatio;
    }

    set heightRatio(ratio: number) {
        if (!JsUtil.isFiniteNumber(ratio) || ratio < this._options.minHeightRatio || ratio > this._options.maxHeightRatio)
            throw new Error("Height ratio must be a number in range [minHeightRatio..maxHeightRatio]");

        this._options.heightRatio = ratio;
    }

    /**
     * Gets/Sets minimum allowed height ratio. The value must be in range [0..maxHeightRatio].
     * @name minHeightRatio
     * @type {number}
     * @memberOf ChartPanel#
     */
    get minHeightRatio(): number {
        return this._options.minHeightRatio;
    }

    set minHeightRatio(ratio: number) {
        if (!JsUtil.isFiniteNumber(ratio) || ratio < 0 || ratio > this._options.maxHeightRatio)
            throw new Error("Min height ratio must be a number in range [0..maxHeightRatio].");

        this._options.minHeightRatio = ratio;
        if (this._options.heightRatio < ratio)
            this._options.heightRatio = ratio;
    }

    /**
     * Gets/Sets maximum allowed height ratio. The value must be in range [minHeightRatio..1].
     * @name maxHeightRatio
     * @type {number}
     * @memberOf ChartPanel#
     */
    get maxHeightRatio(): number {
        return this._options.maxHeightRatio;
    }

    set maxHeightRatio(ratio: number) {
        if (!JsUtil.isFiniteNumber(ratio) || ratio < this._options.minHeightRatio || ratio > 1)
            throw new Error("Max height ratio must be a number in range [minHeightRatio..1]");

        this._options.maxHeightRatio = ratio;
        if (this._options.heightRatio > ratio)
            this._options.heightRatio = ratio;
    }

    /**
     * Gets/Sets allowed move direction.
     * @name moveDirection
     * @type {PanelMoveDirection}
     * @memberOf ChartPanel#
     */
    get moveDirection(): string {
        return this._options.moveDirection;
    }

    set moveDirection(direction: string) {
        this._options.moveDirection = direction;
    }

    /**
     * Gets/Sets panel's move kind.
     * @name moveKind
     * @type {PanelMoveKind}
     * @memberOf ChartPanel#
     */
    get moveKind(): string {
        return this._options.moveKind;
    }

    set moveKind(value: string) {
        this._options.moveKind = value;
    }

    /**
     * Gets/Sets flag that indicates whether X grid is visible.
     * @name xGridVisible
     * @type {boolean}
     * @memberOf ChartPanel#
     */
    get xGridVisible(): boolean {
        return this._options.showXGrid;
    }

    set xGridVisible(visible: boolean) {
        let newValue = !!visible,
            oldValue = this._options.showXGrid;

        if (oldValue !== newValue) {
            this._options.showXGrid = newValue;
            this._fire(PanelEvent.X_GRID_VISIBLE_CHANGED, newValue, oldValue);
        }
    }

    /**
     * Gets/Sets flag that indicates whether Y grid is visible.
     * @name yGridVisible
     * @type {boolean}
     * @memberOf ChartPanel#
     */
    get yGridVisible(): boolean {
        return this._options.showYGrid;
    }

    set yGridVisible(visible: boolean) {
        let newValue = !!visible,
            oldValue = this._options.showYGrid;

        if (oldValue !== newValue) {
            this._options.showYGrid = newValue;
            this._fire(PanelEvent.Y_GRID_VISIBLE_CHANGED, newValue, oldValue);
        }
    }

    /**
     * Gets array of plots on the panel.
     * @name plots
     * @type {Plot[]}
     * @readonly
     * @memberOf ChartPanel#
     */
    private _plots: Plot[] = [];
    get plots(): Plot[] {
        return this._plots;
    }

    /**
     * Gets array of drawings on the panel.
     * @name drawings
     * @type {Drawing[]}
     * @readonly
     * @memberOf ChartPanel#
     */
    private _drawings: Drawing[] = [];
    get drawings(): Drawing[] {
        return this._drawings;
    }

    /**
     * Gets array of trading drawings on the panel.
     * @name tradingDrawings
     * @type {Drawing[]}
     * @readonly
     * @memberOf ChartPanel#
     */
    private _tradingDrawings: TradingDrawing[] = [];
    private _futureOrderDrawings: OrderDrawing[] = [];
    get tradingDrawings(): TradingDrawing[] {
        return this._tradingDrawings;
    }

    private _chartAlertDrawings: ChartAlertDrawing[] = []
    get chartAlertDrawing(): ChartAlertDrawing[] {
        return this._chartAlertDrawings;
    }


    /**
     * The actual theme.
     * @type {Object}
     * @readonly
     * @memberOf ChartPanel#
     */
    get actualTheme() {
        return this.chart.theme.chartPanel;
    }

    /**
     * Gets projection object to convert coordinates.
     * @name projection
     * @type {Projection}
     * @readonly
     * @memberOf ChartPanel#
     */
    get projection(): Projection {
        return this.valueScale.projection;
    }

    /**
     * Gets title div element.
     * @name titleDiv
     * @type {jQuery}
     * @readonly
     * @memberOf ChartPanel#
     */
    get titleDiv() {
        return this._controls.title;
    }

    /**
     * Gets array of indicators on the chart panel.
     * @name indicators
     * @type {Indicator[]}
     * @readonly
     * @memberOf ChartPanel#
     */
    get indicators(): Indicator[] {
        let chart = this.chart;
        let chartIndicators = chart.indicators;
        let panelIndicators: Indicator[] = [];
        for (let indicator of chartIndicators) {
            if (indicator.chartPanel === this)
                panelIndicators.push(indicator);
        }

        return panelIndicators;
    }

    /**
     * Gets content frame rectangle.
     * @name contentFrame
     * @type {Rect}
     * @readonly
     * @memberOf ChartPanel#
     */
    private _contentFrame = new Rect();
    get contentFrame(): Rect {
        return this._contentFrame;
    }

    private _controls: IChartPanelControls = {
        title: null,
        options: null,
        watermark: null,
        moveUp: null,
        moveDown: null,
        close: null,
        settings: null,
        maximize: null,
        menu: null,
    };
    private _barInfoControls: IChartPanelBarInfoControls = null;
    private _updateAnimation = new Animation({
        context: this,
        recurring: false,
        callback: this._onUpdateAnimationCallback,
    });

    private _updateHoverRecordAnimation = new Animation({
        context: this,
        recurring: false,
        callback: this._onUpdateHoverRecordAnimationCallback,
    });

    public get maximized(): boolean {
        return this._options.maximized;
    }

    public set maximized(value: boolean) {
        this._options.maximized = value;
    }

    constructor(config: IChartPanelState) {
        super();

        if (typeof config !== 'object')
            throw new Error('Config must be an object.');

        this._panelsContainer = config.chartPanelsContainer;

        this.loadState(config);
        this._initChartPanelMenu();
    }

    private _fire(event: string, newValue?: unknown, oldValue?: unknown) {
        let chart = this.chart;
        if (chart)
            chart.fireTargetValueChanged(this, event, newValue, oldValue);
    }

    /**
     * Returns 0-based panel index (from top).
     * @returns {number}
     * @memberOf ChartPanel#
     * @private
     */
    getIndex(): number {
        return this._panelsContainer.panels.indexOf(this);
    }

    getProjection(chartValueScale: ValueScale): Projection {
        let index = chartValueScale ? chartValueScale.index : 0;

        return this.valueScales[index].projection;
    }

    getValueScale(chartValueScale: ValueScale): ChartPanelValueScale {
        let index = chartValueScale ? chartValueScale.index : 0;

        return this.valueScales[index];
    }

    /**
     * Sets panel height ratio. Unlike heightRatio property this method updates height ratio of the main panel.
     * So if you increase height ratio by 0.1, height ratio of the main panel will be decreased by 0.1.
     * @method setHeightRatio
     * @param {number} ratio The new height ratio.
     * @memberOf ChartPanel#
     */
    setHeightRatio(ratio: number) {
        this._panelsContainer.setPanelHeightRatio(this, ratio);
    }

    /**
     * Marks that value scale needs to be auto-scaled on next layout.
     * @method setNeedsAutoScale
     * @memberOf ChartPanel#
     */
    setNeedsAutoScale() {
        for (let scale of this._valueScales)
            scale.setNeedsAutoScale();
    }

    setAxisScale(axisScaleType:AxisScaleType) {
        this._valueScales[0].axisScale = axisScaleType;
    }

    getAxisScale():AxisScaleType {
        return this._valueScales[0].axisScale;
    }

    containsPlot(plot: Plot): boolean {
        for (let item of this._plots) {
            if (item === plot)
                return true;
        }

        return false;
    }

    /**
     * Adds new plot.
     * @method addPlot
     * @param {Plot | Plot[]} plot The plot or an array of plots to add.
     * @see [removePlot]{@linkcode ChartPanel#removePlot} to remove plot.
     * @memberOf ChartPanel#
     */
    addPlot(plot: Plot | Plot[]) {
        if (Array.isArray(plot)) {
            // An array of plots passed. Add plots one by one.
            for (let plotItem of plot)
                this.addPlot(plotItem);
        } else {
            // Now it's a single plot.
            if (!(plot instanceof Plot))
                throw new TypeError('Plot must be an instance of Plot.');

            if (this.containsPlot(plot))
                return;

            plot.chartPanel = this;
            this._plots.push(plot);

            this._fire(PanelEvent.PLOT_ADDED, plot);
        }
    }

    /**
     * Removes given plot or an array of plots.
     * @method removePlot
     * @param {Plot | Plot[]} plot The plot or an array of plots to remove.
     * @see [addPlot]{@linkcode ChartPanel#addPlot} to add plot.
     * @memberOf ChartPanel#
     */
    removePlot(plot: Plot | Plot[]) {
        if (Array.isArray(plot)) {
            for (let plotItem of plot)
                this.removePlot(plotItem);
        } else {
            let plots = this._plots;

            for (let i = 0; i < plots.length; i++) {
                if (plots[i] === plot) {
                    plots.splice(i, 1);
                    this._fire(PanelEvent.PLOT_REMOVED, plot);
                }
            }

            if (this.chart.selectedObject == plot) {
                this.chart.selectObject(null);
            }
        }
    }

    containsDrawing(drawing: Drawing): boolean {
        for (let item of this._drawings) {
            if (item === drawing) {
                return true;
            }
        }

        return false;
    }

    /**
     * Adds drawings.
     * @method addDrawings
     * @param {Drawing | Drawing[]} drawings The drawing or an array of drawings to add.
     * @memberOf ChartPanel#
     */
    addDrawings(drawings: Drawing | Drawing[]) {
        if (Array.isArray(drawings)) {
            // An array of drawings passed. Add drawings one by one.
            for (let item of drawings) {
                this.addDrawings(item);
            }
        } else {
            // Now it's a single drawing.
            let drawing = drawings;
            if (!(drawing instanceof Drawing))
                throw new TypeError("Drawing is not an instance of Drawing.");

            if (this.containsDrawing(drawing)) {
                throw new Error("Drawing already added.");
            }

            drawing.chartPanel = this;
            this._drawings.push(drawing);
        }
    }

    getTradingOrders():TradingOrder[] {
        return (this._tradingDrawings.filter(d => d instanceof OrderDrawing) as OrderDrawing[]).map(d => d.getOrder());
    }

    updateTradingOrder(order: TradingOrder) {
        let orderDrawing = this._tradingDrawings.find(d => (d instanceof OrderDrawing) && (d as OrderDrawing).getOrder().id == order.id ) as OrderDrawing;
        if(orderDrawing) {
            this.removeTradingOrder(order);
            this.addTradingOrder(order);
        }
    }

    addTradingOrder(order: TradingOrder) {
        let orderDrawing = new OrderDrawing(this.chart, order);
        orderDrawing.chartPanel = this;
        this._tradingDrawings.push(orderDrawing);
        this.addFutureOrders(order);
    }

    addTradingPosition(position: TradingPosition) {
        let existingPosition = this._tradingDrawings.find( d => d instanceof PositionDrawing);
        Tc.assert(existingPosition == null, "already position drawing exists, can't add another")
        let positionDrawing = new PositionDrawing(this.chart, position);
        positionDrawing.chartPanel = this;
        this._tradingDrawings.push(positionDrawing);
    }

    removeTradingPosition():void {
        let positionDrawing = this._tradingDrawings.find( d => d instanceof PositionDrawing);
        if(positionDrawing) {
            this._tradingDrawings.splice(this._tradingDrawings.indexOf(positionDrawing), 1);
        }
    }

    removeTradingOrder(order:TradingOrder):void {
        let orderDrawing = this._tradingDrawings.find( d => (d instanceof OrderDrawing) && (d as OrderDrawing).getOrder().id == order.id );
        if(orderDrawing) {
            this._tradingDrawings.splice(this._tradingDrawings.indexOf(orderDrawing), 1);
            this.removeFutureOrders(order);
        }
    }

    private removeFutureOrders(order: TradingOrder) {
        let specialOrderDrawings = this._futureOrderDrawings.filter(d => (d as OrderDrawing).getOrder().id == order.id ) as OrderDrawing[];
        specialOrderDrawings.forEach(specialOrderDrawing => this._futureOrderDrawings.splice(this._futureOrderDrawings.indexOf(specialOrderDrawing), 1));
    }

    private addFutureOrders(order: TradingOrder) {
        if(order.takeProfit) {
            let takeProfitDrawing = new TakeProfitDrawing(this.chart, order);
            takeProfitDrawing.chartPanel = this;
            this._futureOrderDrawings.push(takeProfitDrawing);
        }
        if(order.stopLoss) {
            let stopLossDrawing = new StopLossDrawing(this.chart, order);
            stopLossDrawing.chartPanel = this;
            this._futureOrderDrawings.push(stopLossDrawing);
        }
    }

    getChartAlerts():ChartAlert[] {
        return this._chartAlertDrawings.map(d => d.getAlert());
    }

    updateChartAlert(alert: ChartAlert):void {
        let alertDrawing = this._chartAlertDrawings.find(d => d.getAlert().id == alert.id );
        if(alertDrawing) {
            alertDrawing.setAlert(alert);
        }
    }

    addChartAlert(alert: ChartAlert):void {
        let alertDrawing: ChartAlertDrawing = alert.hasChannelFunction() ?
            new ChartAlertChannelDrawing(this.chart, alert) :
            new ChartAlertCrossDrawing(this.chart, alert);
        alertDrawing.chartPanel = this;
        this._chartAlertDrawings.push(alertDrawing);
    }

    removeChartAlert(alert:ChartAlert):void {
        let alertDrawing = this._chartAlertDrawings.find( d => d.getAlert().id == alert.id );
        if(alertDrawing) {
            this._chartAlertDrawings.splice(this._chartAlertDrawings.indexOf(alertDrawing), 1);
        }
    }

    deleteDrawings(drawings?: Drawing | Drawing[]) {
        let drawingsToDelete: Drawing[];
        if(!drawings) {
            drawingsToDelete = this._drawings;
        } else if(drawings instanceof Array) {
            drawingsToDelete = drawings as Drawing[];
        } else {
            drawingsToDelete = [drawings as Drawing]
        }

        for(let drawing of drawingsToDelete) {
            drawing.preDeleteCleanUp();
        }
        this.removeDrawingsFromPanel(drawings);
    }

    clearPanelOnLoadState() {
        this.removeDrawingsFromPanel();
    }

    private removeDrawingsFromPanel(drawings?: Drawing | Drawing[]) {
        let shouldRemove = (item: Drawing) => {
            if (!drawings || drawings === item)
                return true;
            for (let drawing of <Drawing[]> drawings) {
                if (drawing === item)
                    return true;
            }

            return false;
        };

        let chart = this.chart,
            panelDrawings = this._drawings,
            userDrawingToCancel: Drawing = null;
        for (let i = 0; i < panelDrawings.length; i++) {
            let item = panelDrawings[i];

            if (shouldRemove(item)) {

                item.onRemove();

                if (drawings)
                    panelDrawings.splice(i, 1);

                if (chart.selectedObject === item) {
                    chart.selectedObject.hideDrawingTooltip();
                    if (chart.state === ChartState.USER_DRAWING)
                        userDrawingToCancel = chart.selectedObject;
                    else
                        chart.selectObject(null);

                    if (item.chartPanel.rootDiv.hasClass('drawing-mouse-hover'))
                        item.chartPanel.rootDiv.removeClass('drawing-mouse-hover');
                }
                break;
            }
        }
        if (userDrawingToCancel)
            chart.cancelUserDrawing();
        if (!drawings)
            panelDrawings.length = 0;

        this.setNeedsUpdate();
    }


    handleEvent(event: WindowEvent) {

        // MA readOnly, don't handle events
        if (this.chart.readOnly) {
            return true;
        }

        let oldX = event.pointerPosition.x,
            oldY = event.pointerPosition.y;

        event.pointerPosition.x -= this.frame.left;
        event.pointerPosition.y -= this.frame.top;

        for (let scale of this._valueScales) {
            if (scale.handleEvent(event)) {
                return true;
            }
        }

        try {
            let chart = this.chart;

            if (chart.state == ChartState.ZOOMING) {
                if (!this.hitTest(event.pointerPosition))
                    return false;

                if (this.chart.zoomTool.handleEvent(event))
                    return true;
            }

            if (chart.state == ChartState.MEASURING) {
                if (this.chart.measurementTool.handleEvent(event)) {
                    return true;
                }
            }

            if (chart.state === ChartState.USER_DRAWING) {
                event.pointerPosition.x = oldX;
                event.pointerPosition.y = oldY;
                if (!this.hitTest(event.pointerPosition)) {
                    return false;
                }

                let drawing = chart.selectedObject,
                    drawingPanel = drawing.chartPanel;

                if (drawingPanel && drawingPanel !== this)
                    return;

                event.pointerPosition.x -= this.frame.left;
                event.pointerPosition.y -= this.frame.top;
                event.chartPanel = this;
                if (drawing.handleEvent(event)) {
                    return true;
                } else {
                    // NK When we are on user drawing state and the drawing does not handle the event,
                    // we should give the chart panel container and his children the ability to handle the event (for zooming while we are on user drawing state),
                    // but not the already drawn drawings, plots and indicators to avoid conflict the events
                    return super.handleEvent(event);
                }
            }

            for (let customChartPanelObject of this.chart.getChartAnnotations()) {
                if (customChartPanelObject.handleEvent(event)) {
                    return true;
                }
            }

            for (let drawing of this._drawings) {
                if (drawing.handleEvent(event)) {
                    return true;
                }
            }

            for (let drawing of this._tradingDrawings) {
                if (drawing.handleEvent(event)) {
                    return true;
                }
            }

            for (let drawing of this._futureOrderDrawings) {
                if (drawing.handleEvent(event)) {
                    return true;
                }
            }

            if(BrowserUtils.isDesktop()) {

                for (let drawing of this._chartAlertDrawings) {
                    if (drawing.handleEvent(event)) {
                        return true;
                    }
                }

                for (let indicator of this.indicators) {
                    if (indicator.handleEvent(event))
                        return true;
                }

                for (let i = 0; i < this.plots.length; i++) {
                    let plot = this.plots[i];
                    if (plot.handleEvent(event))
                        return true;
                }
            }

        }
        finally {
            event.pointerPosition.x = oldX;
            event.pointerPosition.y = oldY;
        }

        return super.handleEvent(event);
    }

    /**
     * Returns minimum and maximum plot's values.
     * @method getMinMaxValues
     * @param {number} [startIndex] The starting index of the range to search.
     * @param {number} [count] The length of the range to search.
     * @param {ValueScale} [valueScale] The value scale.
     * @returns {{min: number, max: number}} An object that contains min and max values.
     * @see [getAutoScaledMinMaxValues]{@linkcode ChartPanel#getAutoScaledMinMaxValues} to min/max values in visible range.
     * @memberOf ChartPanel#
     */
    getMinMaxValues(startIndex: number, count: number, valueScale: ValueScale): IMinMaxValues<number> {
        let min = Infinity,
            max = -Infinity;

        for (let plot of this._plots) {
            if (valueScale && plot.valueScale !== valueScale)
                continue;

            if(plot.shouldAffectAutoScalingMaxAndMinLimits()) {
                let res = plot.minMaxValues(startIndex, count);
                if (res.min < min)
                    min = res.min;
                if (res.max > max)
                    max = res.max;
            }


        }

        if (!isFinite(min))
            min = -1;
        if (!isFinite(max))
            max = 1;
        if (min === max) {
            min--;
            max++;
        }

        return {
            min: min,
            max: max
        };
    }

    /**
     * Returns min/max values for auto-scaling.
     * @method getAutoScaledMinMaxValues
     * @param {ChartValueScale} [valueScale] The value scale.
     * @returns {{min: number, max: number}}
     * @memberOf ChartPanel#
     */
    getAutoScaledMinMaxValues(valueScale: ValueScale): IMinMaxValues<number> {
        let dateScale = this.chart.dateScale,
            startIndex = dateScale.firstVisibleIndex,
            count = dateScale.lastVisibleIndex - startIndex + 1;

        return this.getMinMaxValues(startIndex, count, valueScale);
    }

    /**
     * Returns the string representation of a given value.
     * @method formatValue
     * @param {number} value The value.
     * @returns {string}
     * @memberOf ChartPanel#
     */
    formatValue(value: number): string {
        // MA ValueScale abbreviate numbers (as in 10.83M) to save space. However, for numbers to be shown out of the valuescale,
        // then they should be detailed (with all digits shown). This is why we have formatAllDigitsValue method.
        return this.valueScale.formatAllDigitsValue(value);
    }

    /**
     * @inheritdoc
     */
    hitTest(point: IPoint): boolean {
        return this._contentFrame.containsPoint(point);
    }

    /**
     * Saves state.
     * @method saveState
     * @returns {object}
     * @see [loadState]{@linkcode ChartPanel#loadState} to load state.
     * @memberOf ChartPanel#
     */
    saveState(): IChartPanelState {
        let state: IChartPanelState = {
            options: JsUtil.clone(this._options),
            valueScales: []
        };

        for (let scale of this._valueScales) {
            state.valueScales.push(scale.saveState());
        }

        return state;
    }

    /**
     * Loads state.
     * @method loadState
     * @param {object} state The state saved by saveState function.
     * @see [saveState]{@linkcode ChartPanel#saveState} to save state.
     * @memberOf ChartPanel#
     */
    loadState(state: IChartPanelState) {
        state = state || <IChartPanelState>{};
        let optionsState = state.options || <IChartPanelOptions>{};

        this._options = <IChartPanelOptions>{};
        this.minHeightRatio = optionsState.minHeightRatio !== undefined ? optionsState.minHeightRatio : 0.05;
        this.maxHeightRatio = optionsState.maxHeightRatio || 1;
        this.heightRatio = optionsState.heightRatio || 1;

        this.xGridVisible = optionsState.showXGrid !== undefined ? !!optionsState.showXGrid : true;
        this.yGridVisible = optionsState.showYGrid !== undefined ? !!optionsState.showYGrid : true;
        this.moveDirection = optionsState.moveDirection || PanelMoveDirection.HORIZONTAL;
        this.moveKind = optionsState.moveKind || PanelMoveKind.AUTOSCALED;
        this.maximized = optionsState.maximized || false;

        let scales: ChartPanelValueScale[] = this._valueScales = [],
            scalesState = state.valueScales || [state.valueScale];
        for (let i = 0, count = this.chart.valueScales.length; i < count; i++) {
            let scale = new ChartPanelValueScaleImplementation({
                chartPanel: this
            });
            scales.push(scale);
            scale.loadState(scalesState[i]);
        }
    }

    getPreferredValueScaleWidth(chartScale: ValueScale): number {
        let maxWidth = 0;

        for (let scale of this._valueScales) {
            if (scale.chartValueScale === chartScale)
                maxWidth = Math.max(maxWidth, scale.preferredWidth());
        }

        return maxWidth;
    }

    /**
     * @inheritdoc
     */
    layout(frame: Rect) {
        this._layoutHtmlElements(frame);

        for (let scale of this._valueScales)
            scale.layout(frame);
    }

    /**
     * @inheritdoc
     */
    draw() {
        let context = this._context,
            width = this._canvas.width(),
            height = this._canvas.height();

        let isMainPanel: boolean = this === this.chart.mainPanel;

        context.save();

        context.clearRect(0, 0, width, height);
        context.translate(0.5, 0.5);

        this.formatter.setDecimalDigits(this.chart.numberOfDigitFormat);

        this.drawGridLines();

        for (let scale of this._valueScales)
            scale.draw();

        if (this.chart.cutOffDataIsLoaded()) {
            this.drawSeparatorForCutOffData();
        }

        //NK drawing valueMarkers will draw horizontal lines (if existed) value markers,
        //indicator value markers will be drawn on plot.drawValueMarkers()
        let chartIndicators = this.chart.indicators;
        for (let indicator of chartIndicators) {
            if (indicator.chartPanel === this)
                indicator.drawHorizontalLineValueMarkers();
        }

        this.drawValueMarkers();

        let clipFrame = this._contentFrame;
        context.beginPath();
        context.rect(clipFrame.left, 0, clipFrame.width, clipFrame.height);
        context.clip();

        if (this.chart.state == ChartState.ZOOMING && isMainPanel)
            this.chart.zoomTool.draw();

        this.drawPlots();

        for (let indicator of chartIndicators) {
            if (indicator.chartPanel === this)
                indicator.draw();
        }

        for (let drawing of this._tradingDrawings) {
            drawing.draw();
        }

        if(isMainPanel) {
            for (let drawing of this._futureOrderDrawings) {
                drawing.draw();
            }
        }

        for (let drawing of this._chartAlertDrawings) {
            drawing.draw();
        }

        if (this.chart.showDrawings) {
            for (let drawing of this._drawings) {
                drawing.draw();
            }
        }



        if (this.chart.state == ChartState.MEASURING) {
            //NK draw the measurement tool only if we are drawing the chart panel that contains it
            if (this.chart.measurementTool.isMeasuringPanel(this)) {
                this.chart.measurementTool.draw();
            }
        }

        // NK draw custom chart panel objects

        // HA : this chart annotation will be drawn only on main panel , so i set this condition , because news drawing getting darker when drawing each new panel (indicator panel) .
        if(isMainPanel) {
            for (let customChartPanelObject of this.chart.getChartAnnotations()) {
                customChartPanelObject.draw();
            }
        }

        context.restore();
        this.setNeedsUpdateHoverRecord();
    }

    private getReferenceValueMarkerOwner(): ValueMarkerOwner {
        let pricePlot = this._plots.find(p => p.plotType == PlotType.PRICE_STYLE);
        if(pricePlot == null && this._plots.length > 0) {
            return this._plots[0];
        }
        return pricePlot;
    }

    private getValueMarkerOwners(referenceValueMarker: ValueMarkerOwner): ValueMarkerOwner[] {
        let owners: ValueMarkerOwner[] = [];

        // only adjust value marker owners or type indicator
        for (let plot of this._plots) {
            if(plot.plotType == PlotType.INDICATOR && plot != referenceValueMarker) {
                owners.push(plot)
            }
        }
        return owners;
    }

    private drawValueMarkers() {

        let referenceValueMarker = this.getReferenceValueMarkerOwner();
        let owners = this.getValueMarkerOwners(referenceValueMarker);
        ValueMarkerOwnerOperations.fixValueMarkersOverlapping(referenceValueMarker, owners);

        for (let plot of this._plots) {
            plot.drawValueMarkers();
        }
        for (let drawing of this._drawings) {
            drawing.drawSelectionMarkers();
        }
        for (let drawing of this._tradingDrawings) {
            drawing.drawValueMarkers();
        }
        for (let drawing of this._futureOrderDrawings) {
            drawing.drawValueMarkers();
        }
        for (let drawing of this._chartAlertDrawings) {
            drawing.drawValueMarkers();
        }
    }

    drawPlots() {
        for (let i = 1; i < PlotDrawingOrderType.PlotsMaxOrder; i++) {
            for (let plot of this._plots) {
                if (plot.drawingOrder == i) {
                    plot.draw();
                }
                if (plot.drawingOrder == PlotDrawingOrderType.SelectedPlot) {
                    plot.drawSelectionPoints();
                }
            }
        }
    }

    drawGridLines() {
        let options = this._options;
        if (!options.showXGrid && !options.showYGrid)
            return;

        let theme = this.actualTheme,
            frame = this._contentFrame,
            context = this.context;

        context.scxApplyStrokeTheme(theme.grid);
        if (options.showXGrid && theme.grid.verticalLines.strokeEnabled) {
            let majorTicks = this.chart.dateScale.calibrator.majorTicks;
            let showGridSessionLines: boolean = this.chart.dateScale.showGridSessionLines;
            let gridSessionLineColor: string = this.chart.dateScale.gridSessionLinesColor;
            let sessionBreaksLinesTheme: {[key: string]: number | string} = {
                width: 1,
                strokeColor: gridSessionLineColor,
                lineStyle: 'dash'
            };

            for (let tick of majorTicks) {
                context.beginPath();
                context.moveTo(tick.x, 0);
                context.lineTo(tick.x, frame.height);
                if (tick.major && showGridSessionLines) {
                    context.scxApplyStrokeTheme(sessionBreaksLinesTheme);
                } else {
                    context.scxApplyStrokeTheme(theme.grid.verticalLines);
                }
                context.stroke();
            }
        }
        context.beginPath();
        context.scxApplyStrokeTheme(theme.grid);
        if (options.showYGrid && theme.grid.horizontalLines.strokeEnabled) {
            let majorTicks = this.valueScale.calibrator.majorTicks;

            for (let tick of majorTicks) {
                context.moveTo(frame.left, tick.y);
                context.lineTo(frame.left + frame.width, tick.y);
                context.scxApplyStrokeTheme(theme.grid.horizontalLines);
            }
        }
        context.stroke();
    }

    /**
     * Layouts and draws chart panel.
     * @method update
     * @memberOf ChartPanel#
     */
    update() {
        this.layout(this.frame);
        this.draw();
    }

    setNeedsUpdate(needsAutoScale?: boolean) {
        if (needsAutoScale)
            this.setNeedsAutoScale();
        this._updateAnimation.start();
    }

    _onUpdateAnimationCallback() {
        this.update();
    }

    private _hoverRecord?: number;
    setNeedsUpdateHoverRecord(record?: number) {
        this._hoverRecord = record;
        this._updateHoverRecordAnimation.start();
    }

    _onUpdateHoverRecordAnimationCallback() {
        this.updateHoverRecord();
    }

    /**
     * Destroys chart panel (removes event subscriptions, html elements, etc.).
     * @method destroy
     * @memberOf ChartPanel#
     */
    destroy() {
        this._unSubscribeEvents();
        super.destroy();
    }

    private _titleNeedsUpdate: boolean;

    private _initInstrumentPanelTitle() {

        // MA add this back if you want to show ContextMenu
        // let menuConfig = {
        //     chart: this.chart,
        //     showOnClick: true,
        //     onItemSelected: (menuItem) => {
        //         switch (menuItem.data('id')) {
        //             case ChartContextMenu.MenuItem.FORMAT:
        //                 this.showPriceStyleFormatDialog();
        //                 break;
        //         }
        //     }
        // };

        let symbolTitle = this._controls.title.scxAppend('div'),
            symbol = symbolTitle.scxAppend('span', Class.TITLE_CAPTION);

        symbolTitle.scxAppend('span', Class.TITLE_VALUE).text('O:');
        let open = symbolTitle.scxAppend('span', Class.TITLE_VALUE);

        symbolTitle.scxAppend('span', Class.TITLE_VALUE).text('H: ');
        let high = symbolTitle.scxAppend('span', Class.TITLE_VALUE);

        symbolTitle.scxAppend('span', Class.TITLE_VALUE).text('L: ');
        let low = symbolTitle.scxAppend('span', Class.TITLE_VALUE);

        symbolTitle.scxAppend('span', Class.TITLE_VALUE).text('C: ');
        let close = symbolTitle.scxAppend('span', Class.TITLE_VALUE);

        symbolTitle.scxAppend('span', [Class.TITLE_VALUE , Class.OPTIONS_ICON, Class.OPTIONS_MENU])
            .attr('title', 'Menu')
            .on('click', (event: JQueryEventObject) => {
                this._chartPanelMenu.show(event);
            });

        this._barInfoControls = {
            rootDiv: symbolTitle,
            symbol: symbol,
            open: open,
            high: high,
            low: low,
            close: close,
            series: this.chart.primaryBarDataSeries()
        };
        this._titleNeedsUpdate = true;
        this._updateInstrument();
        this.updateHoverRecord();

        // MA add this back if you want to show ContextMenu
        // symbol.scx().chartContextMenu(menuConfig);
    }

    showPriceStyleFormatDialog() {
        ChartAccessorService.instance.getViewLoaderService().load(ViewLoaderType.PriceStyleDialog, (dialog: PriceStyleSettingsDialog) => {
            dialog.show({
                chart: this.chart,
                priceStyle: this.chart.priceStyle
            });
        });
    }

    /**
     * Update values in the title.
     * @method updateHoverRecord
     * @param {Number} [record] The currently hover record number.
     * @memberOf ChartPanel#
     * @private
     */
    updateHoverRecord(record?: number) {
        if (!this._barInfoControls)
            return;

        let series = this._barInfoControls.series,
            recordCount = series.close.length;
        if (recordCount <= 0)
            return;

        if (record == null)
            record = this.chart.hoveredRecord;
        if (record == null || record < 0 || record >= recordCount || isNaN(record))
            record = recordCount - 1;

        let controls = this._barInfoControls,
            openPrice = series.open.valueAtIndex(record),
            closePrice = series.close.valueAtIndex(record),
            isRaising = closePrice >= openPrice,
            theme = this.chart.theme,
            color = this.chart.getThemeType() == ThemeType.Light ? (isRaising ? '#006400' : '#800000') : (isRaising ? '#13e000' : '#ff4500');

        controls.open.text(this.formatValue(openPrice as number)).css('color', color);
        controls.high.text(this.formatValue(series.high.valueAtIndex(record) as number)).css('color', color);
        controls.low.text(this.formatValue(series.low.valueAtIndex(record) as number)).css('color', color);
        controls.close.text(this.formatValue(closePrice as number)).css('color', color);
        if (this._titleNeedsUpdate) {
            this._titleNeedsUpdate = false;
        }
    }

    hasIndicator(id: string): boolean {
        return this.indicators.find(indicator => indicator.id == id) != null;
    }

    getPlotIndicator(plot: Plot): Indicator {
        for (let indicator of this.indicators) {
            for (let indicatorPlot of indicator.plots) {
                if (plot == indicatorPlot) {
                    return indicator;
                }
            }
        }
        return null;
    }

    updatePriceStylePlotDataSeriesIfNeeded() {
        for (let plot of this.plots) {
            if (plot.plotType == PlotType.PRICE_STYLE) {
                plot.updateDataSeriesIfNeeded();
            }
        }
    }

    private _subscribeEvents() {
        let chart = this.chart;

        chart.on(ChartEvent.THEME_CHANGED + '.scxPanel', () => {
            this._applyTheme();
        }, this);
        if (chart.mainPanel === this) {
            chart.on(ChartEvent.HOVER_RECORD_CHANGED + '.scxPanel', (event: IValueChangedEvent) => {
                this.setNeedsUpdateHoverRecord(event.value as number); // MA compile typescript
            }, this);
            chart.on(ChartEvent.INSTRUMENT_CHANGED + '.scxPanel', () => {
                this._updateWatermark();
                this._updateInstrument();
            }, this);
        }
        chart.on(ChartEvent.VALUE_SCALE_ADDED + '.scxPanel', () => {
            this._valueScales.push(new ChartPanelValueScaleImplementation({chartPanel: this}));
        }, this);
        chart.on(ChartEvent.VALUE_SCALE_REMOVED + '.scxPanel', (event: IValueChangedEvent) => {
            this._valueScales.splice(event.value as number, 1); // MA compile typescript
        }, this);
        chart.on(ChartEvent.PRICE_STYLE_CHANGED + '.scxPanel', (event: IEventObject) => {
            if (this._barInfoControls)
                this._barInfoControls.series = this.chart.primaryBarDataSeries();
        }, this);
    }

    private _unSubscribeEvents() {
        let chart = this.chart;

        if (chart) {
            chart
                .off(ChartEvent.THEME_CHANGED + '.scxPanel', this)
                .off(ChartEvent.HOVER_RECORD_CHANGED + '.scxPanel', this)
                .off(ChartEvent.VALUE_SCALE_ADDED + '.scxPanel', this)
                .off(ChartEvent.VALUE_SCALE_REMOVED + '.scxPanel', this);
        }
    }

    protected _initGestures(): GestureArray {
        let gestures;

        if(BrowserUtils.isMobile()) {
            // MA for mobile, handle MouseWheel before Pan gestures (to reduce interference between both).
            gestures = new GestureArray([
                new MouseWheelGesture({
                    handler: this._handleMobileMouseWheel,
                    hitTest: this.hitTest
                }),
                new PanGesture({
                    handler: this._handlePanGesture,
                    hitTest: this._panGestureHitTest,
                    swipeHandler:this._handleSwipe
                }),
                new DoubleClickGesture({
                    handler: this._handleDoubleClickGesture,
                    hitTest: this.hitTest
                }),
                new ClickGesture({
                    handler: this._handleClickGesture,
                    hitTest: this.hitTest
                })
            ], this);
        } else {
            gestures = new GestureArray([
                new PanGesture({
                    handler: this._handlePanGesture,
                    hitTest: this._panGestureHitTest
                }),
                new MouseWheelGesture({
                    handler: this._handleDesktopMouseWheel,
                    hitTest: this.hitTest
                }),
                new ClickGesture({
                    handler: this._handleClickGesture,
                    hitTest: this.hitTest
                }),
                new DoubleClickGesture({
                    handler: this._handleDoubleClickGesture,
                    hitTest: this.hitTest
                })
            ], this);
        }

        return gestures;
    }

    private _panGestureHitTest(point: IPoint) {
        if (this.moveDirection === PanelMoveDirection.NONE)
            return false;

        return this.hitTest(point);
    }

    private _handlePanGesture(gesture: PanGesture) {
        let chart = this.chart;

        switch (gesture.state) {
            case GestureState.STARTED:
                chart.rootDiv.addClass(Class.SCROLL);
                break;
            case GestureState.FINISHED:
                chart.rootDiv.removeClass(Class.SCROLL);
                break;
            case GestureState.CONTINUED:
                let offset = gesture.moveOffset,
                    i: number,
                    valueScales: ChartPanelValueScale[];

                switch (this.moveDirection) {
                    case PanelMoveDirection.HORIZONTAL:
                        if (chart.dateScale.scrollOnPixels(offset.x)) {
                            let autoscale = this.moveKind === PanelMoveKind.AUTOSCALED;
                            chart.setNeedsUpdate(autoscale);
                        }
                        break;
                    case PanelMoveDirection.VERTICAL:
                        for (i = 0, valueScales = this.valueScales; i < valueScales.length; i++)
                            // MA TODO had to change _zoom to be *public* for this to work
                            valueScales[i]._zoomOrScrollWithUpdate(offset.y, this.valueScale.scrollOnPixels);
                        break;
                    case PanelMoveDirection.ANY:
                        // If date scale is updated then we have to redraw whole chart.
                        if (chart.dateScale.scrollOnPixels(offset.x) || this.moveKind === PanelMoveKind.AUTOSCALED) {
                            for (i = 0, valueScales = this.valueScales; i < valueScales.length; i++)
                                valueScales[i].scrollOnPixels(offset.y);

                            let autoscale = this.moveKind === PanelMoveKind.AUTOSCALED;
                            chart.setNeedsUpdate(autoscale);
                        } else {
                            // Otherwise we can just redraw panel to increase performance.
                            for (i = 0, valueScales = this.valueScales; i < valueScales.length; i++)
                                valueScales[i]._zoomOrScrollWithUpdate(offset.y, this.valueScale.scrollOnPixels);
                        }
                        break;
                    default:
                        return;
                }
                break;
        }
    }

    private _handleSwipe(event: ISwipeObject): boolean {
        if (this.chart.dateScale.scrollOnPixels(event.pixels)) {
            this.chart.setNeedsUpdate(this.moveKind === PanelMoveKind.AUTOSCALED);
            return false;
        } else {
            // HA : Stop Animation if we are already at the first / Last of chart ant try to swipe (don't stop if pixels are less than 3 )
            return !this.chart.dateScale.canScroll()
        }
    }

    private _handleMobileMouseWheel(gesture: MouseWheelGesture) {
        switch (gesture.state) {
            case GestureState.CONTINUED:
                let middlePointPosition = (this.chart.dateScale.projectionFrame.width - gesture.middlePoint.x) / this.chart.dateScale.projectionFrame.width;
                let directionSignal = gesture.scale < 1 ? -1 : 1;
                let zoomFactor = gesture.scale < 1 ? gesture.scale * 40 : 40 / gesture.scale;

                let leftPixel = directionSignal * (zoomFactor * (1 - middlePointPosition));
                let rightPixel = directionSignal * (zoomFactor * middlePointPosition);

                if (this.chart.dateScale.zoomOnPixels(leftPixel, rightPixel)) {
                    let autoScale = this.moveKind === PanelMoveKind.AUTOSCALED;
                    this.chart.setNeedsUpdate(autoScale);
                }
                break;
            default:
                return;
        }
    }

    private _handleDesktopMouseWheel(gesture: MouseWheelGesture) {
        let zoomFactor = 0.05;
        let frame = this.frame;
        this.chart.dateScale._handleZoom(-gesture.delta * zoomFactor * frame.width);
    }

    private _handleClickGesture() {
        let chart = this.chart,
            selectedObject = chart.selectedObject;

        if (selectedObject) {
            chart.selectObject(null);
            if ((selectedObject instanceof Drawing && this.containsDrawing(selectedObject)) || (selectedObject instanceof Plot && this.containsPlot(selectedObject))) {
                this.setNeedsUpdate();
            } else {
                chart.setNeedsUpdate();
            }
        }
    }

    private _handleDoubleClickGesture() {
        if(BrowserUtils.isMobile()) {
            this.chart.resetToPeriodDefaultZoomForMobile();
            // MA for mobile, ln double click, re-enable auto scaling
            this.chart.setAllowsAutoScaling(true);
            this.chart.setNeedsUpdate(true);
        }
        this._fire(PanelEvent.DOUBLE_CLICKED, this);
    }

    protected _createRootDiv(): JQuery {
        let div = this.chartPanelsContainer.rootDiv.scxAppend('div', Class.CONTAINER),
            isMainPanel = this === this.chart.mainPanel;

        if (isMainPanel) {
            let watermark = this._controls.watermark = div.scxAppend('div', Class.WATERMARK);
            let contentDiv = watermark.scxAppend('div', Class.WATERMARK_CONTENT);
            contentDiv.scxAppend('div', Class.WATERMARK_SYMBOL);
            contentDiv.scxAppend('div', Class.WATERMARK_INFO);
            if (!this.chart.readOnly) {
                contentDiv.scxAppend('div', Class.WATERMARK_LOGO);
            }
            this._updateWatermark();
        }

        this._canvas = div.scxAppendCanvas();
        this._context = (<HTMLCanvasElement> (this._canvas[0])).getContext('2d');
        this._controls.title = div.scxAppend('div', Class.TITLE);

        if (isMainPanel)
            this._initInstrumentPanelTitle();

        this._applyTheme();
        this._subscribeEvents();

        return div;
    }

    private _layoutHtmlElements(frame: Rect) {
        super.layout(frame);

        let containerFrame = this._panelsContainer.panelsContentFrame;
        this._contentFrame.copyFrom(frame);
        this._contentFrame.left = containerFrame.left;
        this._contentFrame.width = containerFrame.width;

        let isMainPanel = this === this.chart.mainPanel;

        this._canvas.scxCanvasSize(this.rootDiv.width(), this.rootDiv.height());
        if (isMainPanel) {
            this._controls.watermark.scxFrame(frame);
            this._barInfoControls.rootDiv.css('display', this.chart.showBarInfoInTitle ? 'block' : 'none');
        }

        let titleDiv = this._controls.title;
        titleDiv.scxPosition(this._contentFrame.left, 0).outerWidth(this._contentFrame.width);

        this._layoutOptions(titleDiv, isMainPanel);
    }

    private _layoutOptions(title: JQuery, isMainPanel: boolean) {
        if (isMainPanel)
            return;

        let controls = this._controls;

        if (!controls.options) {
            let optionsDiv = controls.options = title.scxAppend('div', Class.OPTIONS);

                if (BrowserUtils.isDesktop()) {
                    controls.moveUp = optionsDiv.scxAppend('span', [Class.OPTIONS_ICON, Class.OPTIONS_MOVE_UP])
                        .attr('title', 'Move Panel Up')
                        .on('click', () => {
                            if (this.getIndex() > 1) {
                                this._panelsContainer.movePanel(this, 1);
                                this.chart.setNeedsUpdate();
                            }
                        });
                    controls.moveDown = optionsDiv.scxAppend('span', [Class.OPTIONS_ICON, Class.OPTIONS_MOVE_DOWN])
                        .attr('title', 'Move Panel Down')
                        .on('click', () => {
                            this._panelsContainer.movePanel(this, -1);
                            this.chart.setNeedsUpdate();
                        });

                }

                let updateMaximizeOptionLayout = function () {
                    if (this.maximized) {
                        controls.options.closest('.scxChartPanel').addClass('maximized');
                    } else {
                        controls.options.closest('.scxChartPanel').removeClass('maximized');
                    }
                }.bind(this);

                controls.maximize = optionsDiv.scxAppend('span', [Class.OPTIONS_ICON, Class.OPTIONS_MAXIMIZE])
                    .attr('title', 'Maximize Panel')
                    .on('click', () => {
                        this.maximized = !this.maximized;
                        this.chart.setNeedsUpdate(true);
                        setTimeout(() => {
                            // NK update the chart after ensure the all value scales get the correct max and min values
                            this.chart.setNeedsUpdate(true);
                        });
                        updateMaximizeOptionLayout();
                    });
                updateMaximizeOptionLayout();

                controls.menu = optionsDiv.scxAppend('span', [Class.OPTIONS_ICON, Class.OPTIONS_MENU])
                    .attr('title', 'Menu')
                    .on('click', (event: JQueryEventObject) => {
                         this._chartPanelMenu.show(event);
                 });

               optionsDiv.css('display', this.chart.showPanelOptions ? 'block' : 'none');
        }

        if (controls.options && BrowserUtils.isDesktop()) {
            let index = this.getIndex();
            controls.moveUp.css('display', index > 1 ? 'inline-block' : 'none');
            controls.moveDown.css('display', index == this._panelsContainer.panels.length - 1 ? 'none' : 'inline-block');
        }

    }

    private _updateInstrument() {
        if (this._barInfoControls) {
            let instrument = this.chart.instrument;
            if (instrument)
                this._barInfoControls.symbol.text(instrument.symbol);
        }
    }

    private _applyTheme() {
        let title = this.titleDiv;
        if (!title)
            return;

        this._titleNeedsUpdate = true;

        let theme = this.actualTheme,
            watermark = this._controls.watermark;

        title.scxTextStyle(theme.title);

        //abu5, we need to set title background text color according to its background color, not according to the title theme
        // as the users may choose dark theme, and the chart background color is white
        title.css('color', HtmlUtil.isDarkColor(this.chart.theme.chart.background[0]) ? '#fff' : '#000');

        if (watermark) {
            let watermarkTheme = this.chart.theme.chart.instrumentWatermark;

            watermark.find('.' + Class.WATERMARK_SYMBOL).scxTextColor(watermarkTheme.symbol);
            watermark.find('.' + Class.WATERMARK_INFO).scxTextColor(watermarkTheme.details);
        }
    }

    private _updateWatermark() {
        let watermark = this._controls.watermark;
        if (watermark) {
            let instrument = this.chart.instrument;
            if (instrument) {
                watermark.find('.' + Class.WATERMARK_SYMBOL).text(instrument.symbol);

                let info = instrument.company;
                if (instrument.exchange)
                    info += " - " + instrument.exchange;
                watermark.find('.' + Class.WATERMARK_INFO).text(info);
            }
        }
    }

    private drawSeparatorForCutOffData() {
        let context = this.context;
        let projection = this.projection;
        let frame = this.contentFrame;
        let x = projection.xByDate(moment(this.chart.getCutOffDate()).toDate());
        context.moveTo(x,0);
        context.lineTo(x,frame.height);
        context.scxStroke({strokeColor: "rgb(0,0,0,0.3)"});
        context.fillStyle = 'rgb(0, 128, 255,0.1)';
        context.fillRect(x,0 , frame.right - x ,frame.height);
    }

    /* Chart panel menu */
    private _chartPanelMenu: ChartPanelMenu;

    private _initChartPanelMenu(): void {
        let chartPanelMenuConfig: IChartPanelMenuConfig = {
            chartPanel: this,
            isArabic:ChartAccessorService.instance.isArabic(),
            onItemSelected: (menuItem: JQuery, checked: boolean) => {
                switch (menuItem.data('id')) {
                    case ChartPanelMenu.menuItems.ALERT:
                        let value: AddChartAlertEventValue = {
                            price: 0.00,
                            panelIndex: this.getIndex(),
                            selectedIndicatorId: this == this.chart.mainPanel ? null : this.indicators[0].id
                        };
                        this.chart.fireValueChanged(ChartEvent.ADD_ALERT, value);
                        break;
                    case ChartPanelMenu.menuItems.DELETE:
                        this.indicators[0]._remove();
                        break;
                    case ChartPanelMenu.menuItems.CHART_ELEMENTS:
                        this.chart.fireValueChanged(ChartEvent.SHOW_OBJECTS_TREE);

                        break;
                    case ChartPanelMenu.menuItems.SETTINGS:
                        if (this == this.chart.mainPanel) {
                            this.chart.fireValueChanged(ChartEvent.SHOW_SETTINGS_DIALOG);
                        } else {
                            this.indicators[0].showSettingsDialog();
                        }
                        break;
                    case ChartPanelMenu.menuItems.SIMPLE_MOVING_AVERAGE:
                    case ChartPanelMenu.menuItems.EXPO_MOVING_AVERAGE:
                        this.onSelectingMovingAverage(menuItem.data('id') , menuItem.data('period'));
                        break;
                }
            },
        };

        this._chartPanelMenu = $('body').scx().chartPanelMenu(chartPanelMenuConfig)
    }

    private onSelectingMovingAverage(movingAverageType: number, period: number) {
        let ma = new TAIndicator({chart: this.chart, taIndicator: movingAverageType, panelIndex: this.getIndex()});
        ma.setParameterValue('Periods', period);
        ma.setParameterValue('Line Color', ColorUtils.getRandomDarkColorFromPallete());
        ma.setParameterValue('Line Width', 2);
        this.addMovingAverageToCurrentPanel(ma);
    }

    private addMovingAverageToCurrentPanel(ma: TAIndicator) {
        if (this == this.chart.mainPanel) {
            this.chart.addIndicators(ma);
        } else {
            ma.setParameterValue('Source', this.indicators[0].id + '_' + 0);
            ma.customSourceIndicatorId = this.indicators[0].id;
            this.chart.addIndicators(ma);
        }
    }

}

interface IChartPanelOptions {
    heightRatio?: number,
    minHeightRatio?: number,
    maxHeightRatio?: number,
    moveDirection?: string,
    moveKind?: string,
    showXGrid?: boolean,
    showYGrid?: boolean,
    maximized?: boolean,
}

interface IChartPanelControls {
    title: JQuery,
    options: JQuery,
    watermark: JQuery,
    moveUp: JQuery,
    moveDown: JQuery,
    close: JQuery,
    settings: JQuery,
    maximize: JQuery,
    menu:JQuery
}

interface IChartPanelBarInfoControls {
    rootDiv: JQuery,
    symbol: JQuery,
    open: JQuery,
    high: JQuery,
    low: JQuery,
    close: JQuery,
    series:IBarDataSeries
}

export interface IChartPanelState {
    chartPanelsContainer?: ChartPanelsContainer,
    options?: IChartPanelOptions,
    valueScales?: IChartPanelValueScaleState[],
    valueScale?: IChartPanelValueScaleState
}
