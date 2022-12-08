import { __extends } from "tslib";
import { ArrowDrawingBase } from "./ArrowDrawingBase";
import { Drawing } from '../Drawing';
import { Geometry } from '../../Graphics/Geometry';
var ArrowRightDrawing = (function (_super) {
    __extends(ArrowRightDrawing, _super);
    function ArrowRightDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ArrowRightDrawing, "className", {
        get: function () {
            return 'arrowRight';
        },
        enumerable: false,
        configurable: true
    });
    ArrowRightDrawing.prototype.bounds = function () {
        var rightPoint = this.cartesianPoint(0);
        if (!rightPoint)
            return null;
        var size = this.size;
        return {
            left: rightPoint.x - size.width,
            top: Math.round(rightPoint.y - size.height / 2),
            width: size.width,
            height: size.height
        };
    };
    ArrowRightDrawing.prototype.textBounds = function () {
        var rightPoint = this.cartesianPoint(0);
        if (!rightPoint)
            return null;
        var size = this.size;
        var textWidth = this.context.measureText(this.text).width;
        return {
            left: rightPoint.x - textWidth * 2 - size.width,
            top: rightPoint.y,
            width: textWidth * 2,
            height: size.height / 2
        };
    };
    ArrowRightDrawing.prototype.hitTest = function (point) {
        if (this.text != ' ') {
            return Geometry.isPointInsideOrNearRect(point, this.textBounds()) || Geometry.isPointInsideOrNearRect(point, this.bounds());
        }
        else {
            return Geometry.isPointInsideOrNearRect(point, this.bounds());
        }
    };
    ArrowRightDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var rightPoint = this.cartesianPoint(0);
        if (!rightPoint)
            return;
        var x = rightPoint.x, y = rightPoint.y, context = this.context, theme = this.getDrawingTheme(), size = this.size, width = size.width, triangleWidth = width * this.headRatio, halfHeight = size.height / 2, halfTailHeight = size.height * this.tailRatio / 2;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x - triangleWidth, y + halfHeight);
        context.lineTo(x - triangleWidth, y + halfTailHeight);
        context.lineTo(x - width, y + halfTailHeight);
        context.lineTo(x - width, y - halfTailHeight);
        context.lineTo(x - triangleWidth, y - halfTailHeight);
        context.lineTo(x - triangleWidth, y - halfHeight);
        context.closePath();
        context.scxStroke(this.getDrawingTheme());
        context.scxFill(this.getDrawingTheme().fill);
        context.scxApplyTextTheme(this.getDrawingTheme().text);
        context.fillText(this.text, x - width - 3, y + halfHeight - 3);
        if (this.selected) {
            var point = {
                x: Math.round(x - triangleWidth),
                y: y
            };
            this._drawSelectionMarkers(point);
        }
    };
    ArrowRightDrawing.prototype.onLoadState = function () {
        var theme = this._options.theme;
        theme.text.textAlign = 'right';
    };
    return ArrowRightDrawing;
}(ArrowDrawingBase));
export { ArrowRightDrawing };
Drawing.register(ArrowRightDrawing);
//# sourceMappingURL=ArrowRightDrawing.js.map