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
import { ChartAlertDrawing } from './ChartAlertDrawing';
var ChartAlertChannelDrawing = (function (_super) {
    __extends(ChartAlertChannelDrawing, _super);
    function ChartAlertChannelDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChartAlertChannelDrawing.prototype._completeLinesDrawing = function () {
        this._drawBridge();
    };
    ChartAlertChannelDrawing.prototype._getHoverCartesianPoint = function (pointerPosition) {
        return this._pointHitTest(pointerPosition, 0) ? this._cartesianPoint(0) : this._cartesianPoint(1);
    };
    ChartAlertChannelDrawing.prototype._cartesianPoints = function () {
        return [this._cartesianPoint(0), this._cartesianPoint(1)];
    };
    ChartAlertChannelDrawing.prototype._drawBridge = function () {
        var context = this.chartPanel.context, frame = this.chartPanel.contentFrame, theme = this.actualTheme;
        context.beginPath();
        context.moveTo(frame.right - 1, this._cartesianPoint(0).y);
        context.lineTo(frame.right - 1, this._cartesianPoint(1).y);
        context.scxStroke(theme.bridge);
        this._drawCorner(0);
        this._drawCorner(1);
    };
    ChartAlertChannelDrawing.prototype._drawCorner = function (index) {
        var context = this.chartPanel.context, theme = this.actualTheme, textSize = theme.valueMarketText.fontSize, padding = 2, frame = this.chartPanel.contentFrame, width = 10, height = Math.round(textSize + (2 * padding)), halfHeight = Math.round(height / 2), x = Math.round(frame.right - 1), y = Math.round(this._cartesianPoint(index).y - (index * halfHeight));
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x - width, y + (index * halfHeight));
        context.lineTo(x, y + halfHeight);
        context.closePath();
        context.scxStroke(theme);
        context.scxFillStroke(theme.valueMarkerFill, theme.bridge);
    };
    return ChartAlertChannelDrawing;
}(ChartAlertDrawing));
export { ChartAlertChannelDrawing };
//# sourceMappingURL=ChartAlertChannelDrawing.js.map