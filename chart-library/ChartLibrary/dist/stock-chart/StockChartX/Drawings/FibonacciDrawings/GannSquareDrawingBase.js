import { __extends } from "tslib";
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