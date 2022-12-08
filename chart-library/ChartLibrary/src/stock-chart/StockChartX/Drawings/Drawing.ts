/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


import {ChartPanelObject, IChartPanelObjectConfig, IChartPanelObjectOptions, IChartPanelObjectState} from '../ChartPanels/ChartPanelObject';
import {ChartPoint, IChartPoint, IPoint, IPointBehavior, XPointBehavior, YPointBehavior} from '../Graphics/ChartPoint';
import {MouseHoverGesture} from '../Gestures/MouseHoverGesture';
import {ClickGesture} from '../Gestures/ClickGesture';
import {GestureArray} from '../Gestures/GestureArray';
import {DrawingContextMenu} from '../../StockChartX.UI/DrawingContextMenu';
import {ValueScale} from '../Scales/ValueScale';
import {DoubleClickGesture} from '../Gestures/DoubleClickGesture';
import {ContextMenuGesture} from '../Gestures/ContextMenuGesture';
import {PanGesture} from '../Gestures/PanGesture';
import {Gesture, GestureState, WindowEvent} from '../Gestures/Gesture';
import {IRect} from '../Graphics/Rect';
import {DrawingsDefaultSettings} from './DrawingsDefaultSettings';
import {JsUtil} from '../Utils/JsUtil';
import {ChartPanel} from '../ChartPanels/ChartPanel';
import {ICloneable} from '../Data/ICloneable';
import {ClassRegistrar, IConstructor} from '../Utils/ClassRegistrar';
import {ChannelRequestType, ChartAccessorService, ChartTooltipType} from '../../../services/index';
import {BrowserUtils, StringUtils, Tc} from '../../../utils';
import {ShowDrawingSettingsDialogRequest} from '../../../services/shared-channel/channel-request';
import {ConfirmationCaller, ConfirmationRequest} from '../../../components/modals/popup';
import {DrawingTheme, LevelThemeElement, LineThemeElement} from './DrawingThemeTypes';
import {Config} from '../../../config/config';
import {Theme, ThemeUtils} from '../Theme';
import {DrawingMarkers} from './DrawingMarkers';
import {Chart} from '../Chart';
import {HtmlUtil} from '../../StockChartX/Utils/HtmlUtil';
import {DrawingLevelsFormatType} from './DrawingLevelsFormatType';
import {ThemeType} from '../ThemeType';
import {Geometry} from '../../StockChartX/Graphics/Geometry';

const cloneDeep = require('lodash/cloneDeep');


export interface IDrawingConfig extends IChartPanelObjectConfig {
    id?: string;
    points?: IPoint[];
    locked?: boolean;
    resizable?: boolean;
    selectable?: boolean;
    theme?: unknown;
    createPointBehavior: IPointBehavior;
}

export interface IDrawingOptions extends IChartPanelObjectOptions {
    id: string;
    points: ChartPoint[];
    locked: boolean;
    resizable: boolean;
    selectable: boolean;
    theme: DrawingTheme;
    createPointBehavior: IPointBehavior;
}

export interface IDrawingState extends IChartPanelObjectState {
    className: string;
}

export interface IDrawingDefaults {
    createPointBehavior?: IPointBehavior;
    visible?: boolean;
    selectable?: boolean;
    locked?: boolean;
    resizable?: boolean;
}

export namespace DrawingEvent {
    export const PANEL_CHANGED = 'drawingPanelChanged';
    export const VALUE_SCALE_CHANGED = 'drawingValueScaleChanged';
    export const VISIBLE_CHANGED = 'drawingVisibleChanged';
    export const POINTS_CHANGED = 'drawingPointsChanged';
    export const LOCKED_CHANGED = 'drawingLockedChanged';
    export const RESIZABLE_CHANGED = 'drawingResizableChanged';
    export const SELECTABLE_CHANGED = 'drawingSelectableChanged';
    export const SELECTED_CHANGED = 'drawingSelectedChanged';
    export const THEME_CHANGED = 'drawingThemeChanged';
    export const DRAG_STARTED = 'chartUserDrawingDragStarted';
    export const DRAG_FINISHED = 'chartUserDrawingDragFinished';
    export const DOUBLE_CLICK = 'chartDrawingDoubleClick';
    export const CONTEXT_MENU = 'chartDrawingContextMenu';
}

export interface IDrawingLevel {
    value: number;
    visible?: boolean;
    theme?: LevelThemeElement;
}

export const DrawingDragPoint: {[key:string]:null | number} = {
    NONE: null,
    ALL: -1,
    MOVE_POINT1: 1,
    MOVE_POINT2: 2
};

class DrawingRegistrar {
    private static _drawings = new ClassRegistrar<Drawing>();

    /**
     * Gets object with information about registered drawings. Key is class name and value is drawing's constructor.
     * @name registeredDrawings.
     * @type {Object}
     * @memberOf Drawing
     */
    static get registeredDrawings(): Object {
        return this._drawings.registeredItems;
    }

    /**
     * Registers new drawing.
     * @method register
     * @param {Function} type The constructor.
     * @memberOf Drawing
     */
    static register(type: typeof Drawing) {
        this._drawings.register(type.className, <IConstructor<Drawing>> (type as unknown));
    }

