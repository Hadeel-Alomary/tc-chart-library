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
import { Drawing, DrawingDragPoint } from '../Drawing';
import { Geometry } from '../../Graphics/Geometry';
import { GestureState } from '../../Gestures/Gesture';
import { ThemedDrawing } from '../ThemedDrawing';
var FlatTopBottomDrawing = (function (_super) {
    __extends(FlatTopBottomDrawing, _super);
    function FlatTopBottomDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(FlatTopBottomDrawing, "className", {
        get: function () {
            return 'flatTopBottom';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlatTopBottomDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 3;
        },
        enumerable: true,
        configurable: true
    });
    FlatTopBottomDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        if (points.length < this.pointsNeeded) {
            return false;
        }
        var extendedLinePoints = this.getExtendedLinePoints();
        return Geometry.isPointNearPolyline(point, extendedLinePoints) ||
            Geometry.isPointNearPolyline(point, [points[0], points[1]]) ||
            Geometry.isPointNearPolyline(point, [extendedLinePoints[0], extendedLinePoints[1]]);
    };
    FlatTopBottomDrawing.prototype._markerPoints = function () {
        var points = this.cartesianPoints();
        if (this.pointsCompleted()) {
            var extendedLinePoints = this.getExtendedLinePoints();
            return [
                { x: points[0].x, y: points[0].y },
                { x: points[1].x, y: points[1].y },
                { x: extendedLinePoints[0].x, y: extendedLinePoints[0].y },
                { x: extendedLinePoints[1].x, y: extendedLinePoints[1].y },
            ];
        }
        else {
            return points;
        }
    };
    FlatTopBottomDrawing.prototype._handlePanGesture = function (gesture, event) {
        switch (gesture.state) {
            case GestureState.STARTED:
                var points = this._markerPoints();
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
                    if (this._dragPoint >= 2) {
                        switch (this._dragPoint) {
                            case 2:
                                this.chartPoints[2].moveToPoint(magnetChartPoint, this.projection);
                                break;
                            case 3:
                                this.chartPoints[2].moveToX(magnetChartPoint.x, this.projection);
                                this.chartPoints[0].moveToX(magnetChartPoint.x, this.projection);
                                break;
                        }
                    }
                    else {
                        this.chartPoints[this._dragPoint].moveToPoint(magnetChartPoint, this.projection);
                    }
                    return true;
                }
                break;
            case GestureState.FINISHED:
                this._setDragPoint(DrawingDragPoint.NONE);
                break;
        }
    };
    FlatTopBottomDrawing.prototype.draw = function () {
        if (!this.visible) {
            return;
        }
        var points = this.cartesianPoints(), context = this.context, theme = this.getDrawingTheme();
        if (1 < points.length) {
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            context.lineTo(points[1].x, points[1].y);
            context.scxStroke(this.getDrawingTheme().line);
            if (points.length == this.pointsNeeded) {
                var extendedLinePoints = this.getExtendedLinePoints();
                context.moveTo(extendedLinePoints[0].x, extendedLinePoints[0].y);
                context.lineTo(extendedLinePoints[1].x, extendedLinePoints[1].y);
                context.scxStroke(this.getDrawingTheme().line);
                context.scxFillPolyLine([points[0], points[1], extendedLinePoints[0], extendedLinePoints[1]], this.getDrawingTheme().fill);
            }
        }
        if (this.selected) {
            this._drawSelectionMarkers(this._markerPoints());
        }
    };
    FlatTopBottomDrawing.prototype.getExtendedLinePoints = function () {
        var points = this.cartesianPoints();
        if (points[2] == null) {
            points[2] = points[1];
        }
        return [
            { x: points[1].x, y: points[2].y },
            { x: points[0].x, y: points[2].y }
        ];
    };
    FlatTopBottomDrawing.prototype.canControlPointsBeManuallyChanged = function () {
        return false;
    };
    return FlatTopBottomDrawing;
}(ThemedDrawing));
export { FlatTopBottomDrawing };
Drawing.register(FlatTopBottomDrawing);
//# sourceMappingURL=FlatTopBottomDrawing.js.map