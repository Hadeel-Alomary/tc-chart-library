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
import { Drawing } from "../Drawing";
import { Geometry } from "../../Graphics/Geometry";
import { GestureState } from "../../Gestures/Gesture";
import { ThemedDrawing } from '../ThemedDrawing';
var AndrewsPitchforkDrawing = (function (_super) {
    __extends(AndrewsPitchforkDrawing, _super);
    function AndrewsPitchforkDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(AndrewsPitchforkDrawing, "className", {
        get: function () {
            return 'andrewsPitchfork';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AndrewsPitchforkDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 3;
        },
        enumerable: true,
        configurable: true
    });
    AndrewsPitchforkDrawing.prototype.bounds = function () {
        var points = this.cartesianPoints();
        if (points.length < this.pointsNeeded)
            return null;
        return {
            left: points[0].x,
            top: points[0].y,
            width: points[1].x - points[0].x,
            height: points[1].y - points[0].y
        };
    };
    AndrewsPitchforkDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        if (points.length < 3)
            return false;
        var point1 = points[0], point2 = points[1], point3 = points[2], x1 = point1.x, y1 = point1.y, x2 = point2.x, y2 = point2.y, x3 = point3.x, y3 = point3.y, centerX = (x3 - x2) / 2 + x2, centerY = (y3 - y2) / 2 + y2, topX = x2 - (x1 - centerX), topY = y2 - (y1 - centerY), bottomX = x3 - (x1 - centerX), bottomY = y3 - (y1 - centerY), delta = Math.sqrt(x1 * centerX + y1 * centerY), ox1 = x1 + (centerX - x1) * delta, oy1 = y1 + (centerY - y1) * delta, oPoint1 = { x: ox1, y: oy1 }, delta1 = Math.sqrt(x2 * topX + y2 * topY), ox2 = x2 + (topX - x2) * delta1, oy2 = y2 + (topY - y2) * delta1, oPoint2 = { x: ox2, y: oy2 }, delta2 = Math.sqrt(x3 * bottomX + y3 * bottomY), ox3 = x3 + (bottomX - x3) * delta2, oy3 = y3 + (bottomY - y3) * delta2, oPoint3 = { x: ox3, y: oy3 };
        return Geometry.isPointNearLine(point, point2, point3) ||
            Geometry.isPointNearLine(point, point1, oPoint1) ||
            Geometry.isPointNearLine(point, point2, oPoint2) ||
            Geometry.isPointNearLine(point, point3, oPoint3);
    };
    AndrewsPitchforkDrawing.prototype._handlePanGesture = function (gesture, event) {
        switch (gesture.state) {
            case GestureState.STARTED:
                var points = this.cartesianPoints();
                if (points.length > 1) {
                    for (var i = 0; i < points.length; i++) {
                        if (Geometry.isPointNearPoint(event.pointerPosition, points[i])) {
                            this._setDragPoint(i);
                            return true;
                        }
                    }
                }
                break;
            case GestureState.CONTINUED:
                if (this._dragPoint >= 0) {
                    var magnetChartPoint = this._magnetChartPointIfNeeded(event.pointerPosition);
                    this.chartPoints[this._dragPoint].moveToPoint(magnetChartPoint, this.projection);
                    return true;
                }
                break;
        }
        return false;
    };
    AndrewsPitchforkDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints();
        if (points.length === 0)
            return;
        var context = this.context, theme = this.getDrawingTheme();
        if (points.length > 2) {
            var x1 = points[0].x, y1 = points[0].y, x2 = points[1].x, y2 = points[1].y, x3 = points[2].x, y3 = points[2].y, centerX = (x3 - x2) / 2 + x2, centerY = (y3 - y2) / 2 + y2, topX = x2 - (x1 - centerX), topY = y2 - (y1 - centerY), bottomX = x3 - (x1 - centerX), bottomY = y3 - (y1 - centerY), delta = Math.sqrt(x1 * centerX + y1 * centerY), ox1 = x1 + (centerX - x1) * delta, oy1 = y1 + (centerY - y1) * delta, delta1 = Math.sqrt(x2 * topX + y2 * topY), ox2 = x2 + (topX - x2) * delta1, oy2 = y2 + (topY - y2) * delta1, delta2 = Math.sqrt(x3 * bottomX + y3 * bottomY), ox3 = x3 + (bottomX - x3) * delta2, oy3 = y3 + (bottomY - y3) * delta2;
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(ox1, oy1);
            context.moveTo(x2, y2);
            context.lineTo(ox2, oy2);
            context.moveTo(x3, y3);
            context.lineTo(ox3, oy3);
            context.moveTo(x2, y2);
            context.lineTo(x3, y3);
            context.scxStroke(theme.line);
        }
        else if (points.length > 1) {
            context.scxStrokePolyline(points, theme.line);
        }
        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    };
    return AndrewsPitchforkDrawing;
}(ThemedDrawing));
export { AndrewsPitchforkDrawing };
Drawing.register(AndrewsPitchforkDrawing);
//# sourceMappingURL=AndrewsPitchforkDrawing.js.map