    /**
     * Deserializes drawing.
     * @method deserialize
     * @param {string|Object} state The drawing's state.
     * @returns {Drawing}
     * @memberOf Drawing
     */
    static deserialize(chart:Chart, state: string | IDrawingState): Drawing {
        if (!state)
            return null;

        if (typeof state === 'string')
            state = JSON.parse(<string>state);
        let drawing = this._drawings.createChartBasedInstance((<IDrawingState>state).className, chart);
        drawing.loadState(<IDrawingState>state);

        return drawing;
    }
}

/**
 * Represents abstract chart drawing.
 * @param {object} [config] The configuration object.
 * @param {Point | Point[] | ChartPoint | ChartPoint[]} [config.points] The point(s).
 * @param {Point | ChartPoint} [config.point] The point.
 * @param {boolean} [config.visible] The flag that indicates whether drawing is visible.
 * @param {boolean} [config.selectable] The flag that indicates whether drawing can be selected.
 * @param {boolean} [config.locked] The flag that indicates whether drawing is locked.
 * @param {boolean} [config.resizable] The flag that indicates whether drawing is resizable.
 * @param {object} [config.theme] The theme.
 * @constructor Drawing
 * @abstract
 */
export abstract class Drawing extends ChartPanelObject implements ICloneable<Drawing>, ConfirmationCaller {
    static get subClassName(): string {
        return 'abstract';
    }

    static get className(): string {
        return '';
    }

    static defaults: IDrawingDefaults = {
        visible: true,
        selectable: true,
        locked: false,
        resizable: true
    };

    // DrawingRegistrar mixin
    static registeredDrawings: Object;
    static register: (type: typeof Drawing) => void;
    static deserialize: (chart:Chart, state: IDrawingState) => Drawing;

    get className(): string {
        return (this.constructor as typeof Drawing).className;
    }

    /**
     * Gets/Sets array of chart points.
     * @name chartPoints
     * @type {ChartPoint[]}
     * @memberOf Drawing#
     */
    get chartPoints(): ChartPoint[] {
        let points = (<IDrawingOptions> this._options).points;

        return this._lastCreatePoint ? points.concat(<ChartPoint>this._lastCreatePoint) : points;
    }

    set chartPoints(value: ChartPoint[]) {
        this.setChartPoints(value);
    }

    /**
     * Gets/Sets flag that indicates whether drawing is locked.
     * @name locked
     * @type {boolean}
     * @memberOf Drawing#
     */
    get locked(): boolean {
        return (<IDrawingOptions> this._options).locked;
    }

    set locked(value: boolean) {
        this._setOption('locked', !!value, DrawingEvent.LOCKED_CHANGED);
    }

    /**
     * Gets/Sets flag that indicates whether drawing is resizable.
     * @name resizable
     * @type {boolean}
     * @memberOf Drawing#
     */
    get resizable(): boolean {
        return (<IDrawingOptions> this._options).resizable;
    }

    set resizable(value: boolean) {
        this._setOption('resizable', !!value, DrawingEvent.RESIZABLE_CHANGED);
    }

    /**
     * Gets/Sets flag that indicates whether drawing is selectable.
     * @name selectable
     * @type {boolean}
     * @memberOf Drawing#
     */
    get selectable(): boolean {
        return (<IDrawingOptions> this._options).selectable;
    }

    set selectable(value: boolean) {
        this._setOption('selectable', !!value, DrawingEvent.SELECTABLE_CHANGED);
    }

    /**
     * Gets/Sets theme.
     * @name theme
     * @type {object}
     * @memberOf Drawing#
     */
    get theme():DrawingTheme {
        return (<IDrawingOptions> this._options).theme;
    }

    set theme(value: DrawingTheme) {
        (<IDrawingOptions> this._options).theme = value;
        this.fire(DrawingEvent.THEME_CHANGED, value);
    }

    get createPointBehavior(): IPointBehavior {
        return (<IDrawingOptions> this._options).createPointBehavior;
    }

    set createPointBehavior(value: IPointBehavior) {
        (<IDrawingOptions> this._options).createPointBehavior = value;
    }

    private _selected: boolean = false;
    /**
     * Gets/Sets flag that indicates whether drawing is selected.
     * @name selected
     * @type {boolean}
     * @memberOf Drawing#
     */
    get selected(): boolean {
        return this._selected;
    }

    set selected(value: boolean) {
        value = !!value;

        let oldValue = this._selected,
            isChanged = oldValue !== value;
        if (isChanged) {
            this._selected = value;

            let chart = this.chart;
            if (chart) {
                if (value) {
                    chart.selectedObject = this;
                } else if (this === chart.selectedObject) {
                    chart.selectedObject = null;
                }
            }
            // MA only fire SELECTED_CHANGE when the drawing is complete
            if(this.pointsCompleted()) {
                this.fire(DrawingEvent.SELECTED_CHANGED, value, oldValue);
            }

        }
    }

    protected _gestures: GestureArray;
    private _createClickGesture: ClickGesture;
    private _createMoveGesture: MouseHoverGesture;
    protected _lastCreatePoint: IPoint;
    private _createPanGestureForMobile:PanGesture;
    protected _dragPoint: number = DrawingDragPoint.NONE;

    /**
     * Returns true if drawing can be selected, false otherwise.
     * @name canSelect
     * @type {boolean}
     * @readonly
     * @memberOf Drawing#
     */
    get canSelect(): boolean {
        return this.selectable;
    }

