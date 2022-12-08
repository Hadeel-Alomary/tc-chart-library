import { __extends } from "tslib";
import { Drawing, DrawingDragPoint } from '../Drawing';
import { ChartPoint } from '../../Graphics/ChartPoint';
import { Geometry } from '../../Graphics/Geometry';
import { GestureState } from '../../Gestures/Gesture';
import { AbstractCurvedPathDrawing } from './AbstractCurvedPathDrawing';
var CurveDrawing = (function (_super) {
    __extends(CurveDrawing, _super);
    function CurveDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(CurveDrawing, "className", {
        get: function () {
            return 'curve';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 2;
        },
        enumerable: false,
        configurable: true
    });
    CurveDrawing.prototype.hitTest = function (point) {
        return this.curveHitTest(point);
    };
    CurveDrawing.prototype._handlePanGesture = function (gesture, event) {
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
    CurveDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints(), context = this.context;
        if (points.length > 1) {
            var controlPoints = this.curveControlPoints();
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            context.quadraticCurveTo(controlPoints.x, controlPoints.y, points[1].x, points[1].y);
            context.scxFillStroke(this.getDrawingTheme().fill, this.getDrawingTheme().line);
            if (points.length > 2) {
                this.savePath(this.curveControlPoints());
            }
        }
        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    };
    CurveDrawing.prototype.curveControlPoints = function () {
        var points = this.cartesianPoints();
        var controlPoint_x = (4 * this.headPoint().x - points[0].x - points[1].x) / 2;
        var controlPoint_y = (4 * this.headPoint().y - points[0].y - points[1].y) / 2;
        return { x: controlPoint_x, y: controlPoint_y };
    };
    CurveDrawing.prototype.headPoint = function () {
        var points = this.cartesianPoints();
        var x = this.calculateHeadPointX();
        var y = (-1 / this.slope()) * (x - ((points[0].x) + points[1].x) / 2) + ((points[0].y + points[1].y) / 2);
        if (points.length > 2)
            return { x: points[2].x, y: points[2].y };
        return { x: x, y: y };
    };
    CurveDrawing.prototype.calculateHeadPointX = function () {
        var points = this.cartesianPoints();
        var centerX = (points[0].x + points[1].x) / 2;
        var headPoint_x;
        if (points[0].x < points[1].x) {
            if (points[0].y > points[1].y) {
                headPoint_x = centerX + Math.sqrt(Math.pow(this.distance(), 2) / (1 + (1 / Math.pow(this.slope(), 2))));
            }
            else {
                headPoint_x = centerX - Math.sqrt(Math.pow(this.distance(), 2) / (1 + (1 / Math.pow(this.slope(), 2))));
            }
        }
        else {
            if (points[0].y < points[1].y) {
                headPoint_x = centerX - Math.sqrt(Math.pow(this.distance(), 2) / (1 + (1 / Math.pow(this.slope(), 2))));
            }
            else {
                headPoint_x = centerX + Math.sqrt(Math.pow(this.distance(), 2) / (1 + (1 / Math.pow(this.slope(), 2))));
            }
        }
        return headPoint_x;
    };
    CurveDrawing.prototype.distance = function () {
        var points = this.cartesianPoints();
        return Math.sqrt(Math.pow((points[0].x - points[1].x), 2) + Math.pow((points[0].y - points[1].y), 2)) / 6;
    };
    CurveDrawing.prototype.slope = function () {
        var points = this.cartesianPoints();
        return (points[1].y - points[0].y) / (points[1].x - points[0].x);
    };
    CurveDrawing.prototype._finishUserDrawing = function () {
        _super.prototype._finishUserDrawing.call(this);
        var point = ChartPoint.convert({
            x: this.headPoint().x,
            y: this.headPoint().y
        }, this.createPointBehavior, this.projection);
        this.appendChartPoint(point);
    };
    return CurveDrawing;
}(AbstractCurvedPathDrawing));
export { CurveDrawing };
Drawing.register(CurveDrawing);
//# sourceMappingURL=CurveDrawing.js.map