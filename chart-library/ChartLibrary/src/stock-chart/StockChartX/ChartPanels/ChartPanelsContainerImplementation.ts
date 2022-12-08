import {IPadding, IRect, Rect} from "../Graphics/Rect";
import {ChartFrameControl, IChartFrameControlConfig} from '../Controls/ChartFrameControl';
import {ChartPanelImplementation} from "./ChartPanelImplementation";
import {ChartPanel} from './ChartPanel';
import {JsUtil} from "../Utils/JsUtil";
import {ChartPanelSplitter} from "./ChartPanelSplitter";
import {GestureArray} from "../Gestures/GestureArray";
import {MouseHoverGesture} from "../Gestures/MouseHoverGesture";
import {Chart, ChartEvent} from "../Chart";
import {Gesture, WindowEvent} from "../Gestures/Gesture";
import {IPoint} from "../Graphics/ChartPoint";
import {ChartPanelsContainer} from "./ChartPanelsContainer";
import {AxisScaleType} from '../Scales/axis-scale-type';
import {ContextMenuGesture} from '../Gestures/ContextMenuGesture';
import {BrowserUtils} from '../../../utils';

export interface IChartPanelsContainerOptions {
    newPanelHeightRatio: number;
    panelPadding: IPadding;
    maximized: boolean,
    panels?: ChartPanel[]
}

const CLASS_CONTAINER = 'scxPanelsContainer';
const EVENTS_SUFFIX = '.scxPanelsContainer';

/**
 * Represents container for chart panels.
 * @param {Object} config The configuration object.
 * @param {chart} config.chart The parent chart.
 * @constructor ChartPanelsContainer
 * @augments Control
 */

export class ChartPanelsContainerImplementation extends ChartFrameControl implements ChartPanelsContainer{
    private _panels: ChartPanel[] = [];
    /**
     * Gets array of chart panels.
     * @name panels
     * @type {ChartPanel[]}
     * @readonly
     * @memberOf ChartPanelsContainer#
     */
    get panels(): ChartPanel[] {
        return this._panels;
    }

    /**
     * Gets/Sets default height ratio of new chart panels. The value must be in range (0..1).
     * @name newPanelHeightRatio
     * @type {Number}
     * @default 0.2
     * @memberOf ChartPanelsContainer#
     */
    get newPanelHeightRatio(): number {
        return this._options.newPanelHeightRatio;
    }

    set newPanelHeightRatio(value: number) {
        if (!JsUtil.isPositiveNumber(value) || value >= 1)
            throw new Error("Ratio must be a number in range (0..1)");

        this._options.newPanelHeightRatio = value;
    }

    /**
     * Gets/Sets panel content padding.
     * @name panelPadding
     * @type {Padding}
     * @memberOf ChartPanelsContainer#
     * @private
     */
    get panelPadding(): IPadding {
        return this._options.panelPadding;
    }

    set panelPadding(value: IPadding) {
        this._options.panelPadding = value;
    }

    /**
     * The array of chart panel splitters.
     * @name _splitters
     * @type {Array}
     * @memberOf ChartPanelsContainer#
     * @private
     */
    private _splitters: ChartPanelSplitter[] = [];

    private _options: IChartPanelsContainerOptions = <IChartPanelsContainerOptions>{};

    /**
     * Gets panels content frame rectangle (excluding value scales).
     * @name panelsContentFrame
     * @type {Rect}
     * @readonly
     * @memberOf ChartPanelsContainer#
     */
    private _panelsContentFrame = new Rect();
    get panelsContentFrame(): Rect {
        return this._panelsContentFrame;
    }

    constructor(config: IChartFrameControlConfig) {
        super(config);

        this.loadState(config);
        if (this._panels.length === 0) {
            this._panels.push(new ChartPanelImplementation({
                chartPanelsContainer: this
            }));
        }
    }

