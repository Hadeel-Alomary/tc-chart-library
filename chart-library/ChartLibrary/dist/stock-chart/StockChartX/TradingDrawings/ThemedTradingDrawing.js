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