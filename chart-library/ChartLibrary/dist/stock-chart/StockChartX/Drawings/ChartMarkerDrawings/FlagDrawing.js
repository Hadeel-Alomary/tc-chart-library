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
import { Drawing } from '../Drawing';
import { Geometry } from '../../Graphics/Geometry';
import { ThemedDrawing } from '../ThemedDrawing';
var FlagDrawing = (function (_super) {
    __extends(FlagDrawing, _super);
    function FlagDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(FlagDrawing, "className", {
        get: function () {
            return 'flag';
        },
        enumerable: true,
        configurable: true
    });
    FlagDrawing.prototype.bounds = function () {
        var point = this.cartesianPoint(0);
        if (!point)
            return null;
        var info = this.flagInfo();
        return {
            left: point.x + info.distanceBetweenFlagAndItsStaff,
            top: point.y - info.flagSize,
            width: info.distanceBetweenFlagAndItsStaff + 2 * info.height + (info.height / 2),
            height: info.flagSize
        };
    };
    FlagDrawing.prototype.hitTest = function (point) {
        return Geometry.isPointInsideOrNearRect(point, this.bounds());
    };
    FlagDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var point = this.cartesianPoint(0);
        if (!point)
            return;
        this.drawFlagStaff();
        this.drawLeftRectangle();
        this.drawFlagCrossLine();
        this.drawFlagTriangles();
        if (this.selected) {
            this._drawSelectionMarkers(point);
        }
    };
    FlagDrawing.prototype.flagInfo = function () {
        var point = this.cartesianPoint(0);
        var flagSize = 10 * (this.getDrawingTheme().width + 0.5);
        var height = flagSize / 2;
        var verticalDistanceBetweenFlagRectangles = (0.045 * flagSize);
        var distanceBetweenFlagAndItsStaff = 0.1 * flagSize;
        var x = point.x + distanceBetweenFlagAndItsStaff;
        return {
            x: x,
            flagSize: flagSize,
            height: height,
            verticalDistanceBetweenFlagRectangles: verticalDistanceBetweenFlagRectangles,
            distanceBetweenFlagAndItsStaff: distanceBetweenFlagAndItsStaff
        };
    };
    FlagDrawing.prototype.drawFlagStaff = function () {
        var point = this.cartesianPoint(0);
        var info = this.flagInfo();
        this.context.beginPath();
        this.context.scxStroke(this.getDrawingTheme());
        this.context.lineWidth = this.getDrawingTheme().width == 1 ? 1 : this.getDrawingTheme().width / 2;
        this.context.moveTo(point.x, point.y);
        this.context.lineTo(point.x, point.y - info.flagSize);
        this.context.stroke();
    };
    FlagDrawing.prototype.drawLeftRectangle = function () {
        var point = this.cartesianPoint(0);
        var info = this.flagInfo();
        this.context.beginPath();
        this.context.rect(info.x, point.y - info.flagSize, info.height, info.height);
        this.context.fillStyle = this.getDrawingTheme().fill.fillColor;
        this.context.fill();
    };
    FlagDrawing.prototype.drawFlagCrossLine = function () {
        var point = this.cartesianPoint(0);
        var info = this.flagInfo();
        this.context.beginPath();
        this.context.strokeStyle = 'rgba(255,255,255, 0.2)';
        this.context.moveTo(info.x + info.height, point.y - info.flagSize - (0.06 * info.flagSize));
        this.context.lineTo(info.x + info.height, point.y - info.flagSize + info.height);
        this.context.stroke();
    };
    FlagDrawing.prototype.drawFlagTriangles = function () {
        var point = this.cartesianPoint(0);
        var info = this.flagInfo();
        this.context.moveTo(info.x + info.height, point.y - info.flagSize + info.verticalDistanceBetweenFlagRectangles);
        this.context.lineTo(info.x + 1.98 * info.height, point.y - info.flagSize + info.verticalDistanceBetweenFlagRectangles);
        this.context.lineTo(info.x + 1.5 * info.height, point.y - info.flagSize + info.verticalDistanceBetweenFlagRectangles + (info.height / 2));
        this.context.lineTo(info.x + 1.98 * info.height, point.y - info.flagSize + info.verticalDistanceBetweenFlagRectangles + info.height);
        this.context.lineTo(info.x + info.height - info.verticalDistanceBetweenFlagRectangles, point.y - info.flagSize + info.verticalDistanceBetweenFlagRectangles + info.height);
        this.context.lineTo(info.x + info.height - info.verticalDistanceBetweenFlagRectangles, point.y - info.flagSize + info.height);
        this.context.lineTo(info.x + info.height, point.y - info.flagSize + info.height);
        this.context.fill();
    };
    return FlagDrawing;
}(ThemedDrawing));
export { FlagDrawing };
Drawing.register(FlagDrawing);
//# sourceMappingURL=FlagDrawing.js.map