var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { ChartComponent } from "../Controls/ChartComponent";
import { MouseHoverGesture } from "../Gestures/MouseHoverGesture";
import { ClickGesture } from "../Gestures/ClickGesture";
import { PanGesture } from "../Gestures/PanGesture";
import { GestureState } from "../Gestures/Gesture";
import { ChartEvent } from "../Chart";
import { BrowserUtils } from '../../../utils';
var ZoomState;
(function (ZoomState) {
    ZoomState[ZoomState["Active"] = 1] = "Active";
    ZoomState[ZoomState["Inactive"] = 2] = "Inactive";
})(ZoomState || (ZoomState = {}));
var ZoomTool = (function (_super) {
    __extends(ZoomTool, _super);
    function ZoomTool(config) {
        var _this = _super.call(this, config) || this;
        _this._startZoomDate = null;
        _this._endZoomDate = null;
        _this._points = [];
        _this._theme = {
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
        _this._state = ZoomState.Inactive;
        _this._options = config || {};
        return _this;
    }
    ZoomTool.prototype.startZooming = function () {
        this._getChartMainPanel().rootDiv.addClass('zoom-pointer');
        this._mouseHoverGesture = new MouseHoverGesture({
            handler: this._handleMouseHoverGesture.bind(this),
            hitTest: function () {
                return true;
            }
        });
        this._mouseClickGesture = new ClickGesture({
            handler: this._handleMouseClickGesture.bind(this),
            hitTest: function () {
                return true;
            }
        });
        this._panGesture = new PanGesture({
            handler: this._handlePanGesture.bind(this),
            hitTest: function () {
                return true;
            }
        });
    };
    ZoomTool.prototype.handleEvent = function (event) {
        return BrowserUtils.isMobile() ? this.handleMobileEvent(event) : this.handleDesktopEvent(event);
    };
    ZoomTool.prototype.handleMobileEvent = function (event) {
        if (this._panGesture && this._panGesture.handleEvent(event)) {
            return true;
        }
        return this._mouseClickGesture.handleEvent(event) ||
            this._mouseHoverGesture.handleEvent(event);
    };
    ZoomTool.prototype.handleDesktopEvent = function (event) {
        if (this._mouseClickGesture.handleEvent(event)) {
            return true;
        }
        else if (this._mouseHoverGesture.handleEvent(event)) {
            return true;
        }
        if (this._panGesture) {
            return this._panGesture.handleEvent(event);
        }
        return false;
    };
    ZoomTool.prototype.finishZoomingWithoutEvent = function () {
        this._bounds = null;
        this._points = [];
        this._state = ZoomState.Inactive;
        this._getChartMainPanel().rootDiv.removeClass('zoom-pointer');
        this._resetGestures();
        this.chart.finishZooming();
    };
    ZoomTool.prototype.destroy = function () {
    };
    ZoomTool.prototype.draw = function () {
        var context = this._getChartMainPanel().context;
        var rect = this._bounds;
        var theme = this._theme;
        if (rect) {
            context.beginPath();
            context.rect(rect.left, rect.top, rect.width, rect.height);
            context.scxFillStroke(theme.fillTheme, theme.strokeTheme);
        }
    };
    ZoomTool.prototype.loadState = function (state) {
    };
    ZoomTool.prototype.saveState = function () {
        return null;
    };
    ZoomTool.prototype._getZoomRange = function () {
        if (this._startZoomDate > this._endZoomDate) {
            return { startDate: this._endZoomDate, endDate: this._startZoomDate };
        }
        return { startDate: this._startZoomDate, endDate: this._endZoomDate };
    };
    ZoomTool.prototype._startDrawingZoomRectangle = function (point) {
        if (this._points.length == 1) {
            this._points.push({ x: point.x, y: point.y });
        }
        else {
            this._points[1] = { x: point.x, y: point.y };
        }
        this._calculateBounds();
        this._getChartMainPanel().setNeedsUpdate(false);
    };
    ZoomTool.prototype._handlePanGesture = function (gesture, event) {
        var panEvent = event;
        switch (gesture.state) {
            case GestureState.STARTED:
                this._state = ZoomState.Active;
                this._startZoomDate = this._getDateByX(panEvent.pointerPosition.x);
                this._points.push({ x: panEvent.pointerPosition.x, y: panEvent.pointerPosition.y });
                break;
            case GestureState.CONTINUED:
                if (BrowserUtils.isMobile()) {
                    this._startDrawingZoomRectangle(event.pointerPosition);
                }
                break;
            case GestureState.FINISHED:
                this._state = ZoomState.Inactive;
                this._endZoomDate = this._getDateByX(panEvent.pointerPosition.x);
                if (this._startZoomDate == this._endZoomDate) {
                    this._panGesture = null;
                    if (BrowserUtils.isDesktop()) {
                        this._mouseClickGesture.handleEvent(panEvent);
                    }
                }
                else {
                    this._finishZooming();
                }
                break;
        }
    };
    ZoomTool.prototype._handleMouseHoverGesture = function (gesture, event) {
        if (this._state == ZoomState.Inactive)
            return;
        this._startDrawingZoomRectangle(event.pointerPosition);
    };
    ZoomTool.prototype._handleMouseClickGesture = function (gesture, event) {
        if (this._state == ZoomState.Inactive) {
            this._state = ZoomState.Active;
            this._startZoomDate = this._getDateByX(event.pointerPosition.x);
            this._points.push({ x: event.pointerPosition.x, y: event.pointerPosition.y });
        }
        else {
            this._state = ZoomState.Inactive;
            this._endZoomDate = this._getDateByX(event.pointerPosition.x);
            this._finishZooming();
        }
    };
    ZoomTool.prototype._getDateByX = function (x) {
        var record = this._getRecordByX(x);
        return this.chart.dateScale.projection.dateByRecord(record);
    };
    ZoomTool.prototype._getRecordByX = function (x) {
        return this.chart.dateScale.projection.recordByX(x);
    };
    ZoomTool.prototype._getChartMainPanel = function () {
        return this.chart.mainPanel;
    };
    ZoomTool.prototype._calculateBounds = function () {
        var width = Math.abs(this._points[0].x - this._points[1].x);
        var height = Math.abs(this._points[0].y - this._points[1].y);
        var left = this._points[0].x < this._points[1].x ? this._points[0].x : this._points[1].x;
        var top = this._points[0].y < this._points[1].y ? this._points[0].y : this._points[1].y;
        this._bounds = {
            left: left,
            top: top,
            width: width,
            height: height
        };
    };
    ZoomTool.prototype._finishZooming = function () {
        this.finishZoomingWithoutEvent();
        if (this._isValidZoomRange()) {
            this.chart.dateScale.zoomed = true;
            var eventValue = this._getZoomRange();
            this.chart.fireValueChanged(ChartEvent.USER_ZOOMING_FINISHED, eventValue);
        }
        else {
            this.chart.setNeedsUpdate();
        }
    };
    ZoomTool.prototype._isValidZoomRange = function () {
        var startRecord = this.chart.dateScale.projection.recordByDate(this._startZoomDate);
        var endRecord = this.chart.dateScale.projection.recordByDate(this._endZoomDate);
        return Math.abs(startRecord - endRecord) > 2;
    };
    ZoomTool.prototype._resetGestures = function () {
        this._mouseClickGesture = null;
        this._mouseHoverGesture = null;
        this._panGesture = null;
    };
    return ZoomTool;
}(ChartComponent));
export { ZoomTool };
//# sourceMappingURL=ZoomTool.js.map