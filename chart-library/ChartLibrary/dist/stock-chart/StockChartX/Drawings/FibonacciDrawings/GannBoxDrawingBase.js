import { __extends } from "tslib";
import { ChannelRequestType, ChartAccessorService } from '../../../../services';
import { ThemedDrawing } from '../ThemedDrawing';
var GannBoxDrawingBase = (function (_super) {
    __extends(GannBoxDrawingBase, _super);
    function GannBoxDrawingBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(GannBoxDrawingBase.prototype, "levels", {
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
    Object.defineProperty(GannBoxDrawingBase.prototype, "timeLevels", {
        get: function () {
            if (this._options.timeLevels == undefined) {
                return [];
            }
            return this._options.timeLevels;
        },
        set: function (value) {
            this._options.timeLevels = [];
            this._options.timeLevels = value;
        },
        enumerable: false,
        configurable: true
    });
    GannBoxDrawingBase.prototype._isLevelVisible = function (level) {
        return level.visible != null ? level.visible : true;
    };
    GannBoxDrawingBase.prototype.showSettingsDialog = function () {
        var showFiboDrawingSettingsRequest = {
            type: ChannelRequestType.FiboDrawingSettingsDialog,
            drawing: this
        };
        ChartAccessorService.instance.sendSharedChannelRequest(showFiboDrawingSettingsRequest);
    };
    return GannBoxDrawingBase;
}(ThemedDrawing));
export { GannBoxDrawingBase };
//# sourceMappingURL=GannBoxDrawingBase.js.map