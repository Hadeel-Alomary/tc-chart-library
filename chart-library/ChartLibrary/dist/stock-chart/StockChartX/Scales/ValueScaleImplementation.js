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
import { ChartComponent } from "../Controls/ChartComponent";
import { ValueScalePanel } from "./ValueScalePanel";
import { JsUtil } from "../Utils/JsUtil";
var Class = {
    LEFT_SCALE: "scxLeftValueScale",
    RIGHT_SCALE: "scxRightValueScale"
};
var ValueScaleImplementation = (function (_super) {
    __extends(ValueScaleImplementation, _super);
    function ValueScaleImplementation(config) {
        var _this = _super.call(this, config) || this;
        _this._options = null;
        _this._leftPanel = new ValueScalePanel({
            valueScale: _this,
            cssClass: Class.LEFT_SCALE
        });
        _this._rightPanel = new ValueScalePanel({
            valueScale: _this,
            cssClass: Class.RIGHT_SCALE
        });
        _this.loadState(config);
        return _this;
    }
    Object.defineProperty(ValueScaleImplementation.prototype, "leftPanel", {
        get: function () {
            return this._leftPanel;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ValueScaleImplementation.prototype, "rightPanel", {
        get: function () {
            return this._rightPanel;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ValueScaleImplementation.prototype, "leftPanelCssClass", {
        get: function () {
            return Class.LEFT_SCALE;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ValueScaleImplementation.prototype, "rightPanelCssClass", {
        get: function () {
            return Class.RIGHT_SCALE;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ValueScaleImplementation.prototype, "useManualWidth", {
        get: function () {
            return this._options.useManualWidth;
        },
        set: function (value) {
            this._options.useManualWidth = !!value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ValueScaleImplementation.prototype, "manualWidth", {
        get: function () {
            return this._options.width;
        },
        set: function (value) {
            if (!JsUtil.isFiniteNumber(value) || value <= 0)
                throw new Error("Width must be greater than 0.");
            this._options.width = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ValueScaleImplementation.prototype, "leftPanelVisible", {
        get: function () {
            return this._options.showLeftPanel;
        },
        set: function (value) {
            this._leftPanel.visible = this._options.showLeftPanel = !!value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ValueScaleImplementation.prototype, "rightPanelVisible", {
        get: function () {
            return this._options.showRightPanel;
        },
        set: function (value) {
            this._rightPanel.visible = this._options.showRightPanel = !!value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ValueScaleImplementation.prototype, "index", {
        get: function () {
            return this.chart.valueScales.indexOf(this);
        },
        enumerable: false,
        configurable: true
    });
    ValueScaleImplementation.prototype.saveState = function () {
        return $.extend(true, {}, this._options);
    };
    ValueScaleImplementation.prototype.loadState = function (state) {
        state = state || {};
        this._options = {};
        this.leftPanelVisible = state.showLeftPanel !== undefined ? !!state.showLeftPanel : false;
        this.rightPanelVisible = state.showRightPanel !== undefined ? !!state.showRightPanel : true;
        this.manualWidth = state.width || 100;
        this.useManualWidth = state.useManualWidth !== undefined ? !!state.useManualWidth : false;
    };
    ValueScaleImplementation.prototype.layout = function (frame) {
        var leftFrame = this._leftPanel.layout(frame, true);
        var rightFrame = this._rightPanel.layout(frame, false);
        var remainingFrame = frame.clone();
        if (leftFrame)
            remainingFrame.cropLeft(leftFrame);
        if (rightFrame)
            remainingFrame.cropRight(rightFrame);
        return remainingFrame;
    };
    ValueScaleImplementation.prototype.draw = function () {
    };
    ValueScaleImplementation.prototype.destroy = function () {
        this.leftPanel.destroy();
        this.rightPanel.destroy();
        _super.prototype.destroy.call(this);
    };
    return ValueScaleImplementation;
}(ChartComponent));
export { ValueScaleImplementation };
//# sourceMappingURL=ValueScaleImplementation.js.map