    protected _initGestures(): GestureArray {
        let gestures: Gesture[] = [
            new MouseHoverGesture({
                handler: this._handleMouseHoverGesture,
                hitTest: this._mouseHoverHitTest
            })
        ];

        if(BrowserUtils.isMobile()) {
            gestures.push(
                new ContextMenuGesture({
                handler: this._handleMobileContextMenuGesture,
                hitTest: this.hitTest
            }));
        }

        return new GestureArray(gestures, this);
    }

    private _handleMobileContextMenuGesture() {
        this.chart.fireValueChanged(ChartEvent.MOBILE_LONG_PRESS);
    }

    protected _subscribeEvents() {
        this.chart.on(ChartEvent.THEME_CHANGED + EVENTS_SUFFIX, () => {
            for (let splitter of this._splitters) {
                splitter.isThemeApplied = false;
            }
        });
    }

    protected _unsubscribeEvents() {
        this.chart.off(EVENTS_SUFFIX);
    }

    /**
     * Adds new chart panel.
     * @method addPanel
     * @param {Number} [index] The index to insert panel at.
     * @param {Number} [heightRatio] The height ratio of new panel.
     * @param {Boolean} [shrinkMainPanel] True to shrink main panel, false to shrink all panels.
     * @returns {ChartPanel} The newly created chart panel.
     * @throws An error is thrown on lack of free space.
     * @memberOf ChartPanelsContainer#
     * @see [removePanel]{@linkcode ChartPanelsContainer#removePanel}
     */
    addPanel(index?: number, heightRatio?: number, shrinkMainPanel?: boolean): ChartPanel {
        let panels = this._panels;
        let newHeightRatio = heightRatio || this.newPanelHeightRatio;
        let panel = new ChartPanelImplementation({
            chartPanelsContainer: this,
            options: {
                heightRatio: newHeightRatio
            }
        });

        try {
            if (shrinkMainPanel && panels.length > 0) {
                let mainPanel = this.chart.mainPanel,
                    mainPanelRatio = mainPanel.heightRatio - newHeightRatio;

                if (mainPanelRatio >= mainPanel.minHeightRatio)
                    mainPanel.heightRatio = mainPanelRatio;
                else
                    this._adjustHeightRatiosToEncloseNewRatio(newHeightRatio);
            } else {
                this._adjustHeightRatiosToEncloseNewRatio(newHeightRatio);
            }
        } catch (exception) {
            let availableHeightRatio = this._getAvailableHeightRatio();

            if (availableHeightRatio > 0 && availableHeightRatio >= panel.minHeightRatio)
                panel.heightRatio = availableHeightRatio;
            else
                throw exception;
        }

        if (index == null)
            panels.push(panel);
        else
            panels.splice(index, 0, panel);
        this._updateSplitters();

        this.chart.fireValueChanged(ChartEvent.PANEL_ADDED, panel);

        return panel;
    }

    /**
     * Removes given chart panel.
     * @method removePanel
     * @param {number | ChartPanel} panel The index of chart panel or chart panel object to be removed.
     * @throws An error is thrown on attempt to remove main panel.
     * @memberOf ChartPanelsContainer#
     * @see [addPanel]{@linkcode ChartPanelsContainer#addPanel}
     */
    removePanel(panel: number | ChartPanel) {
        let chartPanel: ChartPanel;

        if (typeof panel === 'number') {
            // It's an index of panel. Need to find panel object.
            chartPanel = this._panels[panel];
        } else {
            chartPanel = <ChartPanel> panel;
        }

        // Main panel must not be removed.
        let chart = this.chart,
            mainPanel = chart.mainPanel;
        if (chartPanel === mainPanel)
            throw new Error("Main panel cannot be removed.");

        let panels = this._panels;
        for (let i = 0; i < panels.length; i++) {
            if (panels[i] === chartPanel) {
                // Indicators are stored in chart. Remove all indicators from this panel.
                chart.removeIndicators(chartPanel.indicators, false);

                mainPanel.heightRatio = Math.roundToDecimals(mainPanel.heightRatio + chartPanel.heightRatio, 8);
                panels.splice(i, 1);
                chartPanel.destroy();
                this._updateSplitters();

                chart.fireValueChanged(ChartEvent.PANEL_REMOVED, chartPanel);

                break;
            }
        }
    }

