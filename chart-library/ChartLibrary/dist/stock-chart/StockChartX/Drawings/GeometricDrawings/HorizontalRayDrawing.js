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
import { Drawing } from "../Drawing";
import { Geometry } from "../../Graphics/Geometry";
import { HorizontalLineDrawing } from "./HorizontalLineDrawing";
import { DummyCanvasContext } from "../../Utils/DummyCanvasContext";
import { DrawingTextHorizontalPosition } from "../DrawingTextPosition";
var HorizontalRayDrawing = (function (_super) {
    __extends(HorizontalRayDrawing, _super);
    function HorizontalRayDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(HorizontalRayDrawing, "className", {
        get: function () {
            return 'horizontalRay';
        },
        enumerable: false,
        configurable: true
    });
    HorizontalRayDrawing.prototype.bounds = function () {
        var point = this.cartesianPoint(0);
        if (!point)
            return null;
        var frame = this.chartPanel.contentFrame;
        return {
            left: point.x,
            top: point.y,
            width: frame.width - point.x,
            height: 1
        };
    };
    HorizontalRayDrawing.prototype.hitTest = function (point) {
        var p = this.cartesianPoint(0);
        return point && Geometry.isPointNearPolyline(point, [p, { x: this.chartPanel.contentFrame.right, y: p.y }]);
    };
    HorizontalRayDrawing.prototype.draw = function () {
        if (!this.visible) {
            return;
        }
        var point = this.cartesianPoint(0);
        if (!point) {
            return;
        }
        var context = this.chartPanel.context, frame = this.chartPanel.contentFrame;
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(frame.right, point.y);
        context.scxStroke(this.getDrawingTheme().line);
        if (this.selected) {
            this._drawSelectionMarkers({ x: point.x, y: point.y });
        }
        this.drawValue();
        if (this.text.length) {
            this.drawText(point);
        }
        this.drawAlertBellIfNeeded();
    };
    HorizontalRayDrawing.prototype.getTextHorizontalPosition = function (point) {
        var textTheme = { fontFamily: 'Calibri', fontSize: 12, fillColor: '#555', decoration: '' };
        var position = 0, value = this.projection.valueByY(point.y), yValue = this.chartPanel.formatValue(value), frame = this.chartPanel.contentFrame, padding = 5, yValueBoxWidth = DummyCanvasContext.measureText(yValue, textTheme).width;
        switch (this.textHorizontalPosition) {
            case DrawingTextHorizontalPosition.RIGHT:
                position = frame.right - yValueBoxWidth - (padding * 4);
                break;
            case DrawingTextHorizontalPosition.CENTER:
                position = point.x + Math.floor((this.bounds().width / 2));
                break;
            case DrawingTextHorizontalPosition.LEFT:
                position = point.x + padding;
                break;
            default:
                throw new Error("Unknown horizontal text position type: " + this.textHorizontalPosition);
        }
        return position;
    };
    HorizontalRayDrawing.prototype.getAlertIconPoint = function () {
        return this.getAlertFirstChartPoint().toPoint(this.projection);
    };
    HorizontalRayDrawing.prototype.shouldDrawMarkers = function () {
        return false;
    };
    return HorizontalRayDrawing;
}(HorizontalLineDrawing));
export { HorizontalRayDrawing };
Drawing.register(HorizontalRayDrawing);
//# sourceMappingURL=HorizontalRayDrawing.js.map