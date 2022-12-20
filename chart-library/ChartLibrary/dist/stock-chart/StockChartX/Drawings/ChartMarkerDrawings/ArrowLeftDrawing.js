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
import { ArrowDrawingBase } from "./ArrowDrawingBase";
import { Drawing } from '../Drawing';
import { Geometry } from '../../Graphics/Geometry';
var ArrowLeftDrawing = (function (_super) {
    __extends(ArrowLeftDrawing, _super);
    function ArrowLeftDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ArrowLeftDrawing, "className", {
        get: function () {
            return 'arrowLeft';
        },
        enumerable: true,
        configurable: true
    });
    ArrowLeftDrawing.prototype.bounds = function () {
        var leftPoint = this.cartesianPoint(0);
        if (!leftPoint)
            return null;
        var size = this.size;
        return {
            left: leftPoint.x,
            top: Math.round(leftPoint.y - size.height / 2),
            width: size.width,
            height: size.height
        };
    };
    ArrowLeftDrawing.prototype.textBounds = function () {
        var leftPoint = this.cartesianPoint(0);
        if (!leftPoint)
            return null;
        var size = this.size;
        var textWidth = this.context.measureText(this.text).width;
        return {
            left: leftPoint.x + size.width,
            top: leftPoint.y,
            width: textWidth * 2,
            height: size.height / 2
        };
    };
    ArrowLeftDrawing.prototype.hitTest = function (point) {
        if (this.text != ' ') {
            return Geometry.isPointInsideOrNearRect(point, this.textBounds()) || Geometry.isPointInsideOrNearRect(point, this.bounds());
        }
        else {
            return Geometry.isPointInsideOrNearRect(point, this.bounds());
        }
    };
    ArrowLeftDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var leftPoint = this.cartesianPoint(0);
        if (!leftPoint)
            return;
        var x = leftPoint.x, y = leftPoint.y, context = this.context, theme = this.getDrawingTheme(), size = this.size, width = size.width, triangleWidth = width * this.headRatio, halfHeight = size.height / 2, halfTailHeight = size.height * this.tailRatio / 2;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + triangleWidth, y - halfHeight);
        context.lineTo(x + triangleWidth, y - halfTailHeight);
        context.lineTo(x + width, y - halfTailHeight);
        context.lineTo(x + width, y + halfTailHeight);
        context.lineTo(x + triangleWidth, y + halfTailHeight);
        context.lineTo(x + triangleWidth, y + halfHeight);
        context.closePath();
        context.scxStroke(this.getDrawingTheme());
        context.scxFill(this.getDrawingTheme().fill);
        context.scxApplyTextTheme(this.getDrawingTheme().text);
        context.fillText(this.text, x + width + 2, y + halfHeight - 3);
        if (this.selected) {
            var point = {
                x: Math.round(x + triangleWidth),
                y: y
            };
            this._drawSelectionMarkers(point);
        }
    };
    ArrowLeftDrawing.prototype.onLoadState = function () {
        var theme = this._options.theme;
        theme.text.textAlign = 'left';
    };
    return ArrowLeftDrawing;
}(ArrowDrawingBase));
export { ArrowLeftDrawing };
Drawing.register(ArrowLeftDrawing);
//# sourceMappingURL=ArrowLeftDrawing.js.map