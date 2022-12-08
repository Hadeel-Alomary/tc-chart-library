import {ChartComponent, IChartComponentConfig, IChartComponentState} from "../Controls/ChartComponent";
import {MouseHoverGesture} from "../Gestures/MouseHoverGesture";
import {ClickGesture} from "../Gestures/ClickGesture";
import {PanGesture} from "../Gestures/PanGesture";
import {IRect} from "../Graphics/Rect";
import {IPoint} from "../Graphics/ChartPoint";
import {Gesture, GestureState, WindowEvent} from "../Gestures/Gesture";
import {ChartEvent} from "../Chart";
import {BrowserUtils} from '../../../utils';
import {Browser} from 'selenium-webdriver';

enum ZoomState {
    Active = 1,
    Inactive,
}

interface IZoomToolOptions {
}

export interface IZoomToolState extends IChartComponentState {
}

export interface IZoomToolConfig extends IChartComponentConfig {
}

export class ZoomTool extends ChartComponent {
    private _options: IZoomToolOptions;
    private _state: ZoomState;

    private _mouseHoverGesture: MouseHoverGesture;
    private _mouseClickGesture: ClickGesture;
    private _panGesture: PanGesture;

    private _startZoomDate: Date = null;
    private _endZoomDate: Date = null;

    private _bounds: IRect;
    private _points: IPoint[] = [];

    private _theme = {
        fillTheme: {
            fillEnabled: true,
            fillColor: 'rgba(165, 165, 165, 0.3)'
        },
        strokeTheme: {
            width: 1,
            strokeColor: 'gray',
            lineStyle: 'solid'
        }
    };

    constructor(config?: IZoomToolConfig) {
        super(config);
        this._state = ZoomState.Inactive;
        this._options = config || {};
    }

    startZooming() {
        this._getChartMainPanel().rootDiv.addClass('zoom-pointer');

        this._mouseHoverGesture = new MouseHoverGesture({
            handler: this._handleMouseHoverGesture.bind(this),
            hitTest: () => {
                return true;
            }
        });

        this._mouseClickGesture = new ClickGesture({
            handler: this._handleMouseClickGesture.bind(this),
            hitTest: () => {
                return true;
            }
        });

        this._panGesture = new PanGesture({
            handler: this._handlePanGesture.bind(this),
            hitTest: () => {
                return true;
            }
        });
    }

    handleEvent(event: WindowEvent) {
        return BrowserUtils.isMobile() ? this.handleMobileEvent(event) : this.handleDesktopEvent(event);
    }

    private handleMobileEvent(event: WindowEvent){
        if(this._panGesture && this._panGesture.handleEvent(event)) {
            return true;
        }
        return this._mouseClickGesture.handleEvent(event) ||
            this._mouseHoverGesture.handleEvent(event);
    }

    private handleDesktopEvent(event: WindowEvent) {
        if (this._mouseClickGesture.handleEvent(event)) {
            return true;
        } else if (this._mouseHoverGesture.handleEvent(event)) {
            return true;
        }
        if (this._panGesture) {
            return this._panGesture.handleEvent(event);
        }
        return false;
    }

    finishZoomingWithoutEvent() {
        //HA : this._bounds = null will prevent show rectangle without click (when apply zooming tool twice) .
        this._bounds = null;
        this._points = [];
        this._state = ZoomState.Inactive;
        this._getChartMainPanel().rootDiv.removeClass('zoom-pointer');
        this._resetGestures();
        this.chart.finishZooming();
    }

    /* override methods */

    destroy() {

    }

    draw() {
        let context = this._getChartMainPanel().context;
        let rect = this._bounds;
        let theme = this._theme;

        if (rect) {
            context.beginPath();
            context.rect(rect.left, rect.top, rect.width, rect.height);
            context.scxFillStroke(theme.fillTheme, theme.strokeTheme);
        }
    }

    loadState(state: IZoomToolState) {

    }

    saveState(): IZoomToolState {
        return null;
    }

    /* End of override methods*/

