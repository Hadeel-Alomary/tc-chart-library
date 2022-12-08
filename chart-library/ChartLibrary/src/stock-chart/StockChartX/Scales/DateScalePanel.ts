/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {FrameControl} from "../Controls/FrameControl";
import {DateScale, DateScaleScrollKind, DateScaleZoomKind} from "./DateScale";
import {Chart, ChartEvent} from "../Chart";
import {GestureArray} from "../Gestures/GestureArray";
import {DoubleClickGesture} from "../Gestures/DoubleClickGesture";
import {PanGesture} from "../Gestures/PanGesture";
import {MouseWheelGesture} from "../Gestures/MouseWheelGesture";
import {GestureState, WindowEvent} from "../Gestures/Gesture";
import {HtmlUtil} from "../Utils/HtmlUtil";
import {IPoint} from "../Graphics/ChartPoint";
import {Geometry} from "../Graphics/Geometry";
import {Rect} from "../Graphics/Rect";
import {BrowserUtils} from '../../../utils';
import {DrawingMarkers} from '../Drawings/DrawingMarkers';
import {Projection} from './Projection';


const Class = {
    CONTAINER: "scxDateScale",
    SCROLL: "scxDateScaleScroll"
};

/**
 * Represent date scale panel on the chart.
 * @param {Object}                  config  The configuration object.
 * @param {DateScale}   config.dateScale The parent date scale.
 * @param {String}                  config.cssClass The css class name of div element that holds date scale panel.
 * @param {Boolean}                 config.visible The flag that indicates whether panel is visible.
 * @constructor DateScalePanel
 */
export class DateScalePanel extends FrameControl {
    private _dateScale: DateScale;
    /**
     * Parent date scale.
     * @name dateScale
     * @type {DateScale}
     * @readonly
     * @memberOf DateScalePanel#
     */
    get dateScale(): DateScale {
        return this._dateScale;
    }

    /**
     * Returns parent chart.
     * @name chart
     * @type {Chart}
     * @readonly
     * @memberOf DateScalePanel#
     */
    get chart(): Chart {
        return this._dateScale && this._dateScale.chart;
    }

    private _cssClass: string;
    /**
     * The css class name of div element that holds date scale panel.
     * @name cssClass
     * @type {String}
     * @readonly
     * @memberOf DateScalePanel#
     */
    get cssClass(): string {
        return this._cssClass;
    }

    private _isVisible = true;

    /**
     * The flag that indicates whether panel is visible.
     * @name visible
     * @type {boolean}
     * @readonly
     * @memberOf DateScalePanel#
     */
    get visible(): boolean {
        return this._isVisible;
    }

    /**
     * The HTML5 canvas element to draw on.
     * @name _canvas
     * @type {JQuery}
     * @memberOf DateScalePanel#
     * @private
     */
    private _canvas: JQuery;

    /**
     * The canvas rendering context.
     * @name _context
     * @type {CanvasRenderingContext2D}
     * @memberOf DateScalePanel#
     * @private
     */
    private _context: CanvasRenderingContext2D;


    constructor(config: DateScalePanelState) {
        super();

        if (typeof config !== 'object')
            throw new TypeError('Config must be an object.');

        this._dateScale = config.dateScale;

        if (config.cssClass == null)
            throw new Error("'config.cssClass' is not specified.");
        this._cssClass = config.cssClass;

        this._isVisible = config.visible != null ? !!config.visible : true;

        this._initGestures();

        this.chart.on(ChartEvent.THEME_CHANGED + '.scxDateScalePanel', () => {
            this.applyTheme();
        });
    }

    protected _initGestures(): GestureArray {
        if(BrowserUtils.isMobile()) {
            return new GestureArray([
                new DoubleClickGesture({
                    handler: this._handleDoubleClickGesture
                }),
                new MouseWheelGesture({
                    handler: this._handleMouseWheel
                }),
                new PanGesture({
                    handler: this._handlePanGesture,
                    verticalMoveEnabled: false
                })
            ], this, this.hitTest);
        } else {
            return new GestureArray([
                new DoubleClickGesture({
                    handler: this._handleDoubleClickGesture
                }),
                new PanGesture({
                    handler: this._handlePanGesture,
                    verticalMoveEnabled: false
                }),
                new MouseWheelGesture({
                    handler: this._handleMouseWheel
                })
            ], this, this.hitTest);
        }

    }

    private _handleDoubleClickGesture() {
        this.chart.setNeedsUpdate(true);
    }

    private _handlePanGesture(gesture: PanGesture, event: WindowEvent) {
        let chart = this.chart;

        switch (gesture.state) {
            case GestureState.STARTED:
                chart.rootDiv.addClass(Class.SCROLL);
                break;
            case GestureState.FINISHED:
                chart.rootDiv.removeClass(Class.SCROLL);
                break;
            case GestureState.CONTINUED:
                let offset = gesture.moveOffset.x,
                    isUpdated = false,
                    autoscale = false;

                if (event.evt.which == 1) {
                    isUpdated = this._dateScale.scrollOnPixels(offset);
                    autoscale = isUpdated && this._dateScale.scrollKind == DateScaleScrollKind.AUTOSCALED;
                } else {
                    isUpdated = this._dateScale.zoomOnPixels(offset);
                    autoscale = isUpdated && this._dateScale.zoomKind == DateScaleZoomKind.AUTOSCALED;
                }
                if (isUpdated) {
                    chart.setNeedsUpdate(autoscale);
                }
                break;
        }
    }

