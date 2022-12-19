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
import { Geometry } from "../../Graphics/Geometry";
import { GestureState } from '../../Gestures/Gesture';
import { ThemedDrawing } from '../ThemedDrawing';
var BandDrawing = (function (_super) {
    __extends(BandDrawing, _super);
    function BandDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BandDrawing, "className", {
        get: function () {
            return 'band';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BandDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 2;
        },
        enumerable: false,
        configurable: true
    });
    BandDrawing.prototype._markerPoints = function (points) {
        var frame = this.chartPanel.contentFrame;
        return {
            firstLineTopPoint: { x: points[0].x, y: frame.top },
            firstLineBottomPoint: { x: points[0].x, y: frame.bottom },
            secondLineTopPoint: { x: points[1].x, y: frame.top },
            secondLineBottomPoint: { x: points[1].x, y: frame.bottom }
        };
    };
    BandDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints(), markerPoints = this._markerPoints(points);
        if (points.length < this.pointsNeeded) {
            return false;
        }
        if (Geometry.isPointNearLine(point, markerPoints.firstLineTopPoint, markerPoints.firstLineBottomPoint)
            || Geometry.isPointNearLine(point, markerPoints.secondLineTopPoint, markerPoints.secondLineBottomPoint)) {
            return true;
        }
        return this.selected && Geometry.isPointNearPoint(point, points);
    };
    BandDrawing.prototype._handlePanGesture = function (gesture, event) {
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
    BandDrawing.prototype.draw = function () {
        if (!this.visible) {
            return;
        }
        var points = this.cartesianPoints();
        if (points.length === 0)
            return;
        if (points.length > 1) {
            var markerPoints = this._markerPoints(points);
            var context = this.context;
            context.beginPath();
            context.moveTo(markerPoints.firstLineTopPoint.x, markerPoints.firstLineTopPoint.y);
            context.lineTo(markerPoints.firstLineBottomPoint.x, markerPoints.firstLineBottomPoint.y);
            context.moveTo(markerPoints.secondLineTopPoint.x, markerPoints.secondLineTopPoint.y);
            context.lineTo(markerPoints.secondLineBottomPoint.x, markerPoints.secondLineBottomPoint.y);
            context.scxStroke(this.getDrawingTheme().line);
            context.scxFillPolyLine([markerPoints.secondLineBottomPoint, markerPoints.firstLineBottomPoint,
                markerPoints.firstLineTopPoint, markerPoints.secondLineTopPoint], this.getDrawingTheme().fill);
        }
        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    };
    return BandDrawing;
}(ThemedDrawing));
export { BandDrawing };
Drawing.register(BandDrawing);
//# sourceMappingURL=BandDrawing.js.map