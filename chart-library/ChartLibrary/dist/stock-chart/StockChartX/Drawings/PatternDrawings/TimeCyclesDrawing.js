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
var TimeCyclesDrawing = (function (_super) {
    __extends(TimeCyclesDrawing, _super);
    function TimeCyclesDrawing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.inDrawingState = true;
        return _this;
    }
    Object.defineProperty(TimeCyclesDrawing, "className", {
        get: function () {
            return 'timeCycles';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TimeCyclesDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 2;
        },
        enumerable: false,
        configurable: true
    });
    TimeCyclesDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        if (points.length < 2)
            return false;
        var hoverCycleCenterPoint = this.hoverCycleCenterPoint(point);
        return Geometry.isPointNearPoint(point, points) || this.isPointNearTimeCycles(point, hoverCycleCenterPoint, this.radius());
    };
    TimeCyclesDrawing.prototype.isPointNearTimeCycles = function (point, centerPoint, radius) {
        var r1 = Geometry.length(centerPoint, point);
        var r2 = typeof radius === 'number' ? radius : Geometry.length(centerPoint, radius);
        if (point.y < centerPoint.y) {
            return Geometry.isValueNearValue(r1, r2);
        }
    };
    TimeCyclesDrawing.prototype.hoverCycleCenterPoint = function (point) {
        var points = this.cartesianPoints();
        var centerPoint = this.centerPoint();
        var x;
        var x_minPoint = Math.min(points[0].x, points[1].x);
        if (point.x > x_minPoint) {
            var numberOfPassedCycles = Math.floor(Math.abs((x_minPoint - point.x)) / Math.abs((points[1].x - points[0].x)));
            x = centerPoint.x + this.diameter() * numberOfPassedCycles;
        }
        else {
            var numberOfPassedCycles = Math.ceil(Math.abs((x_minPoint - point.x)) / Math.abs((points[1].x - points[0].x)));
            x = centerPoint.x - this.diameter() * numberOfPassedCycles;
        }
        return {
            x: x,
            y: centerPoint.y
        };
    };
    TimeCyclesDrawing.prototype._handlePanGesture = function (gesture, event) {
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
                    if (this._dragPoint == 1)
                        this.chartPoints[0].moveToY(magnetChartPoint.y, this.projection);
                    if (this._dragPoint == 0)
                        this.chartPoints[1].moveToY(magnetChartPoint.y, this.projection);
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
    TimeCyclesDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints();
        if (points.length > 1) {
            this.drawCycles();
        }
        if (this.selected) {
            this._drawSelectionMarkers(this.getMarkerPoints());
        }
    };
    TimeCyclesDrawing.prototype.startUserDrawing = function () {
        _super.prototype.startUserDrawing.call(this);
        this.inDrawingState = false;
    };
    TimeCyclesDrawing.prototype.radius = function () {
        var points = this.cartesianPoints();
        return Math.abs((points[1].x - points[0].x) / 2);
    };
    TimeCyclesDrawing.prototype.diameter = function () {
        var points = this.cartesianPoints();
        return Math.abs(points[1].x - points[0].x);
    };
    TimeCyclesDrawing.prototype.centerPoint = function () {
        var points = this.cartesianPoints();
        return {
            x: (points[0].x + points[1].x) / 2,
            y: points[0].y
        };
    };
    TimeCyclesDrawing.prototype.getMarkerPoints = function () {
        var markers = [this.cartesianPoints()[0]];
        if (this.inDrawingState) {
            markers.push(this.cartesianPoints()[1]);
        }
        return markers;
    };
    TimeCyclesDrawing.prototype.drawCycles = function () {
        var points = this.cartesianPoints();
        var radius = this.radius();
        var diameter = this.diameter();
        for (var i = 0; i <= this.context.canvas.clientWidth; i++) {
            this.drawRightCycle(i, points, radius, diameter);
            this.drawLeftCycle(i, points, radius);
        }
    };
    TimeCyclesDrawing.prototype.drawRightCycle = function (i, points, radius, diameter) {
        var lastPoint = ((points[0].x + points[1].x) / 2) + 2 * radius * (i) - diameter;
        if (lastPoint < this.chartPanel.contentFrame.right) {
            this.context.beginPath();
            this.context.arc(((points[0].x + points[1].x) / 2) + 2 * radius * (i), points[0].y, radius, Math.PI, 0);
            this.context.scxFillStroke(this.getDrawingTheme().fill, this.getDrawingTheme().line);
        }
    };
    TimeCyclesDrawing.prototype.drawLeftCycle = function (i, points, radius) {
        var firstPoint = ((points[0].x + points[1].x) / 2) - 2 * radius * (i);
        if (firstPoint > this.chartPanel.contentFrame.left) {
            this.context.beginPath();
            this.context.arc(((points[0].x + points[1].x) / 2) - 2 * radius * (i + 1), points[0].y, radius, Math.PI, 0);
            this.context.scxFillStroke(this.getDrawingTheme().fill, this.getDrawingTheme().line);
        }
    };
    TimeCyclesDrawing.prototype._finishUserDrawing = function () {
        _super.prototype._finishUserDrawing.call(this);
        this.inDrawingState = true;
        this.chartPoints[1].moveToPoint({ x: this.cartesianPoints()[1].x, y: this.cartesianPoints()[0].y }, this.projection);
    };
    return TimeCyclesDrawing;
}(ThemedDrawing));
export { TimeCyclesDrawing };
Drawing.register(TimeCyclesDrawing);
//# sourceMappingURL=TimeCyclesDrawing.js.map