    /**
     * Moves panel up/down.
     * @method movePanel
     * @param {ChartPanel} panel The panel to move.
     * @param {number} offset The panel index offset (positive number to move up, negative to move down).
     * @memberOf ChartPanelsContainer#
     */
    movePanel(panel: ChartPanel, offset: number) {
        if (!JsUtil.isFiniteNumber(offset))
            throw new TypeError("Offset must be a number.");

        let panels = this._panels;
        for (let i = 0; i < panels.length; i++) {
            if (panels[i] === panel) {
                let newIndex = Math.min(Math.max(i - offset, 0), panels.length - 1);
                if (newIndex !== i) {
                    panels.splice(i, 1);
                    panels.splice(newIndex, 0, panel);
                }

                break;
            }
        }
        this._updateSplitters();
    }

    getTotalPanelsHeight(): number {
        let size = this.rootDiv.scxContentSize(),
            splitterHeight = ChartPanelSplitter.getHeight();

        return size.height - splitterHeight * (this._panels.length - 1);
    }

    /**
     * Gets chart panel at a given Y coordinate.
     * @method findPanelAt
     * @param {number} y The Y coordinate.
     * @returns {ChartPanel}
     * @memberOf ChartPanelsContainer#
     */
    findPanelAt(y: number): ChartPanel {
        y -= this.frame.top;

        for (let panel of this._panels) {
            let frame = panel.frame;
            if (y >= frame.top && y <= frame.bottom)
                return panel;
        }

        return null;
    }

    private _updateSplitters() {
        let panels = this._panels,
            splitters = this._splitters,
            newSplittersCount = panels.length - 1,
            removeStartIndex = splitters.length - 1 - newSplittersCount;

        if (removeStartIndex >= 0) {
            for (let i = removeStartIndex; i < splitters.length; i++)
                splitters[i].destroy();
            splitters.splice(removeStartIndex, splitters.length - removeStartIndex);
        }

        for (let i = 0; i < newSplittersCount; i++) {
            let isNewObj = i >= splitters.length,
                splitter = isNewObj ? new ChartPanelSplitter() : splitters[i];

            splitter._index = i;
            splitter._topPanel = panels[i];
            splitter._bottomPanel = panels[i + 1];
            if (isNewObj)
                splitters.push(splitter);
        }
    }

    private _getAvailableHeightRatio(): number {
        return 1 - this._panels.reduce((sum: number, panel: ChartPanel) => {
            return sum + panel.heightRatio;
        }, 0);
    }

    private _adjustHeightRatiosToEncloseNewRatio(newRatio: number) {
        while (true) {
            let excess = newRatio - this._getAvailableHeightRatio();
            if (excess <= 1E-5)
                break;

            let isUpdated = false;
            for (let panel of this._panels) {
                let decreasedRatio = panel.heightRatio - excess * panel.heightRatio;

                if (decreasedRatio >= panel.minHeightRatio) {
                    panel.heightRatio = decreasedRatio;
                    isUpdated = true;
                }
            }

            if (!isUpdated) {
                throw new Error("Insufficient height. Other panels use too much height. " +
                    "You have to update minimum height weight of existing panels to free some space.");
            }
        }
    }

    /**
     * Sets panel height ratio. Unlike heightRatio property of the chart panel this method updates height ratio of the main panel.
     * So if you increase panel height ratio by 0.1, height ratio of the main panel will be decreased by 0.1.
     * @method setPanelHeightRatio
     * @param {ChartPanel} panel The chart panel to set height ratio to.
     * @param {number} ratio The new height ratio.
     * @memberOf ChartPanelsContainer#
     */
    setPanelHeightRatio(panel: ChartPanel, ratio: number) {
        let mainPanel = this.chart.mainPanel;
        if (panel === mainPanel) {
            panel.heightRatio = ratio;
        } else {
            let oldRatio = panel.heightRatio;
            panel.heightRatio = ratio;
            mainPanel.heightRatio -= panel.heightRatio - oldRatio;
        }
    }

