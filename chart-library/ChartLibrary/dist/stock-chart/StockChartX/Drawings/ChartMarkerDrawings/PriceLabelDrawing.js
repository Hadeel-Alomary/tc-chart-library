import { __extends } from "tslib";
import { Drawing } from "../Drawing";
import { Geometry } from '../../Graphics/Geometry';
import { ThemedDrawing } from '../ThemedDrawing';
var PriceLabelDrawing = (function (_super) {
    __extends(PriceLabelDrawing, _super);
    function PriceLabelDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(PriceLabelDrawing, "className", {
        get: function () {
            return 'priceLabel';
        },
        enumerable: false,
        configurable: true
    });
    PriceLabelDrawing.prototype.bounds = function () {
        var leftPoint = this.cartesianPoint(0);
        if (!leftPoint)
            return null;
        return {
            left: leftPoint.x + 15,
            top: leftPoint.y - 15 - this.textHeight(),
            width: this.textWidth() + 30,
            height: this.textHeight()
        };
    };
    PriceLabelDrawing.prototype.hitTest = function (point) {
        return Geometry.isPointInsideOrNearRect(point, this.bounds());
    };
    PriceLabelDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var point = this.cartesianPoint(0);
        if (!point)
            return;
        var context = this.context;
        var priceNumber = this.priceNumber();
        var height = this.textHeight();
        var width = this.textWidth();
        var y = point.y - 13;
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(point.x + 25, y);
        context.lineTo(point.x + 33 + width, y);
        context.lineTo(point.x + 33 + width, y - height);
        context.lineTo(point.x + 12, y - height);
        context.lineTo(point.x + 12, y);
        context.lineTo(point.x + 17, y);
        context.lineTo(point.x, point.y);
        if (this.getDrawingTheme().text.textBackgroundEnabled) {
            context.scxFill(this.getDrawingTheme().fill);
        }
        if (this.getDrawingTheme().text.textBorderEnabled) {
            context.scxStroke(this.getDrawingTheme().borderLine);
        }
        context.scxApplyTextTheme(this.getDrawingTheme().text);
        context.fillText(priceNumber, point.x + 23, y - (height / 2));
        if (this.selected) {
            this._drawSelectionMarkers(point);
        }
    };
    PriceLabelDrawing.prototype.priceNumber = function () {
        return Math.roundToDecimals(this.chartPoints[0].value, 3).toString();
    };
    PriceLabelDrawing.prototype.textWidth = function () {
        var priceNumber = this.priceNumber();
        this.context.scxApplyTextTheme(this.getDrawingTheme().text);
        return this.context.measureText(priceNumber).width;
    };
    PriceLabelDrawing.prototype.textHeight = function () {
        return 60 - (1.25 * (40 - this.getDrawingTheme().text.fontSize));
    };
    return PriceLabelDrawing;
}(ThemedDrawing));
export { PriceLabelDrawing };
Drawing.register(PriceLabelDrawing);
//# sourceMappingURL=PriceLabelDrawing.js.map