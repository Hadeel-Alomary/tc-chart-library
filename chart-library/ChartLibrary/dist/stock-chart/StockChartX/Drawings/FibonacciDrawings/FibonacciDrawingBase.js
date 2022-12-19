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
import { DrawingTextVerticalPosition, DrawingTextHorizontalPosition } from "../DrawingTextPosition";
import { ChartAccessorService } from "../../../../services/index";
import { ChannelRequestType } from '../../../../services';
import { ThemedDrawing } from '../ThemedDrawing';
var FibonacciDrawingBase = (function (_super) {
    __extends(FibonacciDrawingBase, _super);
    function FibonacciDrawingBase(chart, config) {
        var _this = _super.call(this, chart, config) || this;
        _this._textOffset = 2;
        return _this;
    }
    Object.defineProperty(FibonacciDrawingBase, "subClassName", {
        get: function () {
            return 'fibonacci';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FibonacciDrawingBase.prototype, "levels", {
        get: function () {
            return this._options.levels;
        },
        set: function (value) {
            if (this.className == 'fibonacciSpeedResistanceArcs' || this.className == 'gannFan') {
                this._options.levels = [];
                this._options.levels = value;
            }
            else {
                if (value != null && !Array.isArray(value))
                    throw new TypeError('Levels must be an array of numbers.');
                for (var i = 0, count = value.length; i < count - 1; i++) {
                    for (var j = i + 1; j < count; j++) {
                        if (value[i].value > value[j].value) {
                            var tmp = value[i];
                            value[i] = value[j];
                            value[j] = tmp;
                        }
                    }
                }
                this._options.levels = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FibonacciDrawingBase.prototype, "showLevelLines", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    FibonacciDrawingBase.prototype.showSettingsDialog = function () {
        var showFiboDrawingSettingsRequest = { type: ChannelRequestType.FiboDrawingSettingsDialog, drawing: this };
        ChartAccessorService.instance.sendSharedChannelRequest(showFiboDrawingSettingsRequest);
    };
    FibonacciDrawingBase.prototype._applyTextPosition = function (theme) {
        var context = this.context, baseline, align;
        switch (theme.levelTextVerPosition) {
            case DrawingTextVerticalPosition.MIDDLE:
                baseline = 'middle';
                break;
            case DrawingTextVerticalPosition.TOP:
                baseline = 'bottom';
                break;
            case DrawingTextVerticalPosition.BOTTOM:
                baseline = 'top';
                break;
            default:
                throw new Error('Unsupported level text vertical position: ' + theme.levelTextVerPosition);
        }
        switch (theme.levelTextHorPosition) {
            case DrawingTextHorizontalPosition.CENTER:
                align = 'center';
                break;
            case DrawingTextHorizontalPosition.LEFT:
                align = 'right';
                break;
            case DrawingTextHorizontalPosition.RIGHT:
                align = 'left';
                break;
            default:
                throw new Error('Unsupported level text horizontal position: ' + theme.levelTextHorPosition);
        }
        context.textBaseline = baseline;
        context.textAlign = align;
    };
    FibonacciDrawingBase.prototype._isLevelVisible = function (level) {
        return level.visible != null ? level.visible : true;
    };
    FibonacciDrawingBase.prototype._adjustXWithTextOffset = function (theme, x) {
        switch (theme.levelTextHorPosition) {
            case DrawingTextHorizontalPosition.LEFT:
                return x - this._textOffset;
            case DrawingTextHorizontalPosition.RIGHT:
                return x + this._textOffset;
            default:
                return x;
        }
    };
    ;
    FibonacciDrawingBase.prototype._adjustYWithTextOffset = function (theme, y) {
        switch (theme.levelTextVerPosition) {
            case DrawingTextVerticalPosition.TOP:
                return y - this._textOffset;
            case DrawingTextVerticalPosition.BOTTOM:
                return y + this._textOffset;
            default:
                return y;
        }
    };
    ;
    return FibonacciDrawingBase;
}(ThemedDrawing));
export { FibonacciDrawingBase };
//# sourceMappingURL=FibonacciDrawingBase.js.map