    handleEvent(event: WindowEvent): boolean {
        for (let splitter of this._splitters) {
            if (splitter.handleEvent(event))
                return true;
        }

        super.handleEvent(event);

        // Convert point to chart panels container coordinate system.
        event.pointerPosition.x -= this.frame.left;
        event.pointerPosition.y -= this.frame.top;

        for (let panel of this._panels) {
            if (panel.handleEvent(event))
                return true;
        }

        return false;
    }

    private _handleMouseHoverGesture(gesture: Gesture, event: WindowEvent) {
        this.chart.crossHair.handleMouseHoverGesture(gesture, event);
    }

    private _mouseHoverHitTest(point: IPoint) {
        return this._panelsContentFrame.containsPoint(point);
    }

    /**
     * Marks that value scales needs to be auto-scaled on next layout.
     * @method setNeedsAutoScale
     * @memberOf ChartPanelsContainer#
     */
    setNeedsAutoScale() {
        for (let panel of this._panels)
            panel.setNeedsAutoScale();
    }

    setAxisScale(axisScaleType:AxisScaleType):void {
        for (let panel of this._panels) {
            if (panel == this.chart.mainPanel) {
                panel.setAxisScale(axisScaleType);
            }
        }
    }

    getAxisScale():AxisScaleType {
        for (let panel of this._panels) {
            if (panel == this.chart.mainPanel) {
                return panel.getAxisScale();
            }
        }
        return AxisScaleType.Linear;
    }

    /**
     * Save all chart panels state.
     * @method saveState
     * @returns {Object[]}
     * @memberOf ChartPanelsContainer#
     * @see [loadState]{@linkcode ChartPanelsContainer#loadState} to load state.
     */
    saveState(): IChartPanelsContainerOptions {
        let state = $.extend(true, {}, this._options);
        state.panels = [];

        for (let panel of this._panels) {
            state.panels.push(panel.saveState());
        }

        return state;
    }

    /**
     * Loads state.
     * @method loadState
     * @param {Object[]} state The state saved by saveState method.
     * @memberOf ChartPanelsContainer#
     * @see [saveState]{@linkcode ChartPanelsContainer#saveState} to save state.
     */
    loadState(stateOrConfig: IChartPanelsContainerOptions | IChartFrameControlConfig) {
        let state = (stateOrConfig as IChartPanelsContainerOptions)  || <IChartPanelsContainerOptions>{};

        this._options = <IChartPanelsContainerOptions> {};
        this.newPanelHeightRatio = state.newPanelHeightRatio || 0.2;
        this.panelPadding = state.panelPadding || {
            left: 5,
            top: 10,
            right: 5,
            bottom: 10
        };

        let panels = this._panels;
        for (let panel of panels) {
            panel.destroy();
        }
        panels.length = 0;

        if (state.panels) {
            for (let panelState of state.panels) {
                let config = $.extend({chartPanelsContainer: this}, panelState);
                let panel = new ChartPanelImplementation(config);

                panels.push(panel);
            }
        }
        this._updateSplitters();
    }

    protected _createRootDiv(): JQuery {
        return this.chart.rootDiv.scxAppend('div', CLASS_CONTAINER);
    }

