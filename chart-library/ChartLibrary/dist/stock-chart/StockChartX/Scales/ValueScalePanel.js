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
import { ChartEvent } from "../Chart";
var CLASS_CONTAINER = "scxValueScale";
var ValueScalePanel = (function (_super) {
    __extends(ValueScalePanel, _super);
    function ValueScalePanel(config) {
        var _this = _super.call(this) || this;
        _this._isVisible = true;
        if (!config)
            throw new Error("Config is not specified.");
        _this._valueScale = config.valueScale;
        if (!config.cssClass)
            throw new Error("'config.cssClass' is not specified.");
        _this._cssClass = config.cssClass;
        _this._isVisible = config.visible != null ? !!config.visible : true;
        _this.chart.on(ChartEvent.THEME_CHANGED + '.scxValueScalePanel', function () {
            _this.applyTheme();
        });
        return _this;
    }
    Object.defineProperty(ValueScalePanel.prototype, "valueScale", {
        get: function () {
            return this._valueScale;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ValueScalePanel.prototype, "cssClass", {
        get: function () {
            return this._cssClass;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ValueScalePanel.prototype, "visible", {
        get: function () {
            return this._isVisible;
        },
        set: function (value) {
            this._isVisible = !!value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ValueScalePanel.prototype, "chart", {
        get: function () {
            return this._valueScale && this._valueScale.chart;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ValueScalePanel.prototype, "size", {
        get: function () {
            var div = this.rootDiv;
            return div && div.scxSize();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ValueScalePanel.prototype, "contentSize", {
        get: function () {
            var div = this.rootDiv;
            return div && div.scxContentSize();
        },
        enumerable: false,
        configurable: true
    });
    ValueScalePanel.prototype.layout = function (frame, isLeftPanel) {
        var div = this.rootDiv, scaleFrame = null;
        if (this._isVisible) {
            if (!div) {
                var parentDiv = this.chart.chartPanelsContainer.rootDiv;
                this._rootDiv = div = parentDiv.scxAppend('div', CLASS_CONTAINER).addClass(this._cssClass);
                this.applyTheme();
            }
            div.width(this.getWidth()).outerHeight(frame.height);
            scaleFrame = this.frame;
            scaleFrame.width = div.outerWidth();
            scaleFrame.left = isLeftPanel ? frame.left : frame.right - scaleFrame.width;
            scaleFrame.height = frame.height;
            div.css('left', scaleFrame.left);
        }
        else {
            if (div) {
                div.remove();
                this._rootDiv = null;
            }
        }
        return scaleFrame;
    };
    ValueScalePanel.prototype.getWidth = function () {
        var valueScale = this._valueScale;
        if (valueScale.useManualWidth)
            return valueScale.manualWidth;
        var maxWidth = 0;
        for (var _i = 0, _a = this.chart.chartPanels; _i < _a.length; _i++) {
            var panel = _a[_i];
            maxWidth = Math.max(panel.getPreferredValueScaleWidth(this._valueScale), maxWidth);
        }
        return maxWidth;
    };
    ValueScalePanel.prototype.applyTheme = function () {
        if (!this.rootDiv)
            return;
        var theme = this.chart.theme.valueScale.border, cssKey = this._cssClass === this._valueScale.leftPanelCssClass ? 'border-right' : 'border-left';
        this.rootDiv.css(cssKey, theme.width + 'px ' + theme.lineStyle + ' ' + theme.strokeColor);
    };
    return ValueScalePanel;
}(FrameControl));
export { ValueScalePanel };
//# sourceMappingURL=ValueScalePanel.js.map