    /**
     * Returns true if drawing can be moved, false otherwise.
     * @name canMove
     * @type {boolean}
     * @readonly
     * @memberOf Drawing#
     */
    get canMove(): boolean {
        return this.selectable && !this.locked;
    }

    /**
     * Returns true if drawing can be resized, false otherwise.
     * @name canResize
     * @type {boolean}
     * @readonly
     * @memberOf Drawing#
     */
    get canResize(): boolean {
        return this.selectable && this.resizable && !this.locked;
    }

    /**
     * Returns number of required points for the drawing.
     * @name pointsNeeded
     * @type {number}
     * @readonly
     * @memberOf Drawing#
     */
    get pointsNeeded(): number {
        return 1;
    }

    private _contextMenu: DrawingContextMenu;

    get magnetRadius(): number {
        if(this.chart.magnetRatio == 0) {
            return 5;
        }
        return this.chart.magnetRatio * 25;
    }

    public get id(): string {
        return (<IDrawingOptions>this._options).id;
    }

    public set id(value: string) {
        (<IDrawingOptions>this._options).id = value;
    }

    public get hasTooltip():boolean{
        return false;
    }

    public get levels(): IDrawingLevel[] {
        return [];
    }

    private drawingMarkers:DrawingMarkers;

    constructor(chart:Chart, config?: IDrawingConfig) {
        super(chart, config);

        this.drawingMarkers = new DrawingMarkers();

        this.loadState(config);
        this._initGestures();

        this._contextMenu = new DrawingContextMenu({
            drawing: this,
            onItemSelected: (menuItem, checked) => {
                switch (menuItem.data('id')) {
                    case DrawingContextMenu.MenuItem.SETTINGS:
                        this.showSettingsDialog();
                        break;
                    case DrawingContextMenu.MenuItem.DELETE:
                        this._onDeleteDrawing();
                        break;
                    case DrawingContextMenu.MenuItem.CLONE:
                        this.duplicate();
                        break;
                    case DrawingContextMenu.MenuItem.LOCK:
                        this.locked = !this.locked;
                        break;
                    case DrawingContextMenu.MenuItem.TREND_LINE_ALERT:
                        this.addOrEditAlert();
                        break;
                }
            },
            onShow: () => {
                if(this.canAddAlerts()) {
                    $('#scxDrawingContextMenu').find('li[data-id="trend-line-alert"]').show();
                } else {
                    $('#scxDrawingContextMenu').find('li[data-id="trend-line-alert"]').hide();
                }
                let lockElement = $('#scxDrawingContextMenu').find('li[data-id="lock"]');
                if (this.locked) {
                    if (!lockElement.hasClass('activated')) {
                        lockElement.addClass('activated');
                    }
                } else {
                    if (lockElement.hasClass('activated')) {
                        lockElement.removeClass('activated');
                    }
                }
            }
        });
    }

    private _onDeleteDrawing() {
        if(this.canAddAlerts() && ChartAccessorService.instance.getAlertService().getTrendLineAlertByDrawingId(this.id)) {
            let openRequest: ConfirmationRequest =  {
                type: ChannelRequestType.Confirmation,
                messageLine: ChartAccessorService.instance.translate('حذف الرسم سيؤدي إلى حذف التنبيه المرتبط به'),
                messageLine2: ChartAccessorService.instance.translate('هل أنت متأكد من الحذف؟'),
                caller: this
            };
            ChartAccessorService.instance.sendSharedChannelRequest(openRequest);
        } else {
            this.chartPanel.deleteDrawings(this);
        }

    }

    onConfirmation(confirmed: boolean, param: unknown): void {
        if(confirmed) {
            this.chartPanel.deleteDrawings(this);
        }
    }

    protected _onChartPanelChanged(oldValue: ChartPanel) {
        this.fire(DrawingEvent.PANEL_CHANGED, this.chartPanel, oldValue);
    }

    protected _onValueScaleChanged(oldValue: ValueScale) {
        this.fire(DrawingEvent.VALUE_SCALE_CHANGED, this.valueScale, oldValue);
    }

    protected _onVisibleChanged(oldValue: boolean) {
        this.fire(DrawingEvent.VISIBLE_CHANGED, this.visible, oldValue);
    }

    setChartPoints(points: IChartPoint | IChartPoint[]) {
        let chartPoints: IChartPoint[];

        if (!points) {
            chartPoints = [];
        }
        if (points instanceof ChartPoint) {
            chartPoints = [points];
        } else if (Array.isArray(points)) {
            chartPoints = [];
            for (let point of points)
                chartPoints.push(new ChartPoint(point));
        } else {
            chartPoints = [new ChartPoint(points)];
        }

        this._setOption('points', chartPoints, DrawingEvent.POINTS_CHANGED);
    }

    private _initGestures() {
        if(Config.isElementBuild()) {
            this._gestures = new GestureArray([]); // no indicator gesture in viewer
            return;
        }
        this._gestures = new GestureArray([
            new DoubleClickGesture({
                handler: this._handleDoubleClickGesture,
                hitTest: this.hitTest
            }),
            new ClickGesture({
                handler: this._handleClickGesture,
                hitTest: this._clickGestureHitTest
            }),
            new ContextMenuGesture({
                handler: this._handleContextMenuGesture,
                hitTest: this._clickGestureHitTest
            }),
            new PanGesture({
                handler: this._handlePanGestureInternal,
                hitTest: this._panGestureHitTest
            }),
            new MouseHoverGesture({
                enterEventEnabled: true,
                hoverEventEnabled: true,
                leaveEventEnabled: true,
                handler: this._handleMouseHover,
                hitTest: this.hitTest
            })
        ], this);
    }

