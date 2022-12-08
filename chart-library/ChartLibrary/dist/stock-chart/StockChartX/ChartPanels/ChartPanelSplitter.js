import { __extends } from "tslib";
import { FrameControl } from "../Controls/FrameControl";
import { ChartState } from "../Chart";
import { GestureArray } from "../Gestures/GestureArray";
import { MouseHoverGesture } from "../Gestures/MouseHoverGesture";
import { PanGesture } from "../Gestures/PanGesture";
import { GestureState } from "../Gestures/Gesture";
import { Config } from '../../../config/config';
var Class = {
    CONTAINER: 'scxPanelSplitter',
    HOVER: 'scxHover',
    MOVE: 'scxSplitterMove'
};
var ChartPanelSplitter = (function (_super) {
    __extends(ChartPanelSplitter, _super);
    function ChartPanelSplitter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._index = null;
        _this._isMoving = false;
        _this.isThemeApplied = false;
        return _this;
    }
    Object.defineProperty(ChartPanelSplitter.prototype, "topPanel", {
        get: function () {
            return this._topPanel;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelSplitter.prototype, "bottomPanel", {
        get: function () {
            return this._bottomPanel;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelSplitter.prototype, "chart", {
        get: function () {
            return this._topPanel && this._topPanel.chart;
        },
        enumerable: false,
        configurable: true
    });
    ChartPanelSplitter.getHeight = function () {
        return 1;
    };
    ChartPanelSplitter.prototype._initGestures = function () {
        if (Config.isElementBuild()) {
            return new GestureArray();
        }
        return new GestureArray([
            new MouseHoverGesture({
                handler: this._handleMouseHoverGesture,
                hoverEventEnabled: false
            }),
            new PanGesture({
                handler: this._handlePanGesture,
                horizontalMoveEnabled: false
            })
        ], this, this.hitTest);
    };
    ChartPanelSplitter.prototype._handlePanGesture = function (gesture) {
        switch (gesture.state) {
            case GestureState.STARTED:
                this._isMoving = true;
                this.chart.state = ChartState.RESIZING_PANELS;
                this._startMove();
                break;
            case GestureState.CONTINUED:
                if (this.move(gesture.moveOffset.y)) {
                    this.chart.updateSplitter(this);
                }
                break;
            case GestureState.FINISHED:
                this._isMoving = false;
                this.chart.state = ChartState.NORMAL;
                break;
        }
    };
    ChartPanelSplitter.prototype._handleMouseHoverGesture = function (gesture, event) {
        switch (gesture.state) {
            case GestureState.STARTED:
                this._startMove();
                break;
            case GestureState.FINISHED:
                this._stopMove();
                this.chart.crossHair.setPosition(event.pointerPosition, true);
                break;
        }
    };
    ChartPanelSplitter.prototype._startMove = function () {
        this.chart.rootDiv.addClass(Class.MOVE);
        this.rootDiv.addClass(Class.HOVER);
        this._applyTheme(true);
        this.chart.crossHair.hide();
    };
    ChartPanelSplitter.prototype._stopMove = function () {
        this.chart.rootDiv.removeClass(Class.MOVE);
        this.rootDiv.removeClass(Class.HOVER);
        this._applyTheme(false);
        this.chart.crossHair.show();
    };
    ChartPanelSplitter.prototype._applyTheme = function (isHovered) {
        var theme = this.chart.theme.splitter, color = isHovered ? theme.hoverFillColor : theme.fillColor;
        this.rootDiv.css('background-color', color);
        this.isThemeApplied = true;
    };
    ChartPanelSplitter.prototype.move = function (offset) {
        if (offset === 0)
            return false;
        var topPanel = this._topPanel, bottomPanel = this._bottomPanel, chart = topPanel.chart, topPanelNewHeight = topPanel.frame.height + offset, panelsHeight = chart.chartPanelsContainer.getTotalPanelsHeight(), topPanelNewRatio = topPanelNewHeight / panelsHeight, ratioDiff = topPanel.heightRatio - topPanelNewRatio, bottomPanelNewRatio = bottomPanel.heightRatio + ratioDiff;
        if (topPanelNewRatio < topPanel.minHeightRatio ||
            topPanelNewRatio > topPanel.maxHeightRatio ||
            bottomPanelNewRatio < bottomPanel.minHeightRatio ||
            bottomPanelNewRatio > bottomPanel.maxHeightRatio)
            return false;
        topPanel.heightRatio = topPanelNewRatio;
        bottomPanel.heightRatio = bottomPanelNewRatio;
        return true;
    };
    ChartPanelSplitter.prototype.hitTest = function (point) {
        return this._isMoving
            ? true
            : _super.prototype.hitTest.call(this, point);
    };
    ChartPanelSplitter.prototype._createRootDiv = function () {
        var parentDiv = this.chart.chartPanelsContainer.rootDiv;
        return parentDiv.scxAppend('div', Class.CONTAINER);
    };
    ChartPanelSplitter.prototype.layout = function (frame) {
        _super.prototype.layout.call(this, frame);
        this.frame.top += this._topPanel.chartPanelsContainer.frame.top;
        if (!this.isThemeApplied)
            this._applyTheme(false);
    };
    return ChartPanelSplitter;
}(FrameControl));
export { ChartPanelSplitter };
//# sourceMappingURL=ChartPanelSplitter.js.map