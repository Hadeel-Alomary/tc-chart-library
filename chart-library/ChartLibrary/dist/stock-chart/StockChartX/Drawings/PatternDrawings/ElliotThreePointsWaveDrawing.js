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
import { DrawingDragPoint } from '../Drawing';
import { Geometry } from '../../Graphics/Geometry';
import { GestureState } from '../../Gestures/Gesture';
import { ThemedDrawing } from '../ThemedDrawing';
var ElliottThreePointsWaveDrawing = (function (_super) {
    __extends(ElliottThreePointsWaveDrawing, _super);
    function ElliottThreePointsWaveDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ElliottThreePointsWaveDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 4;
        },
        enumerable: true,
        configurable: true
    });
    ElliottThreePointsWaveDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        return points.length > 1 && Geometry.isPointNearPolyline(point, points) ||
            Geometry.isPointNearPolyline(point, [points[0], points[2]]) ||
            Geometry.isPointNearPolyline(point, [points[1], points[3]]);
    };
    ElliottThreePointsWaveDrawing.prototype._handlePanGesture = function (gesture, event) {
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
    ElliottThreePointsWaveDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints();
        var labels = this.getLabels();
        if (points.length > 1) {
            this.context.beginPath();
            this.context.scxStrokePolyline([points[0], points[1]], this.getDrawingTheme().line);
            this.drawBowsWithLetters(this.getDrawingTheme().line, points[1], labels[1], this.bowsPosition(points[1], 'top'));
            if (points.length == this.pointsNeeded - 1 || points.length == this.pointsNeeded) {
                this.context.scxStrokePolyline([points[1], points[2]], this.getDrawingTheme().line);
                this.drawBowsWithLetters(this.getDrawingTheme().line, points[2], labels[2], this.bowsPosition(points[2], 'bottom'));
            }
            if (points.length == this.pointsNeeded) {
                this.context.scxStrokePolyline([points[2], points[3]], this.getDrawingTheme().line);
                this.drawBowsWithLetters(this.getDrawingTheme().line, points[3], labels[3], this.bowsPosition(points[3], 'top'));
            }
            this.context.scxStroke(this.getDrawingTheme().line);
        }
        if (this.selected) {
            this._drawSelectionMarkers(points);
            this.drawBowsWithLetters(this.getDrawingTheme().line, points[0], labels[0], this.bowsPosition(points[0], 'bottom'));
        }
    };
    return ElliottThreePointsWaveDrawing;
}(ThemedDrawing));
export { ElliottThreePointsWaveDrawing };
//# sourceMappingURL=ElliotThreePointsWaveDrawing.js.map