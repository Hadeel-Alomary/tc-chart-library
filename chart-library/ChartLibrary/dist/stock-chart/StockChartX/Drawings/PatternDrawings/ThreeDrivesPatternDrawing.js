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
import { Drawing, DrawingDragPoint } from '../Drawing';
import { Geometry } from '../../Graphics/Geometry';
import { GestureState } from '../../Gestures/Gesture';
import { ThemedDrawing } from '../ThemedDrawing';
var ThreeDrivesPatternDrawing = (function (_super) {
    __extends(ThreeDrivesPatternDrawing, _super);
    function ThreeDrivesPatternDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ThreeDrivesPatternDrawing, "className", {
        get: function () {
            return 'threeDrivesPattern';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThreeDrivesPatternDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 7;
        },
        enumerable: false,
        configurable: true
    });
    ThreeDrivesPatternDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        return points.length > 1 && Geometry.isPointNearPolyline(point, points) ||
            Geometry.isPointNearPolyline(point, [points[1], points[3]]) ||
            Geometry.isPointNearPolyline(point, [points[3], points[5]]);
    };
    ThreeDrivesPatternDrawing.prototype._handlePanGesture = function (gesture, event) {
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
    ThreeDrivesPatternDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints();
        if (points.length > 1) {
            this.context.beginPath();
            this.context.scxStrokePolyline([points[0], points[1]], this.getDrawingTheme().line);
            var numberOfRemainingPoints = this.pointsNeeded - points.length;
            if (numberOfRemainingPoints <= 4) {
                this.context.scxStrokePolyline([points[1], points[2]], this.getDrawingTheme().line);
            }
            if (numberOfRemainingPoints <= 3) {
                this.context.scxStrokePolyline([points[2], points[3]], this.getDrawingTheme().line);
                this.drawLineWithBoxNumber(this.getDrawingTheme().line, points[1], points[3], this.calculateNumber(2, 3, 1).toString());
            }
            if (numberOfRemainingPoints <= 2) {
                this.context.scxStrokePolyline([points[3], points[4]], this.getDrawingTheme().line);
            }
            if (numberOfRemainingPoints <= 1) {
                this.context.scxStrokePolyline([points[4], points[5]], this.getDrawingTheme().line);
                this.drawLineWithBoxNumber(this.getDrawingTheme().line, points[3], points[5], this.calculateNumber(4, 5, 3).toString());
            }
            if (numberOfRemainingPoints === 0) {
                this.context.scxStrokePolyline([points[5], points[6]], this.getDrawingTheme().line);
            }
        }
        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    };
    ThreeDrivesPatternDrawing.prototype.calculateNumber = function (anglePoint, point1, point2) {
        var diff1 = this.chartPoints[anglePoint].value - this.chartPoints[point1].value;
        var diff2 = this.chartPoints[anglePoint].value - this.chartPoints[point2].value;
        return Math.roundToDecimals(Math.abs(diff1 / diff2), 3);
    };
    return ThreeDrivesPatternDrawing;
}(ThemedDrawing));
export { ThreeDrivesPatternDrawing };
Drawing.register(ThreeDrivesPatternDrawing);
//# sourceMappingURL=ThreeDrivesPatternDrawing.js.map