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
import { ChartAlertDrawing } from './ChartAlertDrawing';
var ChartAlertCrossDrawing = (function (_super) {
    __extends(ChartAlertCrossDrawing, _super);
    function ChartAlertCrossDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChartAlertCrossDrawing.prototype._completeLinesDrawing = function () {
        this._drawTriangle();
    };
    ChartAlertCrossDrawing.prototype._drawTriangle = function () {
        var context = this.chartPanel.context, theme = this.actualTheme, textSize = theme.valueMarketText.fontSize, padding = 2, frame = this.chartPanel.contentFrame, width = 10, height = Math.round(textSize + (2 * padding)), halfHeight = Math.round(height / 2), x = Math.round(frame.right - 5), y = Math.round(this._cartesianPoint().y - halfHeight);
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x - width, y + halfHeight);
        context.lineTo(x, y + height);
        context.closePath();
        context.scxStroke(theme);
        context.scxFillStroke(theme.valueMarkerFill, theme.line);
    };
    return ChartAlertCrossDrawing;
}(ChartAlertDrawing));
export { ChartAlertCrossDrawing };
//# sourceMappingURL=ChartAlertCrossDrawing.js.map