    private _getZoomRange(): { startDate: Date, endDate: Date } {
        if (this._startZoomDate > this._endZoomDate) {
            //NK Zooming from right to left
            return {startDate: this._endZoomDate, endDate: this._startZoomDate};
        }
        return {startDate: this._startZoomDate, endDate: this._endZoomDate};
    }

    private _startDrawingZoomRectangle(point: IPoint) {
        if (this._points.length == 1) {
            this._points.push({x: point.x, y: point.y});
        } else {
            this._points[1] = {x: point.x, y: point.y};
        }

        this._calculateBounds();
        this._getChartMainPanel().setNeedsUpdate(false);
    }

    private _handlePanGesture(gesture: Gesture, event: WindowEvent) {
        let panEvent = event;
        switch (gesture.state) {
            case GestureState.STARTED:
                this._state = ZoomState.Active;
                this._startZoomDate = this._getDateByX(panEvent.pointerPosition.x);
                this._points.push({x: panEvent.pointerPosition.x, y: panEvent.pointerPosition.y});
                break;
            case GestureState.CONTINUED:
                if(BrowserUtils.isMobile()) {
                    this._startDrawingZoomRectangle(event.pointerPosition);
                }
                break;
            case GestureState.FINISHED:
                this._state = ZoomState.Inactive;
                this._endZoomDate = this._getDateByX(panEvent.pointerPosition.x);

                //NK in this case we are not in pan event we click one click on chart on one position so, reset pan event and call the click event
                //we do this hack because pan and click events cannot be applied easily together
                if (this._startZoomDate == this._endZoomDate) {
                    this._panGesture = null;
                    if(BrowserUtils.isDesktop()) {
                        this._mouseClickGesture.handleEvent(panEvent);
                    }
                } else {
                    this._finishZooming();
                }
                break;
        }
    }

    private _handleMouseHoverGesture(gesture: Gesture, event: WindowEvent) {
        if (this._state == ZoomState.Inactive)
            return;
        this._startDrawingZoomRectangle(event.pointerPosition);
    }

    private _handleMouseClickGesture(gesture: Gesture, event: WindowEvent) {
        if (this._state == ZoomState.Inactive) {
            this._state = ZoomState.Active;
            this._startZoomDate = this._getDateByX(event.pointerPosition.x);
            this._points.push({x: event.pointerPosition.x, y: event.pointerPosition.y});
        } else {
            this._state = ZoomState.Inactive;
            this._endZoomDate = this._getDateByX(event.pointerPosition.x);
            this._finishZooming();
        }
    }

    private _getDateByX(x: number) {
        let record = this._getRecordByX(x);
        return this.chart.dateScale.projection.dateByRecord(record);
    }

    private _getRecordByX(x: number) {
        return this.chart.dateScale.projection.recordByX(x);
    }

    private _getChartMainPanel() {
        return this.chart.mainPanel;
    }

    private _calculateBounds() {
        let width = Math.abs(this._points[0].x - this._points[1].x);
        let height = Math.abs(this._points[0].y - this._points[1].y);

        let left = this._points[0].x < this._points[1].x ? this._points[0].x : this._points[1].x;
        let top = this._points[0].y < this._points[1].y ? this._points[0].y : this._points[1].y;

        this._bounds = {
            left: left,
            top: top,
            width: width,
            height: height
        }
    }

    private _finishZooming() {
        this.finishZoomingWithoutEvent();
        if (this._isValidZoomRange()) {
            this.chart.dateScale.zoomed = true;
            let eventValue = this._getZoomRange() as ChartZoomingEventValue;
            this.chart.fireValueChanged(ChartEvent.USER_ZOOMING_FINISHED, eventValue);
        } else {
            this.chart.setNeedsUpdate();
        }
    }


    private _isValidZoomRange() {
        let startRecord = this.chart.dateScale.projection.recordByDate(this._startZoomDate);
        let endRecord = this.chart.dateScale.projection.recordByDate(this._endZoomDate);

        return Math.abs(startRecord - endRecord) > 2;
    }

    private _resetGestures() {
        this._mouseClickGesture = null;
        this._mouseHoverGesture = null;
        this._panGesture = null;
    }
}

export interface ChartZoomingEventValue {
    startDate: Date,
    endDate: Date
}
