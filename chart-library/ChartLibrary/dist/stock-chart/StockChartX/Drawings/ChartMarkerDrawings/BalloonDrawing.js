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
import { Drawing } from '../Drawing';
import { Geometry } from '../../Graphics/Geometry';
import { ChartAccessorService } from '../../../../services/chart';
import { ThemedDrawing } from '../ThemedDrawing';
export var DrawingEvent;
(function (DrawingEvent) {
    DrawingEvent.TEXT_CHANGED = 'drawingTextChanged';
})(DrawingEvent || (DrawingEvent = {}));
var BalloonDrawing = (function (_super) {
    __extends(BalloonDrawing, _super);
    function BalloonDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BalloonDrawing, "className", {
        get: function () {
            return 'balloon';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BalloonDrawing.prototype, "text", {
        get: function () {
            if (this._options.text == 'none') {
                return '';
            }
            return this._options.text || this.getDefaultText();
        },
        set: function (value) {
            value = value || '';
            this._setOption('text', value, DrawingEvent.TEXT_CHANGED);
        },
        enumerable: false,
        configurable: true
    });
    BalloonDrawing.prototype.bounds = function () {
        var point = this.cartesianPoint(0);
        if (!point)
            return null;
        var info = this.balloonInfo();
        var padding = this.padding();
        return {
            left: info.left - padding,
            top: info.top,
            width: info.width + padding,
            height: info.height
        };
    };
    BalloonDrawing.prototype.hitTest = function (point) {
        return Geometry.isPointInsideOrNearRect(point, this.bounds());
    };
    BalloonDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var point = this.cartesianPoint(0);
        if (!point)
            return;
        this.drawBalloon();
        this.drawText();
        if (this.selected) {
            this._drawSelectionMarkers(point);
        }
    };
    BalloonDrawing.prototype.getDefaultText = function () {
        return ChartAccessorService.instance.isArabic() ? 'تعليق' : 'Comment';
    };
    BalloonDrawing.prototype.drawBalloon = function () {
        var info = this.balloonInfo();
        var radius = 15;
        this.context.beginPath();
        this.context.moveTo(info.left, info.top);
        this.context.arcTo(info.left + info.width, info.top, info.left + info.width, info.top + radius, radius);
        this.context.arcTo(info.left + info.width, info.top + info.height, info.left + info.width - radius, info.top + info.height, radius);
        this.context.lineTo(info.left + 18, info.top + info.height);
        this.context.lineTo(info.left + 18, info.top + info.height + 10);
        this.context.lineTo(info.left + 8, info.top + info.height);
        this.context.arcTo(info.left - radius, info.top + info.height, info.left - radius, info.top + info.height - radius, radius);
        this.context.arcTo(info.left - radius, info.top, info.left, info.top, radius);
        if (this.getDrawingTheme().text.textBackgroundEnabled) {
            this.context.scxFill(this.getDrawingTheme().fill);
        }
        if (this.getDrawingTheme().text.textBorderEnabled) {
            this.context.scxStroke(this.getDrawingTheme().borderLine);
        }
    };
    BalloonDrawing.prototype.drawText = function () {
        var info = this.balloonInfo();
        this.context.beginPath();
        this.context.scxApplyTextTheme(this.getDrawingTheme().text);
        this.context.fillText(this.text, info.left, info.top + info.height / 2);
    };
    BalloonDrawing.prototype.padding = function () {
        return 10;
    };
    BalloonDrawing.prototype.textWidth = function () {
        var radius = 15;
        this.context.scxApplyTextTheme(this.getDrawingTheme().text);
        return this.context.measureText(this.text).width + radius;
    };
    BalloonDrawing.prototype.balloonInfo = function () {
        var point = this.cartesianPoint(0);
        var height = 30;
        return {
            left: point.x - 18,
            top: point.y - height - 10,
            width: this.textWidth(),
            height: height
        };
    };
    BalloonDrawing.prototype._finishUserDrawing = function () {
        _super.prototype._finishUserDrawing.call(this);
        this.showSettingsDialog();
    };
    return BalloonDrawing;
}(ThemedDrawing));
export { BalloonDrawing };
Drawing.register(BalloonDrawing);
//# sourceMappingURL=BalloonDrawing.js.map