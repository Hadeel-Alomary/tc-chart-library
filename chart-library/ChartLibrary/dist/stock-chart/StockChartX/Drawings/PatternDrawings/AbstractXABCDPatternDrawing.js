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
import { DrawingDragPoint } from '../Drawing';
import { Geometry } from '../../Graphics/Geometry';
import { GestureState } from '../../Gestures/Gesture';
import { ThemedDrawing } from '../ThemedDrawing';
var AbstractXABCDPatternDrawing = (function (_super) {
    __extends(AbstractXABCDPatternDrawing, _super);
    function AbstractXABCDPatternDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(AbstractXABCDPatternDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 5;
        },
        enumerable: false,
        configurable: true
    });
    AbstractXABCDPatternDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        return this.pointsCompleted() &&
            (Geometry.isPointNearPolyline(point, points) ||
                Geometry.isPointNearPolyline(point, [points[0], points[4]]) ||
                Geometry.isPointNearPolyline(point, [points[0], points[2]]) ||
                Geometry.isPointNearPolyline(point, [points[1], points[3]]) ||
                Geometry.isPointNearPolyline(point, [points[2], points[4]]));
    };
    AbstractXABCDPatternDrawing.prototype._handlePanGesture = function (gesture, event) {
        switch (gesture.state) {
            case GestureState.STARTED:
                var points = this.cartesianPoints();
                for (var i = 0; i < points.length; i++) {
                    if (Geometry.isPointNearPoint(event.pointerPosition, points[i])) {
                        this._setDragPoint(i);
                        return true;
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
            case GestureState.FINISHED:
                if (this._dragPoint) {
                    this._setDragPoint(DrawingDragPoint.NONE);
                    return true;
                }
                break;
        }
        return false;
    };
    AbstractXABCDPatternDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints(), context = this.context, theme = this.getDrawingTheme();
        if (points.length > 1) {
            context.beginPath();
            this.context.scxStrokePolyline([points[0], points[1]], this.getDrawingTheme().line);
            this.drawTextInBox(this.getDrawingTheme().line, points[0], 'X', points[1].y > points[0].y);
            this.drawTextInBox(this.getDrawingTheme().line, points[1], 'A', points[0].y > points[1].y);
            if (points.length == this.pointsNeeded - 2 || points.length == this.pointsNeeded || points.length == this.pointsNeeded - 1) {
                this.context.scxStrokePolyline([points[1], points[2]], this.getDrawingTheme().line);
                this.context.scxStrokePolyline([points[0], points[2]], this.getDrawingTheme().line);
                this.drawTextInBox(this.getDrawingTheme().line, points[2], 'B', points[1].y > points[2].y);
                context.scxFillPolyLine([points[0], points[1], points[2]], theme.fill);
                this.drawBoxNumberOnAnExistingLine(this.getDrawingTheme().line, points[0], points[2], this.calculateRatio(1, 2, 0).toString());
            }
            if (points.length == this.pointsNeeded - 1 || points.length == this.pointsNeeded) {
                this.context.scxStrokePolyline([points[2], points[3]], this.getDrawingTheme().line);
                this.drawTextInBox(this.getDrawingTheme().line, points[3], 'C', points[2].y > points[3].y);
                this.drawLineWithBoxNumber(this.getDrawingTheme().line, points[1], points[3], this.calculateRatio(2, 3, 1).toString());
            }
            if (points.length == this.pointsNeeded) {
                this.context.scxStrokePolyline([points[3], points[4]], this.getDrawingTheme().line);
                this.context.scxStrokePolyline([points[2], points[4]], this.getDrawingTheme().line);
                this.drawLineWithBoxNumber(this.getDrawingTheme().line, points[0], points[4], this.calculatePointZeroToFourRatio().toString());
                context.scxFillPolyLine([points[2], points[3], points[4]], theme.fill);
                this.drawBoxNumberOnAnExistingLine(this.getDrawingTheme().line, points[2], points[4], this.calculateRatio(3, 4, 2).toString());
                this.drawTextInBox(this.getDrawingTheme().line, points[4], 'D', points[3].y > points[4].y);
            }
        }
        if (this.selected)
            this._drawSelectionMarkers(points);
    };
    AbstractXABCDPatternDrawing.prototype.calculateRatio = function (anglePoint, point1, point2) {
        var diff1 = this.chartPoints[anglePoint].value - this.chartPoints[point1].value;
        var diff2 = this.chartPoints[anglePoint].value - this.chartPoints[point2].value;
        return Math.roundToDecimals(Math.abs(diff1 / diff2), 3);
    };
    return AbstractXABCDPatternDrawing;
}(ThemedDrawing));
export { AbstractXABCDPatternDrawing };
//# sourceMappingURL=AbstractXABCDPatternDrawing.js.map