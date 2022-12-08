import { __extends } from "tslib";
import { Geometry } from '../../Graphics/Geometry';
import { ThemedDrawing } from '../ThemedDrawing';
var AbstractCurvedPathDrawing = (function (_super) {
    __extends(AbstractCurvedPathDrawing, _super);
    function AbstractCurvedPathDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbstractCurvedPathDrawing.prototype.savePath = function (c) {
        var points = this.cartesianPoints();
        this.path2d = new Path2D();
        if (points.length > 2) {
            var controlPoints = c;
            this.path2d.moveTo(points[0].x, points[0].y);
            this.path2d.quadraticCurveTo(controlPoints.x, controlPoints.y, points[1].x, points[1].y);
        }
    };
    AbstractCurvedPathDrawing.prototype.boxHover = function (point) {
        var margin = 10;
        var topPoint = { x: point.x, y: point.y - margin };
        var bottomPoint = { x: point.x, y: point.y + margin };
        var rightPoint = { x: point.x + margin, y: point.y };
        var leftPoint = { x: point.x - margin, y: point.y };
        return {
            topPoint: topPoint, bottomPoint: bottomPoint, rightPoint: rightPoint, leftPoint: leftPoint
        };
    };
    AbstractCurvedPathDrawing.prototype.pointInPath = function (point) {
        return this.context.isPointInPath(this.path2d, point.x * window.devicePixelRatio, point.y * window.devicePixelRatio);
    };
    AbstractCurvedPathDrawing.prototype.allPointInPath = function (point) {
        var boxHover = this.boxHover(point);
        return this.pointInPath(boxHover.topPoint) && this.pointInPath(boxHover.bottomPoint) && this.pointInPath(boxHover.rightPoint) && this.pointInPath(boxHover.leftPoint);
    };
    AbstractCurvedPathDrawing.prototype.atLeastOnePointInPath = function (point) {
        var boxHover = this.boxHover(point);
        return this.pointInPath(boxHover.topPoint) || this.pointInPath(boxHover.bottomPoint) || this.pointInPath(boxHover.rightPoint) || this.pointInPath(boxHover.leftPoint);
    };
    AbstractCurvedPathDrawing.prototype.distanceBetweenCursorAndLine01 = function (point) {
        var points = this.cartesianPoints();
        var A = (points[1].y - points[0].y) / (points[1].x - points[0].x);
        var B = -1;
        var C = points[0].y - (A * points[0].x);
        var lineEq = A * point.x + B * point.y + C;
        return Math.abs(lineEq) / Math.sqrt(Math.pow(A, 2) + Math.pow(B, 2));
    };
    AbstractCurvedPathDrawing.prototype.curveHitTest = function (point) {
        var points = this.cartesianPoints();
        var distanceBetweenCursorAndLine = this.distanceBetweenCursorAndLine01(point);
        if (distanceBetweenCursorAndLine <= 10) {
            return Geometry.isPointNearPoint(point, [points[0], points[1]]);
        }
        if (this.allPointInPath(point))
            return false;
        if (this.atLeastOnePointInPath(point))
            return true;
        return false;
    };
    return AbstractCurvedPathDrawing;
}(ThemedDrawing));
export { AbstractCurvedPathDrawing };
//# sourceMappingURL=AbstractCurvedPathDrawing.js.map