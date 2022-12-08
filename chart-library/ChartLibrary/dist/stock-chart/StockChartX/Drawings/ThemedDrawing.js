import { __extends } from "tslib";
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