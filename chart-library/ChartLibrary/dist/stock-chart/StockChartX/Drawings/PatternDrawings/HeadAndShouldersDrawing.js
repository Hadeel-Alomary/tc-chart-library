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
import { ChartAccessorService } from '../../../../services/chart';
import { ThemedDrawing } from '../ThemedDrawing';
var HeadAndShouldersDrawing = (function (_super) {
    __extends(HeadAndShouldersDrawing, _super);
    function HeadAndShouldersDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(HeadAndShouldersDrawing, "className", {
        get: function () {
            return 'headAndShoulders';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HeadAndShouldersDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 7;
        },
        enumerable: false,
        configurable: true
    });
    HeadAndShouldersDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        return points.length > 1 && Geometry.isPointNearPolyline(point, points) ||
            Geometry.isPointNearPolyline(point, [this.infinityPoints()[0], this.infinityPoints()[1]]);
    };
    HeadAndShouldersDrawing.prototype._handlePanGesture = function (gesture, event) {
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
    HeadAndShouldersDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints();
        if (points.length > 1) {
            this.context.beginPath();
            this.context.scxStrokePolyline([points[0], points[1]], this.getDrawingTheme().line);
            this.drawWordInBox(points[1], this.getText('الكتف الأيسر'), points[0].y > points[1].y);
            var remainingPoints = this.pointsNeeded - points.length;
            if (remainingPoints <= 4) {
                this.context.scxStrokePolyline([points[1], points[2]], this.getDrawingTheme().line);
            }
            if (remainingPoints <= 3) {
                this.context.scxStrokePolyline([points[2], points[3]], this.getDrawingTheme().line);
                this.drawWordInBox(points[3], this.getText('الرأس'), points[2].y > points[3].y);
            }
            if (remainingPoints <= 2) {
                this.context.scxStrokePolyline([points[3], points[4]], this.getDrawingTheme().line);
                this.context.scxFillPolyLine([points[2], points[3], points[4]], this.getDrawingTheme().fill);
                this.drawBeamLine();
            }
            if (remainingPoints <= 1) {
                this.context.scxStrokePolyline([points[4], points[5]], this.getDrawingTheme().line);
                this.drawWordInBox(points[5], this.getText('الكتف الأيمن'), points[4].y > points[5].y);
            }
            if (remainingPoints == 0) {
                this.context.scxStrokePolyline([points[5], points[6]], this.getDrawingTheme().line);
            }
        }
        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    };
    HeadAndShouldersDrawing.prototype.slope = function (point1, point2) {
        return (point2.y - point1.y) / (point2.x - point1.x);
    };
    HeadAndShouldersDrawing.prototype.drawLine = function (point1, point2) {
        this.context.beginPath();
        this.context.moveTo(point1.x, point1.y);
        this.context.lineTo(point2.x, point2.y);
    };
    HeadAndShouldersDrawing.prototype.infinityPoints = function () {
        var points = this.cartesianPoints();
        var linearSegment1 = new LinearSegment(points[2], points[4]);
        var x = points[2].x < points[4].x ? -1000000 : 1000000;
        return [
            { x: x, y: linearSegment1.getY(x) },
            { x: -1 * x, y: linearSegment1.getY(-1 * x) }
        ];
    };
    HeadAndShouldersDrawing.prototype.drawWordInBox = function (point, text, abovePoint) {
        this.drawTextInBox(this.getDrawingTheme().line, point, text, abovePoint, ChartAccessorService.instance.isArabic() ? 15 : 12);
    };
    HeadAndShouldersDrawing.prototype.drawBeamLine = function () {
        var points = this.cartesianPoints();
        var infinityPoints = this.infinityPoints();
        var zeroToOneLinearSegment = new LinearSegment(points[0], points[1]);
        var infinitySegment = new LinearSegment(infinityPoints[0], infinityPoints[1]);
        var firstPoint = zeroToOneLinearSegment.doesIntersect(infinitySegment) ? zeroToOneLinearSegment.intersectionPoint(infinitySegment) : infinityPoints[0];
        var secondPoint = infinityPoints[1];
        if (points[6]) {
            var fiveToSixLinearSegment = new LinearSegment(points[5], points[6]);
            secondPoint = fiveToSixLinearSegment.doesIntersect(infinitySegment) ? fiveToSixLinearSegment.intersectionPoint(infinitySegment) : infinityPoints[1];
        }
        this.drawLine(firstPoint, secondPoint);
        this.context.scxStroke(this.getDrawingTheme().line);
        if (firstPoint != infinityPoints[0]) {
            this.context.scxFillPolyLine([points[1], points[2], firstPoint], this.getDrawingTheme().fill);
        }
        if (secondPoint != infinityPoints[1]) {
            this.context.scxFillPolyLine([points[4], points[5], secondPoint], this.getDrawingTheme().fill);
        }
    };
    HeadAndShouldersDrawing.prototype.getText = function (arabic) {
        return ChartAccessorService.instance.translate(arabic);
    };
    return HeadAndShouldersDrawing;
}(ThemedDrawing));
export { HeadAndShouldersDrawing };
var LinearSegment = (function () {
    function LinearSegment(point1, point2) {
        this.point1 = point1;
        this.point2 = point2;
        this.slope = (point2.y - point1.y) / (point2.x - point1.x);
        this.intercept = point1.y - this.slope * point1.x;
    }
    LinearSegment.prototype.intersectionPoint = function (linearSegment) {
        if (linearSegment.slope == this.slope) {
            return null;
        }
        var intersectX = (linearSegment.getIntercept() - this.getIntercept()) / (this.getSlope() - linearSegment.getSlope());
        var intersectY = this.getY(intersectX);
        return { x: intersectX, y: intersectY };
    };
    LinearSegment.prototype.doesIntersect = function (linearSegment) {
        if (linearSegment.getSlope() == this.getSlope()) {
            return false;
        }
        var intersectionPoint = this.intersectionPoint(linearSegment);
        return Math.min(this.point1.x, this.point2.x) <= intersectionPoint.x && intersectionPoint.x <= Math.max(this.point1.x, this.point2.x);
    };
    LinearSegment.prototype.getY = function (x) {
        return this.slope * x + this.intercept;
    };
    LinearSegment.prototype.getIntercept = function () {
        return this.intercept;
    };
    LinearSegment.prototype.getSlope = function () {
        return this.slope;
    };
    return LinearSegment;
}());
Drawing.register(HeadAndShouldersDrawing);
//# sourceMappingURL=HeadAndShouldersDrawing.js.map