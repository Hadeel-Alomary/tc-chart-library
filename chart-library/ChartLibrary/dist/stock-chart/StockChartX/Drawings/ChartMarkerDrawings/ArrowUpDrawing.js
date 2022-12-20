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
import { ArrowDrawingBase } from './ArrowDrawingBase';
import { Drawing } from '../Drawing';
import { Geometry } from '../../Graphics/Geometry';
var ArrowUpDrawing = (function (_super) {
    __extends(ArrowUpDrawing, _super);
    function ArrowUpDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ArrowUpDrawing, "className", {
        get: function () {
            return 'arrowUp';
        },
        enumerable: true,
        configurable: true
    });
    ArrowUpDrawing.prototype.bounds = function () {
        var topPoint = this.cartesianPoint(0);
        if (!topPoint)
            return null;
        var size = this.size;
        return {
            left: Math.round(topPoint.x - size.width / 2),
            top: topPoint.y,
            width: size.width,
            height: size.height
        };
    };
    ArrowUpDrawing.prototype.textBounds = function () {
        var topPoint = this.cartesianPoint(0);
        if (!topPoint)
            return null;
        var size = this.size;
        var textWidth = this.context.measureText(this.text).width;
        return {
            left: topPoint.x - textWidth,
            top: topPoint.y + (size.height / 2) * 2,
            width: textWidth * 2,
            height: size.height
        };
    };
    ArrowUpDrawing.prototype.hitTest = function (point) {
        if (this.text != ' ') {
            return Geometry.isPointInsideOrNearRect(point, this.textBounds()) || Geometry.isPointInsideOrNearRect(point, this.bounds());
        }
        else {
            return Geometry.isPointInsideOrNearRect(point, this.bounds());
        }
    };
    ArrowUpDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var topPoint = this.cartesianPoint(0);
        if (!topPoint)
            return;
        var x = topPoint.x, y = topPoint.y, context = this.context, theme = this.getDrawingTheme(), size = this.size, halfWidth = size.width / 2, halfTailWidth = size.width * this.tailRatio / 2, height = size.height, triangleHeight = height * this.headRatio;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + halfWidth, y + triangleHeight);
        context.lineTo(x + halfTailWidth, y + triangleHeight);
        context.lineTo(x + halfTailWidth, y + height);
        context.lineTo(x - halfTailWidth, y + height);
        context.lineTo(x - halfTailWidth, y + triangleHeight);
        context.lineTo(x - halfWidth, y + triangleHeight);
        context.closePath();
        context.scxStroke(this.getDrawingTheme());
        context.scxFill(this.getDrawingTheme().fill);
        context.scxApplyTextTheme(this.getDrawingTheme().text);
        context.fillText(this.text, x, y + height * 2);
        if (this.selected) {
            var point = {
                x: x,
                y: Math.round(y + triangleHeight)
            };
            this._drawSelectionMarkers(point);
        }
    };
    ArrowUpDrawing.prototype.onLoadState = function () {
        var theme = this._options.theme;
        theme.text.textAlign = 'center';
    };
    return ArrowUpDrawing;
}(ArrowDrawingBase));
export { ArrowUpDrawing };
Drawing.register(ArrowUpDrawing);
//# sourceMappingURL=ArrowUpDrawing.js.map