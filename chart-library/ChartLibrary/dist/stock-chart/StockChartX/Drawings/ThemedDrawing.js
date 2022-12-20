var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Drawing } from './Drawing';
var ThemedDrawing = (function (_super) {
    __extends(ThemedDrawing, _super);
    function ThemedDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ThemedDrawing.prototype.getDrawingTheme = function () {
        return this.chart ? this.theme : null;
    };
    ThemedDrawing.prototype.hasBorderedTextDrawingTheme = function () {
        var theme = this.getDrawingTheme();
        return theme.text != null && theme.fill != null && theme.borderLine != null;
    };
    return ThemedDrawing;
}(Drawing));
export { ThemedDrawing };
//# sourceMappingURL=ThemedDrawing.js.map