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
import { ChartPanelObject } from "../ChartPanels/ChartPanelObject";
import { XPointBehavior, YPointBehavior } from "../Graphics/ChartPoint";
import { MouseHoverGesture } from "../Gestures/MouseHoverGesture";
import { ClickGesture } from "../Gestures/ClickGesture";
import { GestureArray } from "../Gestures/GestureArray";
import { DoubleClickGesture } from "../Gestures/DoubleClickGesture";
import { PanGesture } from "../Gestures/PanGesture";
import { GestureState } from "../Gestures/Gesture";
export var TradingDrawingDragPoint = {
    NONE: null,
    ALL: -1
};
var TradingDrawing = (function (_super) {
    __extends(TradingDrawing, _super);
    function TradingDrawing(chart) {
        var _this = _super.call(this, chart, {}) || this;
        _this._dragPoint = TradingDrawingDragPoint.NONE;
        _this._initGestures();
        return _this;
    }
    Object.defineProperty(TradingDrawing, "subClassName", {
        get: function () {
            return 'abstract';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TradingDrawing, "className", {
        get: function () {
            return '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TradingDrawing.prototype, "className", {
        get: function () {
            return this.constructor.className;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TradingDrawing.prototype, "chartPoint", {
        get: function () {
            return this._chartPoint;
        },
        set: function (value) {
            this._chartPoint = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TradingDrawing.prototype, "createPointBehavior", {
        get: function () {
            return {
                x: XPointBehavior.DATE,
                y: YPointBehavior.VALUE
            };
        },
        enumerable: true,
        configurable: true
    });
    TradingDrawing.prototype.handleEvent = function (event) {
        if (this._createClickGesture) {
            return this._createClickGesture.handleEvent(event) ||
                this._createMoveGesture.handleEvent(event);
        }
        return this._gestures.handleEvent(event);
    };
    TradingDrawing.prototype.drawValueMarkers = function () {
    };
    TradingDrawing.prototype.canMove = function (point) {
        return false;
    };
    TradingDrawing.prototype._onChartPanelChanged = function (oldValue) {
    };
    TradingDrawing.prototype._onValueScaleChanged = function (oldValue) {
    };
    TradingDrawing.prototype._onVisibleChanged = function (oldValue) {
    };
    TradingDrawing.prototype._clickGestureHitTest = function (point) {
        return this.hitTest(point);
    };
    TradingDrawing.prototype._panGestureHitTest = function (point) {
        return this.canMove(point) && this.hitTest(point);
    };
    TradingDrawing.prototype._handlePanGestureInternal = function (gesture, event) {
        switch (gesture.state) {
            case GestureState.STARTED:
                this._setDragPoint(TradingDrawingDragPoint.ALL);
                this.handleDragStarted();
                break;
            case GestureState.FINISHED:
                this._setDragPoint(TradingDrawingDragPoint.NONE);
                break;
            case GestureState.CONTINUED:
                if (this._dragPoint === TradingDrawingDragPoint.ALL) {
                    var projection = this.projection, offset = gesture.moveOffset;
                    this.chartPoint.moveToPoint(event.pointerPosition, this.projection);
                }
                break;
        }
        this.chartPanel.setNeedsUpdate();
    };
    TradingDrawing.prototype._handleClickGesture = function (gesture, event) {
    };
    TradingDrawing.prototype._handleDoubleClickGesture = function () {
    };
    TradingDrawing.prototype._handleMouseHover = function (gesture, event) {
        switch (gesture.state) {
            case GestureState.STARTED:
            case GestureState.CONTINUED:
                this.chartPanel.rootDiv.addClass('trading-drawing-mouse-hover');
                break;
            case GestureState.FINISHED:
                this.chartPanel.rootDiv.removeClass('trading-drawing-mouse-hover');
                break;
        }
    };
    TradingDrawing.prototype.cartesianPoint = function () {
        var point = this.chartPoint;
        return point && point.toPoint(this.projection);
    };
    TradingDrawing.prototype.bounds = function () {
        return null;
    };
    TradingDrawing.prototype.hitTest = function (point) {
        return false;
    };
    TradingDrawing.prototype.handleDragFinished = function () {
    };
    TradingDrawing.prototype.handleDragStarted = function () { };
    TradingDrawing.prototype._initGestures = function () {
        this._gestures = new GestureArray([
            new ClickGesture({
                handler: this._handleClickGesture,
                hitTest: this._clickGestureHitTest
            }),
            new DoubleClickGesture({
                handler: this._handleDoubleClickGesture,
                hitTest: this.hitTest
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
    };
    TradingDrawing.prototype._setDragPoint = function (dragPoint) {
        if (this._dragPoint !== dragPoint) {
            this._dragPoint = dragPoint;
            if (this._dragPoint === TradingDrawingDragPoint.NONE)
                this.handleDragFinished();
        }
    };
    return TradingDrawing;
}(ChartPanelObject));
export { TradingDrawing };
//# sourceMappingURL=TradingDrawing.js.map