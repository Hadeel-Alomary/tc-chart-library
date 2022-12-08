import { __extends } from "tslib";
import { TradingDrawing } from './TradingDrawing';
var ThemedTradingDrawing = (function (_super) {
    __extends(ThemedTradingDrawing, _super);
    function ThemedTradingDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ThemedTradingDrawing.prototype, "theme", {
        get: function () {
            return this._theme;
        },
        set: function (value) {
            this._theme = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThemedTradingDrawing.prototype, "actualTheme", {
        get: function () {
            return this.chart ? this.theme : null;
        },
        enumerable: false,
        configurable: true
    });
    return ThemedTradingDrawing;
}(TradingDrawing));
export { ThemedTradingDrawing };
//# sourceMappingURL=ThemedTradingDrawing.js.map