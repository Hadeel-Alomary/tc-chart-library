import { __extends } from "tslib";
import { ArrowDrawingBase } from "./ArrowDrawingBase";
import { Drawing } from '../Drawing';
import { Geometry } from '../../Graphics/Geometry';
var ArrowDownDrawing = (function (_super) {
    __extends(ArrowDownDrawing, _super);
    function ArrowDownDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ArrowDownDrawing, "className", {
        get: function () {
            return 'arrowDown';
        },
        enumerable: false,
        configurable: true
    });
    ArrowDownDrawing.prototype.bounds = function () {
        var bottomPoint = this.cartesianPoint(0);
        if (!bottomPoint)
            return null;
        var size = this.size;
        return {
            left: Math.round(bottomPoint.x - size.width / 2),
            top: Math.round(bottomPoint.y - size.height),
            width: size.width,
            height: size.height
        };
    };
    ArrowDownDrawing.prototype.textBounds = function () {
        var bottomPoint = this.cartesianPoint(0);
        if (!bottomPoint)
            return null;
        var size = this.size;
        var textWidth = this.context.measureText(this.text).width;
        return {
            left: bottomPoint.x - textWidth,
            top: bottomPoint.y - (size.height) * 2,
            width: textWidth * 2,
            height: size.height
        };
    };
    ArrowDownDrawing.prototype.hitTest = function (point) {
        if (this.text != ' ') {
            return Geometry.isPointInsideOrNearRect(point, this.textBounds()) || Geometry.isPointInsideOrNearRect(point, this.bounds());
        }
        else {
            return Geometry.isPointInsideOrNearRect(point, this.bounds());
        }
    };
    ArrowDownDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var bottomPoint = this.cartesianPoint(0);
        if (!bottomPoint)
            return;
        var x = bottomPoint.x, y = bottomPoint.y, context = this.context, theme = this.getDrawingTheme(), size = this.size, halfWidth = size.width / 2, halfTailWidth = size.width * this.tailRatio / 2, height = size.height, triangleHeight = height * this.headRatio;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x - halfWidth, y - triangleHeight);
        context.lineTo(x - halfTailWidth, y - triangleHeight);
        context.lineTo(x - halfTailWidth, y - height);
        context.lineTo(x + halfTailWidth, y - height);
        context.lineTo(x + halfTailWidth, y - triangleHeight);
        context.lineTo(x + halfWidth, y - triangleHeight);
        context.closePath();
        context.scxStroke(this.getDrawingTheme());
        context.scxFill(this.getDrawingTheme().fill);
        context.scxApplyTextTheme(this.getDrawingTheme().text);
        context.fillText(this.text, x, y - 23 - triangleHeight / 2);
        if (this.selected) {
            var point = {
                x: x,
                y: Math.round(y - triangleHeight)
            };
            this._drawSelectionMarkers(point);
        }
    };
    ArrowDownDrawing.prototype.onLoadState = function () {
        var theme = this._options.theme;
        theme.text.textAlign = 'center';
    };
    return ArrowDownDrawing;
}(ArrowDrawingBase));
export { ArrowDownDrawing };
Drawing.register(ArrowDownDrawing);
//# sourceMappingURL=ArrowDownDrawing.js.map