    /**
     * Layouts chart panels container only.
     * @method layoutScalePanel
     * @param {Rect} chartPanelsFrame The chart panels container frame rectangle
     * @memberOf ChartPanelsContainer#
     */
    layoutScalePanel(chartPanelsFrame: Rect) {
        super.layout(chartPanelsFrame);

        // Layout value scales
        let size = this.rootDiv.scxContentSize();
        let contentFrame = this._panelsContentFrame;
        contentFrame.left = chartPanelsFrame.left;
        contentFrame.top = chartPanelsFrame.top;
        contentFrame.width = size.width;
        contentFrame.height = size.height;

        let scales = this.chart.valueScales;
        for (let i = scales.length - 1; i >= 0; i--) {
            contentFrame = scales[i].layout(contentFrame);
        }
        this._panelsContentFrame = contentFrame;

        return new Rect({
            left: contentFrame.left,
            top: contentFrame.top,
            width: contentFrame.width,
            height: chartPanelsFrame.height
        });
    }

    /**
     * @inheritdoc
     */
    layout(frame: IRect) {
        if (this.hasMaximizedPanel()) {
            this.maximizedLayout();
            this.chart.fireValueChanged(ChartEvent.PANEL_TOGGLE_MAXIMIZE, true);
        } else {
            this.normalLayout();
            this.chart.fireValueChanged(ChartEvent.PANEL_TOGGLE_MAXIMIZE, false);
        }
    }

    private maximizedLayout() {

        let size = this.rootDiv.scxContentSize();
        let panelsCount = this._panels.length;
        let contentHeight = this.getTotalPanelsHeight();

        for (let i = 0; i < panelsCount; i++) {
            let panel = this._panels[i];
            if (panel.maximized) {
                panel.layout(new Rect({
                    top: 0,
                    left: 0,
                    width: size.width,
                    height: contentHeight
                }))
            } else {
                panel.layout(new Rect({
                    top: 0,
                    left: 0,
                    width: 0,
                    height: 0
                }))
            }

            if (i < panelsCount - 1) {
                this._splitters[i].layout(new Rect({
                    top: 0,
                    left: 0,
                    width: 0,
                    height: 0
                }));
            }
        }
    }

    private normalLayout() {

        let size = this.rootDiv.scxContentSize();
        let splitterHeight = ChartPanelSplitter.getHeight();
        let panelsCount = this._panels.length;
        let contentHeight = this.getTotalPanelsHeight();
        let top = 0;

        for (let i = 0; i < panelsCount; i++) {
            let panel = this._panels[i];
            let height = Math.round(contentHeight * panel.heightRatio);
            let panelFrame = new Rect({
                left: 0,
                top: top,
                width: size.width,
                height: height
            });

            top += height;
            panel.layout(panelFrame);

            if (i < panelsCount - 1) {
                let splitterFrame = new Rect({
                    left: 0,
                    top: top,
                    width: size.width,
                    height: splitterHeight
                });
                this._splitters[i].layout(splitterFrame);
                top += splitterHeight;
            }
        }
    }

    private hasMaximizedPanel(): boolean {
        for (let i = 0; i < this._panels.length; i++) {
            if (this._panels[i].maximized) {
                return true;
            }
        }
        return false;
    }

    layoutSplitterPanels(splitter: ChartPanelSplitter) {
        let contentHeight = this.getTotalPanelsHeight(),
            updatePanelFunc = (panel: ChartPanel) => {
                panel.frame.height = Math.round(contentHeight * panel.heightRatio);
                panel.setNeedsUpdate();
            };

        let topPanel = splitter.topPanel;
        updatePanelFunc(topPanel);

        let splitterFrame = splitter.frame;
        splitterFrame.top = topPanel.frame.bottom;
        splitter.layout(splitterFrame);

        let bottomPanel = splitter.bottomPanel;
        bottomPanel.frame.top = splitterFrame.top + ChartPanelSplitter.getHeight();
        updatePanelFunc(bottomPanel);
    }

    /**
     * @inheritdoc
     */
    draw() {
        for (let panel of this._panels)
            panel.draw();
    }

    /**
     * @inheritdoc
     */
    destroy() {
        for (let panel of this._panels)
            panel.destroy();
        for (let splitter of this._splitters)
            splitter.destroy();

        super.destroy();
    }
}
