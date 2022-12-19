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
import { ChannelRequestType, ChartAccessorService } from '../../../../services';
import { ThemedDrawing } from '../ThemedDrawing';
var GannSquareDrawingBase = (function (_super) {
    __extends(GannSquareDrawingBase, _super);
    function GannSquareDrawingBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(GannSquareDrawingBase.prototype, "levels", {
        get: function () {
            return this._options.levels;
        },
        set: function (value) {
            this._options.levels = [];
            this._options.levels = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GannSquareDrawingBase.prototype, "fans", {
        get: function () {
            return this._options.fans;
        },
        set: function (value) {
            this._options.fans = [];
            this._options.fans = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GannSquareDrawingBase.prototype, "arcs", {
        get: function () {
            return this._options.arcs;
        },
        set: function (value) {
            this._options.arcs = [];
            this._options.arcs = value;
        },
        enumerable: false,
        configurable: true
    });
    GannSquareDrawingBase.prototype._isLevelVisible = function (level) {
        return level.visible != null ? level.visible : true;
    };
    GannSquareDrawingBase.prototype.showSettingsDialog = function () {
        var showFiboDrawingSettingsRequest = {
            type: ChannelRequestType.FiboDrawingSettingsDialog,
            drawing: this
        };
        ChartAccessorService.instance.sendSharedChannelRequest(showFiboDrawingSettingsRequest);
    };
    return GannSquareDrawingBase;
}(ThemedDrawing));
export { GannSquareDrawingBase };
//# sourceMappingURL=GannSquareDrawingBase.js.map