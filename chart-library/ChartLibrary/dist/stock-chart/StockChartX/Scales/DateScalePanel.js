var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { FrameControl } from "../Controls/FrameControl";
import { DateScaleScrollKind, DateScaleZoomKind } from "./DateScale";
import { ChartEvent } from "../Chart";
import { GestureArray } from "../Gestures/GestureArray";
import { DoubleClickGesture } from "../Gestures/DoubleClickGesture";
import { PanGesture } from "../Gestures/PanGesture";
import { MouseWheelGesture } from "../Gestures/MouseWheelGesture";
import { GestureState } from "../Gestures/Gesture";
import { HtmlUtil } from "../Utils/HtmlUtil";
import { Geometry } from "../Graphics/Geometry";
import { BrowserUtils } from '../../../utils';
var Class = {
    CONTAINER: "scxDateScale",
    SCROLL: "scxDateScaleScroll"
};
var DateScalePanel = (function (_super) {
    __extends(DateScalePanel, _super);
    function DateScalePanel(config) {
        var _this = _super.call(this) || this;
        _this._isVisible = true;
        if (typeof config !== 'object')
            throw new TypeError('Config must be an object.');
        _this._dateScale = config.dateScale;
        if (config.cssClass == null)
            throw new Error("'config.cssClass' is not specified.");
        _this._cssClass = config.cssClass;
        _this._isVisible = config.visible != null ? !!config.visible : true;
        _this._initGestures();
        _this.chart.on(ChartEvent.THEME_CHANGED + '.scxDateScalePanel', function () {
            _this.applyTheme();
        });
        return _this;
    }
    Object.defineProperty(DateScalePanel.prototype, "dateScale", {
        get: function () {
            return this._dateScale;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DateScalePanel.prototype, "chart", {
        get: function () {
            return this._dateScale && this._dateScale.chart;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DateScalePanel.prototype, "cssClass", {
        get: function () {
            return this._cssClass;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DateScalePanel.prototype, "visible", {
        get: function () {
            return this._isVisible;
        },
        enumerable: false,
        configurable: true
    });
    DateScalePanel.prototype._initGestures = function () {
        if (BrowserUtils.isMobile()) {
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
        }
        else {
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
    };
    DateScalePanel.prototype._handleDoubleClickGesture = function () {
        this.chart.setNeedsUpdate(true);
    };
    DateScalePanel.prototype._handlePanGesture = function (gesture, event) {
        var chart = this.chart;
        switch (gesture.state) {
            case GestureState.STARTED:
                chart.rootDiv.addClass(Class.SCROLL);
                break;
            case GestureState.FINISHED:
                chart.rootDiv.removeClass(Class.SCROLL);
                break;
            case GestureState.CONTINUED:
                var offset = gesture.moveOffset.x, isUpdated = false, autoscale = false;
                if (event.evt.which == 1) {
                    isUpdated = this._dateScale.scrollOnPixels(offset);
                    autoscale = isUpdated && this._dateScale.scrollKind == DateScaleScrollKind.AUTOSCALED;
                }
                else {
                    isUpdated = this._dateScale.zoomOnPixels(offset);
                    autoscale = isUpdated && this._dateScale.zoomKind == DateScaleZoomKind.AUTOSCALED;
                }
                if (isUpdated) {
                    chart.setNeedsUpdate(autoscale);
                }
                break;
        }
    };
    DateScalePanel.prototype._handleMouseWheel = function (gesture) {
        var zoomFactor = BrowserUtils.isMobile() ? 0.075 : 0.05;
        var frame = this.frame, pixels = zoomFactor * frame.width;
        this._dateScale._handleZoom(-gesture.delta * pixels);
    };
    DateScalePanel.prototype.drawSelectionMarker = function (drawingMarkers, points, projection) {
        this.draw();
        drawingMarkers.drawSelectionDateMarkers(this.chart, points, this._context, projection);
    };
    DateScalePanel.prototype.applyTheme = function () {
        if (!this.rootDiv)
            return;
        var theme = this._dateScale.actualTheme, border = theme.border, cssKey = this._cssClass == this._dateScale.topPanelCssClass ? 'border-bottom' : 'border-top';
        this.rootDiv.css(cssKey, border.width + 'px ' + border.lineStyle + ' ' + border.strokeColor);
    };
    DateScalePanel.prototype._getClientHeight = function () {
        var dateScale = this._dateScale;
        if (dateScale.useManualHeight)
            return dateScale.manualHeight;
        var textHeight = HtmlUtil.getFontSize(dateScale.actualTheme.text);
        return textHeight + dateScale.textPadding.bottom + dateScale.majorTickMarkLength + 1;
    };
    DateScalePanel.prototype.hitTest = function (point) {
        var frame = this.frame;
        if (BrowserUtils.isDesktop() && frame)
            return Geometry.isPointInsideOrNearRect(point, frame);
        return false;
    };
    DateScalePanel.prototype.layoutPanel = function (frameInChart, isTopPanel) {
        var div = this._rootDiv, frame = null;
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
        }
        else {
            if (div != null) {
                div.remove();
                this._rootDiv = null;
            }
        }
        return frame;
    };
    DateScalePanel.prototype.layout = function (frameInChart, isTopPanel) {
        this.layoutPanel(frameInChart, isTopPanel);
        if (this._isVisible) {
            if (this._canvas == null) {
                this._canvas = this._rootDiv.scxAppendCanvas();
                this._context = this._canvas[0].getContext('2d');
            }
            this._canvas.scxCanvasSize(this._rootDiv.width(), this._rootDiv.height());
        }
        else {
            if (this._canvas != null) {
                this._canvas.remove();
                this._canvas = this._context = null;
            }
        }
    };
    DateScalePanel.prototype.draw = function () {
        if (!this._isVisible)
            return;
        var context = this._context, dateScale = this._dateScale, theme = dateScale.actualTheme, width = this._canvas.width(), height = this._canvas.height(), yText = height - dateScale.textPadding.bottom;
        context.save();
        this._context.translate(0.5, 0.5);
        context.clearRect(0, 0, width, height);
        context.scxApplyTextTheme(theme.text);
        context.textBaseline = "bottom";
        context.beginPath();
        for (var _i = 0, _a = dateScale.calibrator.majorTicks; _i < _a.length; _i++) {
            var majorTick = _a[_i];
            context.moveTo(majorTick.x, 0);
            context.lineTo(majorTick.x, dateScale.majorTickMarkLength);
            context.textAlign = majorTick.textAlign;
            context.fillText(majorTick.text, majorTick.textX, yText);
        }
        for (var _b = 0, _c = dateScale.calibrator.minorTicks; _b < _c.length; _b++) {
            var minorTick = _c[_b];
            context.moveTo(minorTick.x, 0);
            context.lineTo(minorTick.x, dateScale.minorTickMarkLength);
        }
        context.scxApplyStrokeTheme(theme.line);
        context.stroke();
        context.restore();
    };
    return DateScalePanel;
}(FrameControl));
export { DateScalePanel };
//# sourceMappingURL=DateScalePanel.js.map