    private _handleMouseWheel(gesture: MouseWheelGesture) {
        let zoomFactor = BrowserUtils.isMobile() ? 0.075 : 0.05;
        let frame = this.frame,
            pixels = zoomFactor * frame.width;

        this._dateScale._handleZoom(-gesture.delta * pixels);
    }


    public drawSelectionMarker(drawingMarkers:DrawingMarkers, points:IPoint[], projection: Projection) {
        // MA at the beginning, we need to redraw date axis in order to clear any previous markers that are drawn before.
        this.draw();
        drawingMarkers.drawSelectionDateMarkers(this.chart, points, this._context, projection);

    }

    applyTheme() {
        if (!this.rootDiv)
            return;

        let theme = this._dateScale.actualTheme,
            border = theme.border,
            cssKey = this._cssClass == this._dateScale.topPanelCssClass ? 'border-bottom' : 'border-top';

        this.rootDiv.css(cssKey, border.width + 'px ' + border.lineStyle + ' ' + border.strokeColor);
    }

    /**
     * Return client area height
     * @method _getClientHeight
     * @returns {Number}
     * @memberOf DateScalePanel#
     * @private
     */
    private _getClientHeight() {
        let dateScale = this._dateScale;

        if (dateScale.useManualHeight)
            return dateScale.manualHeight;

        let textHeight = HtmlUtil.getFontSize(dateScale.actualTheme.text);

        return textHeight + dateScale.textPadding.bottom + dateScale.majorTickMarkLength + 1;
    }

    /**
     * @inheritdoc
     */
    hitTest(point: IPoint): boolean {
        let frame = this.frame;

        // For mobile, let us disable DateScalePanel clicks (as they kept triggering and not needed on mobile)
        if (BrowserUtils.isDesktop() && frame)
            return Geometry.isPointInsideOrNearRect(point, frame);

        return false;
    }

    /**
     * Layouts just root div element without children.
     * @method layoutPanel
     * @param {Rect} frameInChart The frame rectangle in chart coordinate system.
     * @param {Boolean} isTopPanel True if it is a top panel, false if it is a bottom panel.
     * @returns {Rect} The date scale frame rectangle.
     * @memberOf DateScalePanel#
     * @private
     */
    layoutPanel(frameInChart: Rect, isTopPanel: boolean) {
        let div = this._rootDiv,
            frame: Rect = null;

        if (this._isVisible) {
            if (!div) {
                this._rootDiv = div = this.chart.rootDiv.scxAppend('div', Class.CONTAINER)
                    .addClass(this._cssClass);
                this.applyTheme();
            }
            div.outerWidth(frameInChart.width)
                .innerHeight(this._getClientHeight());

            frame = this.frame;
            frame.left = frameInChart.left;
            frame.width = frameInChart.width;
            frame.height = div.outerHeight();
            frame.top = isTopPanel ? 0 : frameInChart.bottom - frame.height;

            div.css('left', frame.left)
                .css('top', frame.top);
        } else {
            if (div != null) {
                div.remove();
                this._rootDiv = null;
            }
        }

        return frame;
    }

    /**
     * Layouts date scale panel elements
     * @method layout
     * @param {Rect} frameInChart The content frame rectangle.
     * @param {Boolean} isTopPanel True if it is a top panel, false if it is a bottom panel.
     * @memberOf DateScalePanel#
     */
    layout(frameInChart: Rect, isTopPanel?: boolean) {
        this.layoutPanel(frameInChart, isTopPanel);

        if (this._isVisible) {
            if (this._canvas == null) {
                this._canvas = this._rootDiv.scxAppendCanvas();
                this._context = (<HTMLCanvasElement> this._canvas[0]).getContext('2d');
                //this._context.translate(0.5, 0.5);
            }

            this._canvas.scxCanvasSize(this._rootDiv.width(), this._rootDiv.height());
        } else {
            if (this._canvas != null) {
                this._canvas.remove();
                this._canvas = this._context = null;
            }
        }
    }

    /**
     * @inheritdoc
     */
    draw() {
        if (!this._isVisible)
            return;

        let context = this._context,
            dateScale = this._dateScale,
            theme = dateScale.actualTheme,
            width = this._canvas.width(),
            height = this._canvas.height(),
            yText = height - dateScale.textPadding.bottom;

        context.save();
        this._context.translate(0.5, 0.5);
        context.clearRect(0, 0, width, height);

        context.scxApplyTextTheme(theme.text);
        context.textBaseline = "bottom";

        context.beginPath();

        for (let majorTick of dateScale.calibrator.majorTicks) {
            context.moveTo(majorTick.x, 0);
            context.lineTo(majorTick.x, dateScale.majorTickMarkLength);

            context.textAlign = majorTick.textAlign as CanvasTextAlign;
            context.fillText(majorTick.text, majorTick.textX, yText);
        }
        for (let minorTick of dateScale.calibrator.minorTicks) {
            context.moveTo(minorTick.x, 0);
            context.lineTo(minorTick.x, dateScale.minorTickMarkLength);
        }

        context.scxApplyStrokeTheme(theme.line);
        context.stroke();

        context.restore();
    }
}

interface DateScalePanelState {
    dateScale: DateScale,
    cssClass: string,
    visible?: boolean
}
