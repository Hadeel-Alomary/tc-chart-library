import { __extends } from "tslib";
import { Drawing, DrawingDragPoint } from '../Drawing';
import { Geometry } from '../../Graphics/Geometry';
import { GestureState } from '../../Gestures/Gesture';
import { ThemedDrawing } from '../ThemedDrawing';
var CyclicLinesDrawing = (function (_super) {
    __extends(CyclicLinesDrawing, _super);
    function CyclicLinesDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(CyclicLinesDrawing, "className", {
        get: function () {
            return 'cyclicLines';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CyclicLinesDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 2;
        },
        enumerable: false,
        configurable: true
    });
    CyclicLinesDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        if (points.length < 2)
            return false;
        if (Geometry.isPointNearLine(point, points[0], points[1]) || this.isNearLines(point))
            return true;
    };
    CyclicLinesDrawing.prototype.isNearLines = function (point) {
        var points = this.cartesianPoints();
        var x;
        if (points[0].x > points[1].x) {
            x = points[0].x - this.distance() * Math.ceil(Math.abs((points[0].x - point.x)) / Math.abs((points[1].x - points[0].x)));
        }
        else {
            x = points[0].x + this.distance() * Math.floor(Math.abs((points[0].x - point.x)) / Math.abs((points[1].x - points[0].x)));
        }
        var point1 = { x: x, y: this.chartPanel.contentFrame.top }, point2 = { x: x, y: this.chartPanel.contentFrame.bottom };
        if (Geometry.isPointNearLine(point, point1, point2))
            return true;
    };
    CyclicLinesDrawing.prototype._handlePanGesture = function (gesture, event) {
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
    CyclicLinesDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints();
        if (points.length > 1) {
            if (this.ThereIsADistanceBetweenTheTwoPoints()) {
                this.drawLines();
                this.drawDashedLine();
            }
        }
        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    };
    CyclicLinesDrawing.prototype.distance = function () {
        var points = this.cartesianPoints();
        return Math.abs(points[0].x - points[1].x);
    };
    CyclicLinesDrawing.prototype.ThereIsADistanceBetweenTheTwoPoints = function () {
        return this.distance() > 1;
    };
    CyclicLinesDrawing.prototype.drawDashedLine = function () {
        var points = this.cartesianPoints();
        this.context.beginPath();
        this.context.moveTo(points[0].x, points[0].y);
        this.context.lineTo(points[1].x, points[1].y);
        this.context.scxStroke(this.getDrawingTheme().dashedLine);
    };
    CyclicLinesDrawing.prototype.drawLines = function () {
        var points = this.cartesianPoints();
        if (points[0].x > points[1].x) {
            this.drawLeftLines();
        }
        else if (points[0].x < points[1].x) {
            this.drawRightLines();
        }
    };
    CyclicLinesDrawing.prototype.drawLeftLines = function () {
        var dimension = 0, frame = this.chartPanel.contentFrame, points = this.cartesianPoints(), distance = this.distance();
        this.context.beginPath();
        for (var i = 0; i < this.context.canvas.clientWidth; i++) {
            if (points[0].x - dimension > this.chartPanel.contentFrame.left) {
                this.context.moveTo(points[0].x - dimension, frame.top);
                this.context.lineTo(points[0].x - dimension, frame.bottom);
            }
            dimension = dimension + distance;
        }
        this.context.scxStroke(this.getDrawingTheme().line);
    };
    CyclicLinesDrawing.prototype.drawRightLines = function () {
        var dimension = 0, frame = this.chartPanel.contentFrame, points = this.cartesianPoints(), distance = this.distance();
        this.context.beginPath();
        for (var i = 0; i < this.context.canvas.clientWidth; i++) {
            if (points[0].x + dimension < this.chartPanel.contentFrame.right) {
                this.context.moveTo(points[0].x + dimension, frame.top);
                this.context.lineTo(points[0].x + dimension, frame.bottom);
            }
            dimension = dimension + distance;
        }
        this.context.scxStroke(this.getDrawingTheme().line);
    };
    return CyclicLinesDrawing;
}(ThemedDrawing));
export { CyclicLinesDrawing };
Drawing.register(CyclicLinesDrawing);
//# sourceMappingURL=CyclicLinesDrawing.js.map