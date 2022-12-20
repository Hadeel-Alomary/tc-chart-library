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
import { ChartPoint } from '../../Graphics/ChartPoint';
import { GestureState } from '../../Gestures/Gesture';
import { ThemedDrawing } from '../ThemedDrawing';
var PolyLineDrawing = (function (_super) {
    __extends(PolyLineDrawing, _super);
    function PolyLineDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(PolyLineDrawing, "className", {
        get: function () {
            return 'polyLine';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PolyLineDrawing.prototype, "pointsNeeded", {
        get: function () {
            return Number.MAX_VALUE;
        },
        enumerable: true,
        configurable: true
    });
    PolyLineDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        var lastDrownLine = this.lastDrawnLine();
        if (points.length < 2)
            return false;
        return Geometry.isPointNearPolyline(point, points) || Geometry.isPointNearPolyline(point, [lastDrownLine.startPoint, lastDrownLine.endPoint]);
    };
    PolyLineDrawing.prototype._handleUserDrawingPoint = function (point) {
        if (this.chartPoints.length > 1) {
            var currentPoint = new ChartPoint(point).toPoint(this.projection);
            var lastPoint = this.cartesianPoint(this.chartPoints.length - 1);
            if (Geometry.isPointNearPoint(currentPoint, lastPoint)) {
                this._finishUserDrawing();
                return true;
            }
            if (Geometry.isPointNearPoint(currentPoint, this.cartesianPoints()[0])) {
                this.closeTheShape = true;
                this._finishUserDrawing();
                return true;
            }
        }
        this.appendChartPoint(point);
        return true;
    };
    PolyLineDrawing.prototype._handlePanGesture = function (gesture, event) {
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
                    points = this.chartPoints;
                    this.chartPoints[this._dragPoint].moveToPoint(magnetChartPoint, this.projection);
                    if (Geometry.isPointNearPoint(this.cartesianPoints()[this.cartesianPoints().length - 1], this.cartesianPoints()[0])) {
                        this.closeTheShape = true;
                    }
                    return true;
                }
                break;
        }
        return false;
    };
    PolyLineDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints();
        if (points.length > 1) {
            this.context.beginPath();
            this.context.moveTo(points[0].x, points[0].y);
            for (var i = 1; i < points.length; i++) {
                this.context.lineTo(points[i].x, points[i].y);
            }
            this.context.scxStroke(this.getDrawingTheme().line);
            if (this.closeTheShape) {
                this.context.lineTo(points[0].x, points[0].y);
                this.context.scxFillStroke(this.getDrawingTheme().fill, this.getDrawingTheme().line);
            }
        }
        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    };
    PolyLineDrawing.prototype.lastDrawnLine = function () {
        var points = this.cartesianPoints();
        return {
            startPoint: points[0],
            endPoint: points[points.length - 1]
        };
    };
    PolyLineDrawing.prototype.canControlPointsBeManuallyChanged = function () {
        return false;
    };
    Object.defineProperty(PolyLineDrawing.prototype, "closeTheShape", {
        get: function () {
            if (this._options.closeTheShape == undefined)
                this._options.closeTheShape = false;
            return this._options.closeTheShape;
        },
        set: function (value) {
            this._options.closeTheShape = !!value;
        },
        enumerable: true,
        configurable: true
    });
    PolyLineDrawing.prototype.shouldDrawMarkers = function () {
        return false;
    };
    return PolyLineDrawing;
}(ThemedDrawing));
export { PolyLineDrawing };
Drawing.register(PolyLineDrawing);
//# sourceMappingURL=PolyLineDrawing.js.map