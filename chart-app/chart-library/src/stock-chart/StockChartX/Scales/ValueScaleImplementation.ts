
import {ChartComponent} from "../Controls/ChartComponent";
import {ValueScalePanel} from "./ValueScalePanel";
import {JsUtil} from "../Utils/JsUtil";
import {Rect} from "../Graphics/Rect";
import {Chart} from "../Chart";
import {IValueScaleConfig, ValueScale} from "./ValueScale";

const Class = {
    LEFT_SCALE: "scxLeftValueScale",
    RIGHT_SCALE: "scxRightValueScale"
};

/**
 * Represents value scale on the chart.
 * @param {Object} config The configuration object.
 * @param {Chart} config.chart The parent chart.
 * @constructor ValueScale
 * @augments ChartComponent
 */
export class ValueScaleImplementation extends ChartComponent implements ValueScale{
    private _leftPanel: ValueScalePanel;
    /**
     * The left value scale panel.
     * @name leftPanel
     * @type {ValueScalePanel}
     * @readonly
     * @memberOf ValueScalePanel#
     */
    get leftPanel(): ValueScalePanel {
        return this._leftPanel;
    }

    private _rightPanel: ValueScalePanel;
    /**
     * The right value scale panel.
     * @name rightPanel
     * @type {ValueScalePanel}
     * @readonly
     * @memberOf ValueScalePanel#
     */
    get rightPanel(): ValueScalePanel {
        return this._rightPanel;
    }

    private _options: IValueScaleConfig = null;

    // noinspection JSMethodCanBeStatic
    /**
     * Gets CSS class name of the left value scale root div element.
     * @name leftPanelCssClass
     * @type {string}
     * @readonly
     * @memberOf ValueScale#
     * @see [rightPanelCssClass]{@linkcode ValueScale#rightPanelCssClass} to get css class name of the right panel.
     */
    get leftPanelCssClass(): string {
        return Class.LEFT_SCALE;
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Gets CSS class name of the right value scale root div element.
     * @name rightPanelCssClass
     * @type {string}
     * @readonly
     * @memberOf ValueScale#
     * @see [leftPanelCssClass]{@linkcode ValueScale#leftPanelCssClass} to get css class name of the left panel.
     */
    get rightPanelCssClass(): string {
        return Class.RIGHT_SCALE;
    }

    /**
     * Gets/Sets flag that indicates whether manual width should be used.
     * @name useManualWidth
     * @type {boolean}
     * @memberOf ValueScale#
     * @see [manualWidth]{@linkcode ValueScale#manualWidth} to set manual width.
     */
    get useManualWidth(): boolean {
        return this._options.useManualWidth;
    }

    set useManualWidth(value: boolean) {
        this._options.useManualWidth = !!value;
    }

    /**
     * Gets/Sets manual width.
     * @name manualWidth
     * @type {number}
     * @memberOf ValueScale#
     * @see [useManualWidth]{@linkcode ValueScale#useManualWidth} to enable manual width usage.
     */
    get manualWidth(): number {
        return this._options.width;
    }

    set manualWidth(value: number) {
        if (!JsUtil.isFiniteNumber(value) || value <= 0)
            throw new Error("Width must be greater than 0.");

        this._options.width = value;
    }

    get leftPanelVisible(): boolean {
        return this._options.showLeftPanel;
    }

    set leftPanelVisible(value: boolean) {
        this._leftPanel.visible = this._options.showLeftPanel = !!value;
    }

    get rightPanelVisible(): boolean {
        return this._options.showRightPanel;
    }

    set rightPanelVisible(value: boolean) {
        this._rightPanel.visible = this._options.showRightPanel = !!value;
    }

    get index(): number {
        return this.chart.valueScales.indexOf(this);
    }

    constructor(config: IValueScaleConfig) {
        super(config);

        this._leftPanel = new ValueScalePanel({
            valueScale: this,
            cssClass: Class.LEFT_SCALE
        });
        this._rightPanel = new ValueScalePanel({
            valueScale: this,
            cssClass: Class.RIGHT_SCALE
        });

        this.loadState(config);
    }

    /**
     * @inheritdoc
     */
    saveState(): IValueScaleConfig {
        return $.extend(true, {}, this._options);
    }

    /**
     * @inheritdoc
     */
    loadState(state: IValueScaleConfig) {
        state = state || <IValueScaleConfig>{};

        this._options = <IValueScaleConfig>{};

        this.leftPanelVisible = state.showLeftPanel !== undefined ? !!state.showLeftPanel : false;
        this.rightPanelVisible = state.showRightPanel !== undefined ? !!state.showRightPanel : true;
        this.manualWidth = state.width || 100;
        this.useManualWidth = state.useManualWidth !== undefined ? !!state.useManualWidth : false;
    }

    /**
     * Layouts value scale elements.
     * @method layout
     * @param {Rect} frame The chart panels container frame rectangle.
     * @memberOf ValueScale#
     */
    layout(frame: Rect) {
        let leftFrame = this._leftPanel.layout(frame, true);
        let rightFrame = this._rightPanel.layout(frame, false);

        let remainingFrame = frame.clone();
        if (leftFrame)
            remainingFrame.cropLeft(leftFrame);
        if (rightFrame)
            remainingFrame.cropRight(rightFrame);

        return remainingFrame;
    }

    /**
     * @inheritdoc
     */
    draw() {

    }

    /**
     * @inheritdoc
     */
    destroy() {
        this.leftPanel.destroy();
        this.rightPanel.destroy();

        super.destroy();
    }
}