    private _clickGestureHitTest(point: IPoint) {
        return this.canSelect && this.hitTest(point);
    }

    protected _panGestureHitTest(point: IPoint) {
        return this.canMove && this.hitTest(point);
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // MA due to change of fixing chartPoints to be on the "actual" axis dates (and can't be on interpolated value between dates),
    // then original dragging logic is sluggish on x-translation if number of candles is too few (as in yearly chart). This is because
    // translation logic depends on concept of "offset" between every two mouse points (which is not enough when distance between every
    // two dates on the axis is usually larger than such offsets). In order to make x-translation works, we need to incorporate more
    // states by adding the following two variables to track "total" x offset from mouse and x offset of initial chart point.
    private xOffsetForInitialPoint: number;
    private xOffsetSum: number;
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private _handlePanGestureInternal(gesture: PanGesture, event: WindowEvent) {
        if (!this.canResize || !this._handlePanGesture(gesture, event)) {
            switch (gesture.state) {
                case GestureState.STARTED:
                    let chart = this.chart,
                        oldSelectedObject = chart.selectedObject;
                    this._setDragPoint(DrawingDragPoint.ALL);

                    this.xOffsetForInitialPoint = this.chartPoints[0].getX(this.projection);
                    this.xOffsetSum = 0;

                    if (oldSelectedObject !== this) {
                        chart.setNeedsUpdate();
                        return;
                    }

                    break;
                case GestureState.FINISHED:
                    this._setDragPoint(DrawingDragPoint.NONE);
                    break;
                case GestureState.CONTINUED:
                    if (this._dragPoint === DrawingDragPoint.ALL) {
                        let projection = this.projection,
                            offset = gesture.moveOffset;

                        this.xOffsetSum += offset.x;
                        let xOffsetBetweenPoints:number = this.xOffsetForInitialPoint - this.chartPoints[0].getX(projection);

                        for (let point of this.chartPoints) {
                            let xOffset = xOffsetBetweenPoints + this.xOffsetSum;
                            point.translate(xOffset, offset.y, projection);
                        }
                    }

                    break;
            }
        }

        if(gesture.state == GestureState.CONTINUED){
            this.showDrawingTooltip();
        }else{
            this.hideDrawingTooltip();
        }

        this.chartPanel.setNeedsUpdate();
    }

    private _handleClickGesture() {
        if (!this.selected && this.canSelect) {
            this.select();
            this.chart.setNeedsUpdate();
        }
    }

    protected _handleDoubleClickGesture() {

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        // MA for mobile, double click is not accurate, and therefore, the user can see the settings dialog popping up
        // while he is trying to move/resize drawing. Therefore, no need to handle double click gesture for drawings
        // on mobile.
        if(BrowserUtils.isMobile()) {
            return;
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////

        this.fire(DrawingEvent.DOUBLE_CLICK, this);

        if (this.selectable) {
            this.showSettingsDialog();
        }
    }

    protected _handleContextMenuGesture(gesture: Gesture, event: WindowEvent) {
        this.fire(DrawingEvent.CONTEXT_MENU, this);

        if (this.selectable) {
            this._contextMenu.show(event.evt);
            event.evt.stopPropagation();
            event.evt.preventDefault();
        }
    }

    protected _handleMouseHover(gesture: Gesture, event: WindowEvent) {
        switch (gesture.state) {
            case GestureState.STARTED:
            case GestureState.CONTINUED:
                this.changeCursorStyle(event);
                this.showDrawingTooltip();
                break;
            case GestureState.FINISHED:
                this.removeCursorStyleIfThereIsNoDraggedPoint();
                this.hideDrawingTooltip();
                break;
        }
    }

    private changeCursorStyle(event: WindowEvent) {
        let isPointerNearDrawingPoints = this.isPointerNearDrawingPoints(event);
        if ((this._dragPoint !== null && this._dragPoint > -1) || isPointerNearDrawingPoints) {
            this.chartPanel.rootDiv.removeClass('drawing-mouse-hover');
            this.chartPanel.rootDiv.removeClass('plot-mouse-hover');
        } else {
            this.chartPanel.rootDiv.addClass('drawing-mouse-hover');
        }
    }

    private isPointerNearDrawingPoints(event: WindowEvent): boolean {
        let points = this.cartesianPoints();
        for (let i = 0; i < points.length; i++) {
            if (Geometry.isPointNearPoint(event.pointerPosition, points[i]))
                return true;
        }
        return false;
    }

    private removeCursorStyleIfThereIsNoDraggedPoint () {
        if (this._dragPoint == DrawingDragPoint.NONE) {
            this.chartPanel.rootDiv.removeClass('drawing-mouse-hover');
        }
    }

    // noinspection JSMethodCanBeStatic, JSUnusedLocalSymbols
    protected _handleUserDrawingPoint(point: IChartPoint) {
        return false;
    }

    // noinspection JSUnusedLocalSymbols
    private _handleUserDrawingClickGesture(gesture: ClickGesture, event: WindowEvent) {
        if(BrowserUtils.isMobile())
            return;

        if (!this.chartPanel) {
            event.chartPanel.addDrawings(this);
        }

        this._handleUserDrawingClickPoint(event.pointerPosition);

        if (this.chartPoints.length >= this.pointsNeeded)
            this._finishUserDrawing();

        this.chartPanel.setNeedsUpdate();
    }

    // noinspection JSUnusedLocalSymbols
    private _handleUserDrawingMoveGesture(gesture: MouseHoverGesture, event: WindowEvent) {
        if (this.chartPoints.length > 0) {
            this._lastCreatePoint = <IPoint>this._normalizeUserDrawingPoint(event.pointerPosition);
            this.onMoveChartPointInUserDrawingState();
            this.showDrawingTooltip();
            this.chartPanel.setNeedsUpdate();
        }
    }

    private _normalizeUserDrawingPoint(point: IPoint): IChartPoint {
        let magnetPoint = this._magnetChartPointIfNeeded(point);
        return ChartPoint.convert(magnetPoint, this.createPointBehavior, this.projection);
    }

    private _handleUserDrawingPanGestureForMobile(gesture:PanGesture, event:WindowEvent){
        let eventPoint = event.pointerPosition;

        switch (gesture.state) {
            case GestureState.STARTED:
                if (!this.chartPanel) {
                    event.chartPanel.addDrawings(this);
                    this._handleUserDrawingClickPoint(eventPoint);
                }
                this.chartPanel.setNeedsUpdate();

                break;
            case GestureState.CONTINUED:
                this._lastCreatePoint = <IPoint>this._normalizeUserDrawingPoint(eventPoint);
                this.onMoveChartPointInUserDrawingState();
                this.chartPanel.setNeedsUpdate();

                break;
            case GestureState.FINISHED:
                if (this._lastCreatePoint !== null)
                  this._handleUserDrawingClickPoint(eventPoint);
                if (this.chartPoints.length >= this.pointsNeeded)
                    this._finishUserDrawing();
                this.chartPanel.setNeedsUpdate();

                break;
        }
    }

    private _handleUserDrawingClickPoint(eventPoint:IPoint){
        let point = this._normalizeUserDrawingPoint(eventPoint);
        this._lastCreatePoint = null;
        if (!this._handleUserDrawingPoint(point)) {
            this.appendChartPoint(point);
            this.onAddNewChartPointInUserDrawingState();
        }
    }

    public showSettingsDialog(): void {
        let showDrawingSettingsRequest : ShowDrawingSettingsDialogRequest = {type: ChannelRequestType.DrawingSettingsDialog,drawing:this};
        ChartAccessorService.instance.sendSharedChannelRequest(showDrawingSettingsRequest);
    }

    public duplicate(): void {
        this.chart._copyDrawing(this);
        this.chart._pasteDrawing();
    }

    /**
     * Appends new chart point.
     * @method appendChartPoint
     * @param {Point | ChartPoint} point The point to append.
     * @returns {ChartPoint[]} The array of drawing's points.
     * @memberOf Drawing#
     * @example
     *  var drawing = new DotDrawing();
     *  drawing.appendChartPoint({record: 10, value: 20.0});
     */
    appendChartPoint(point: IChartPoint) {
        let points = (<IDrawingOptions> this._options).points;

        points.push(new ChartPoint(point));

        return points;
    }

    /**
     * Converts chart point to cartesian point.
     * @method cartesianPoint
     * @param {number} index The index of point.
     * @returns {Point}
     * @memberOf Drawing#
     * @example
     *  var point = drawing.getCartesianPoint(0);
     *  var x = point.x;
     *  var y = point.y;
     */
    cartesianPoint(index: number): IPoint {
        let point = this.chartPoints[index];

        return point && point.toPoint(this.projection);
    }

    /**
     * Converts all chart points to cartesian points.
     * @method cartesianPoints
     * @returns {Point[]}
     * @memberOf Drawing#
     */
    cartesianPoints(): IPoint[] {
        let projection = this.projection;

        return this.chartPoints.map(item => item.toPoint(projection));
    }

    /**
     * Makes drawing selected.
     * @method select
     * @memberOf Drawing#
     */
    select() {
        if (!this.selected && this.canSelect)
            this.chart.selectObject(this);
    }

    /**
     * Translates drawing onto a given distance.
     * @method translate
     * @param {number} dx The X offset.
     * @param {number} dy The Y offset.
     * @memberOf Drawing#
     * @example
     *  drawing.translate(5, 5);
     */
    translate(dx: number, dy: number) {
        let projection = this.projection;

        for (let chartPoint of this.chartPoints) {
            chartPoint.translate(dx, dy, projection);
        }
    }

    /**
     * Returns bounds rectangle.
     * @method bounds
     * @returns {Rect}
     * @memberOf Drawing#
     */
    bounds(): IRect {
        return null;
    }

    startUserDrawing() {

        if(BrowserUtils.isMobile()){
            this._createPanGestureForMobile = new PanGesture({
                hitTest: () => {
                    return true;
                },
                handler: this._handleUserDrawingPanGestureForMobile,
                context: this
            });
        }

        this._createClickGesture = new ClickGesture({
            hitTest: () => {
                return true;
            },
            handler: this._handleUserDrawingClickGesture,
            context: this,
        });
        this._createMoveGesture = new MouseHoverGesture({
            enterEventEnabled: false,
            leaveEventEnabled: false,
            hitTest: () => {
                return true;
            },
            handler: this._handleUserDrawingMoveGesture,
            context: this,
        });

        this.chartPoints = [];
        this.selected = true;

        let panel = this.chartPanel;
        if (panel) {
            panel.deleteDrawings(this);
            panel.setNeedsUpdate();
            this.chartPanel = null;
        }
    }

    cleanGestures() {
        this._createClickGesture = null;
        this._createMoveGesture = null;
        this._createPanGestureForMobile = null;
        this._lastCreatePoint = null;
    }

    _finishUserDrawing() {
        this.cleanGestures();
        this.chart._finishUserDrawing(this);
    }

    hitTest(point: IPoint): boolean {
        return false;
    }

    handleEvent(event: WindowEvent): boolean {

        if(BrowserUtils.isMobile()) {
            if (this._createPanGestureForMobile && this._createPanGestureForMobile.handleEvent(event)) {
                return true;
            }
        }

        if (this._createClickGesture) {
            return this._createClickGesture.handleEvent(event) ||
                this._createMoveGesture.handleEvent(event);
        }

        return this._gestures.handleEvent(event);
    }

    _setDragPoint(dragPoint: number) {
        if (this._dragPoint !== dragPoint) {
            this._dragPoint = dragPoint;

            if (this._dragPoint === DrawingDragPoint.NONE)
                this.finishedDragging();
            else {
                this.fire(DrawingEvent.DRAG_STARTED);
                this.select();
            }
        }
    }

    protected finishedDragging() {
        this.fire(DrawingEvent.DRAG_FINISHED);
    }

    resetDefaultSettings() {
        this._options = DrawingsDefaultSettings.getResettedDrawingSettings(this.chart.getThemeType(), this.className, this._options as IDrawingOptions);
    }

    saveAsDefaultSettings() {
        DrawingsDefaultSettings.setDrawingDefaultSettings(this.chart.getThemeType(), this.className, this._options as IDrawingOptions);
    }

    /* Draw Box Letter  */
    // To Draw Box Letter On Any Point We Need To Determine ( the point , box letter position (top , bottom) , letter (A , B , .... ) )
    drawTextInBox(lineTheme:LineThemeElement, point: IPoint, text: string, abovePoint: boolean, fontSize:number = 13, fontFamily = 'arial'): void {
        let margin: number = 6;
        let padding: number = 4;
        let textTheme =  {fillColor:HtmlUtil.isDarkColor(lineTheme.strokeColor) ? 'white' : 'black',fontSize:fontSize,fontFamily:fontFamily,textBaseline:'middle',fontWeight:'bold'};
        this.context.scxApplyTextTheme(textTheme);
        let width = this.findWidthForBoxContainingText(text) + padding;
        let height = textTheme.fontSize + padding * 2;
        let yPosition = abovePoint ? point.y - height - margin : point.y + margin;
        this.context.scxApplyFillTheme({fillColor:lineTheme.strokeColor});
        this.context.fillRect(point.x - Math.floor(width / 2), yPosition, width, height);
        this.context.scxApplyTextTheme(textTheme);
        this.context.fillText(text, point.x - Math.floor(width / 2) + padding + 1, yPosition + Math.floor(height / 2));
    }

    /* Draw Line With Box Number  */
    // we need tow point to draw line between them and number we want to set in box
    drawLineWithBoxNumber(lineTheme:LineThemeElement, point1: IPoint, point2: IPoint, number: string): void {
        let numberTheme =  {fillColor:HtmlUtil.isDarkColor(lineTheme.strokeColor) ? 'white' : 'black',fontSize:12,fontFamily:'arial',textBaseline:'top',fontWeight:'bold'};
        this.context.scxApplyTextTheme(numberTheme);
        let width = this.findWidthForBoxContainingText(number);
        this.context.moveTo(point1.x, point1.y);
        this.context.lineTo(point2.x, point2.y);
        this.context.scxStroke({strokeColor:lineTheme.strokeColor,width:1});
        this.context.scxApplyFillTheme({fillColor:lineTheme.strokeColor});
        this.context.fillRect((point1.x + point2.x - width) / 2, (point1.y + point2.y - 18) / 2, width, parseInt('12px arial', 15));
        this.context.scxApplyTextTheme(numberTheme);
        this.context.fillText(number, ((point1.x + point2.x - width) / 2) + 3, ((point1.y + point2.y - 11) / 2));
    }

    // make box number responds to any number size
    findWidthForBoxContainingText(text: string): number {
        let metrics = this.context.measureText(text);
        return metrics.width + 6;
    }

    // Draw box number on an existing line
    drawBoxNumberOnAnExistingLine(lineTheme:LineThemeElement, point1: IPoint, point2: IPoint, number: string): void {
        let numberTheme =  {fillColor:HtmlUtil.isDarkColor(lineTheme.strokeColor) ? 'white' : 'black' , fontSize:12,fontFamily:'arial',textBaseline:'top',fontWeight:'bold'};
        this.context.scxApplyTextTheme(numberTheme);
        let width = this.findWidthForBoxContainingText(number);
        this.context.scxApplyFillTheme({fillColor:lineTheme.strokeColor});
        this.context.fillRect((point1.x + point2.x - width) / 2, (point1.y + point2.y - 18) / 2, width, parseInt('12px arial', 15));
        this.context.scxApplyTextTheme(numberTheme);
        this.context.fillText(number, ((point1.x + point2.x - width) / 2) + 3, ((point1.y + point2.y - 11) / 2));
    }

    drawBowsWithLetters(lineTheme:LineThemeElement, point: IPoint, letter: string, position: number): void {
        let textTheme =  {fillColor:lineTheme.strokeColor , fontSize:20,fontFamily:'arial',textBaseline:'top'};
        this.context.scxApplyTextTheme(textTheme);
        this.context.fillText('(' + letter + ')', point.x - 13, position);
    }

    bowsPosition(point: IPoint, initPosition: string): number {
        if (this.cartesianPoints()[2] !== undefined && this.cartesianPoints()[3] !== undefined) {
            if (this.cartesianPoints()[2].y <= this.cartesianPoints()[1].y) {
                if (initPosition == 'bottom') {
                    return point.y - 25;
                } else if (initPosition == 'top') {
                    return point.y + 3;
                } else {
                    return;
                }
            }
        }
        if (initPosition == 'bottom') {
            return point.y + 3;
        } else if (initPosition == 'top') {
            return point.y - 25;
        } else {
            return;
        }
    }


    /* Drawing tooltip */

    showDrawingTooltip():void{
        if(this.hasTooltip){
            ChartAccessorService.instance.getChartTooltipService().show(ChartTooltipType.Drawing, {
                chartPanel: this.chartPanel,
                points: this.chartPoints
            });
        }
    }

    hideDrawingTooltip():void {
        ChartAccessorService.instance.getChartTooltipService().hide(ChartTooltipType.Drawing);
    }

    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean {
        return false;
    }

    protected _drawSelectionMarkers(points: IPoint | IPoint[]) {
        if (!points)
            return;


        let marker = this.chart.selectionMarker;
        if (Array.isArray(points)) {
            for (let i = 0; i < points.length; i++) {
               let point = points[i];
               let inDrawingMode = this._lastCreatePoint != null;
               // MA point is being dragged if it is the drag point (when dragging) or the last created point (in drawing)
               let isPointBeingDragged = this._dragPoint == i || (inDrawingMode && i == points.length - 1);

                if (inDrawingMode || isPointBeingDragged) {
                    let isPointCloseToThePrice = this.isPointCloseToThePrice(point);
                    if (isPointCloseToThePrice) {
                        marker.draw(this.context , point, this.pointerPointTheme().onPriceSelectionMarker);
                    } else {
                        marker.draw(this.context , point, this.pointerPointTheme().movingSelectionMarker);
                    }
                }
                // MA if point is being dragged, then don't draw it (as drawing circle may hinder user for precise positioning of point)
               if(!isPointBeingDragged) {
                   marker.draw(this.context, point , this.pointerPointTheme().selectionMarker);
               }
            }
        } else {
            marker.draw(this.context, points , this.pointerPointTheme().selectionMarker);
        }
    }

    protected _magnetChartPointIfNeeded(point: IPoint): IPoint {
        let candlePoints: IPoint[] = this.getHoveredCandlePoints();

        let updatedPoint: IPoint = point;
        let smallestDistance: number = this.magnetRadius;

        for (let candlePoint of candlePoints) {
            let distance: number = Math.abs(point.y - candlePoint.y);
            if ( distance <= smallestDistance) {
                smallestDistance = distance;
                updatedPoint = candlePoint;
            }
        }
        return updatedPoint;
    }

    private getHoveredCandlePoints(): IPoint[] {
        let dataSeries = this.chart.barDataSeries();
        let hoveredRecord = this.chart.hoveredRecord;

        let open = <number> dataSeries.open.valueAtIndex(hoveredRecord),
            high = <number> dataSeries.high.valueAtIndex(hoveredRecord),
            low = <number> dataSeries.low.valueAtIndex(hoveredRecord),
            close = <number> dataSeries.close.valueAtIndex(hoveredRecord);

        let hoveredRecordX = this.chartPanel.projection.xByRecord(hoveredRecord);

        let openPoint =  {x: hoveredRecordX, y: this.chartPanel.projection.yByValue(open)},
            highPoint =  {x: hoveredRecordX, y: this.chartPanel.projection.yByValue(high)},
            lowPoint =  {x: hoveredRecordX, y: this.chartPanel.projection.yByValue(low)},
            closePoint =  {x: hoveredRecordX, y: this.chartPanel.projection.yByValue(close)};

        let points: IPoint[] = [openPoint, highPoint, lowPoint, closePoint];

        return points;
    }

    /**
     * @inheritdoc
     */
    saveState(): IDrawingState {
        let state = <IDrawingState> super.saveState();
        state.className = this.className;

        return state;
    }

    loadState(state: IDrawingState | IDrawingConfig) {
        state = state || <IDrawingState> {};


        let runMappingForBackwardCompatibility:boolean = false;

        if(state.options) {
            runMappingForBackwardCompatibility = true; // saved drawing, then let us do mapping for backward compatibility
        }

        super.loadState(state);
        //NK super.loadState will set this._options = state.options, i will not change the behaviour so the methods is used by other classes,
        // i will re-set the options at the line below to be combined between the default options and the state options

        this._options = $.extend({}, DrawingsDefaultSettings.getDrawingDefaultSettings(this.chart.getThemeType(), this.className), state.options);

        if(DrawingsDefaultSettings.hasCustomSettings(this.chart.getThemeType(), this.className)){
            runMappingForBackwardCompatibility = true; // "custom" default settings, so let us do mapping for backward compatibility
        }

        // MA run mapping if flagged as needed
        if(runMappingForBackwardCompatibility) {
            this.mapThemeForBackwardCompatibility(this._options as IDrawingOptions);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // MA I added this as a hook to override the loaded theme if needed. Sometimes we need to add manual changes
        // to the theme for backward compatibility when we release new changes.
        this.onLoadState();
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        let options = <IDrawingOptions>this._options,
            suppress = this.suppressEvents(true);

        if (!this.createPointBehavior) {
            this.createPointBehavior = this.getDefaultPointBehaviour();
        }

        this.chartPoints = (options && options.points);
        if (options.visible == null)
            this.visible = Drawing.defaults.visible;
        if (options.selectable == null)
            this.selectable = Drawing.defaults.selectable;
        if (options.locked == null)
            this.locked = Drawing.defaults.locked;
        if (options.resizable == null)
            this.resizable = Drawing.defaults.resizable;

        this.id = options.id ? options.id : JsUtil.guid();
        this.suppressEvents(suppress);
    }

    protected getDefaultPointBehaviour():IPointBehavior {
        return {
            x: XPointBehavior.DATE,
            y: YPointBehavior.VALUE
        };
    }

    protected onLoadState() {}

    drawSelectionMarkers() {
        if(!this.shouldDrawMarkers())
            return;

        if (!this.visible)
            return;

        let points = this.cartesianPoints();
        if (points.length >= 1 && this.selected) {
            this.drawingMarkers.drawSelectionValueMarkers(this.chart, points, this.context, this.projection, this.panelValueScale);
            this.chart.dateScale.bottomPanel.drawSelectionMarker(this.drawingMarkers, points, this.projection);
        }
    }

    protected shouldDrawMarkers(): boolean {
        return this.canControlPointsBeManuallyChanged();
    }

    clone(): Drawing {
        let state: IDrawingState = this.saveState();
        (<IDrawingOptions>state.options).id = null;//NK set the id null to create new one when loading state
        return Drawing.deserialize(this.chart, state);
    }

    // MA code to be called before deleting a drawing
    preDeleteCleanUp() {}


    // MA code to be called before removing a drawing (as in moving to another company). However, drawing
    // is still in the chart state and is not deleted
    onRemove() {}

    //NK override these methods when you want take an action while user is in the drawing state.
    protected onAddNewChartPointInUserDrawingState():void{}

    protected onMoveChartPointInUserDrawingState():void{}

    // MA whether chart points can be changed by the user through the settings of the drawing
    canControlPointsBeManuallyChanged() : boolean {
        return true;
    }

    canAddAlerts() : boolean {
        return false;
    }

    addOrEditAlert():void {
        Tc.error("drawing not support alert");
    }

    // MA whether drawing should be deleted if it has no text entered
    deleteDrawingIfNoTextExists() : boolean {
        return false;
    }

    // MA called when settings is applied to the drawing
    onApplySettings() {}


    // MA check if all points are completed
    protected pointsCompleted(): boolean {
        return this.chartPoints.length == this.pointsNeeded;
    }


    private mapThemeForBackwardCompatibility(options: IDrawingOptions) {
        if(!options.theme) {
            return;
        }

        let originalSettings = DrawingsDefaultSettings.getDrawingOriginalSettings(this.chart.getThemeType(), this.className);

        if(originalSettings.theme){
            let theme = options.theme;
            ThemeUtils.mapThemeValuesForBackwardCompatibility(theme, originalSettings.theme)
        }

    }

    protected formatLevelText(value:number , formatType:DrawingLevelsFormatType): string {
        let numberOfDigitFormat = 0;
        switch (formatType) {
            case DrawingLevelsFormatType.LEVEL:
                numberOfDigitFormat = 3;
                break;
            case DrawingLevelsFormatType.PERCENT:
                numberOfDigitFormat = 2;
                break;
            case DrawingLevelsFormatType.PRICE:
                numberOfDigitFormat = this.chart.numberOfDigitFormat;
                break;
            default:
                Tc.error("fail to find format type of drawing level" + formatType);

        }
        return StringUtils.formatMoney(value, numberOfDigitFormat);
    }

    private isPointCloseToThePrice(point: IPoint): boolean {
        let candlePoints: IPoint[] = this.getHoveredCandlePoints();

        let smallestDistance: number = this.magnetRadius;

        for (let candlePoint of candlePoints) {
            if (Math.abs(point.y - candlePoint.y) <= smallestDistance) {
                return true;
            }
        }
    }

    private pointerPointTheme() {
        return this.chart.getThemeType() == ThemeType.Light ? Theme.Light.pointerPoint : Theme.Dark.pointerPoint;
    }

}

JsUtil.applyMixins(Drawing, [DrawingRegistrar]);

