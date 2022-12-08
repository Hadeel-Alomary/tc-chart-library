import { __extends } from "tslib";
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