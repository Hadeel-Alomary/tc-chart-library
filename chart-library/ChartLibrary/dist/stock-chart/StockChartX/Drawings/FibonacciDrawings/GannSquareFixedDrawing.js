import { __extends } from "tslib";
import { Drawing } from '../Drawing';
import { GannSquareDrawingBase } from './GannSquareDrawingBase';
import { Geometry } from '../../Graphics/Geometry';
import { GestureState } from '../../Gestures/Gesture';
var GannSquareFixedDrawing = (function (_super) {
    __extends(GannSquareFixedDrawing, _super);
    function GannSquareFixedDrawing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.fansValue = [8, 5, 4, 3, 2, 1, 2, 3, 4, 5, 8];
        _this.arcsValue = [1, 1.4, 1.5, 2, 2.3, 3, 3.2, 4, 4.15, 5, 5.1];
        _this.inDrawingState = true;
        return _this;
    }
    Object.defineProperty(GannSquareFixedDrawing, "className", {
        get: function () {
            return 'gannSquareFixed';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GannSquareFixedDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 2;
        },
        enumerable: false,
        configurable: true
    });
    GannSquareFixedDrawing.prototype.startUserDrawing = function () {
        _super.prototype.startUserDrawing.call(this);
        this.inDrawingState = false;
    };
    GannSquareFixedDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        if (points.length < this.pointsNeeded)
            return false;
        if (this.getDrawingTheme().reverse)
            this.reversePoints(points);
        return (Geometry.isPointNearPoint(point, points) || this.levelsHitTest(point, points) || this.fansHitTest(point, points));
    };
    GannSquareFixedDrawing.prototype.levelsHitTest = function (point, points) {
        var distance = this._calculateDistance(points);
        var quarter = this._getQuarter(points);
        var horizontalDistance = this._horizontalDistance(quarter, distance);
        var verticalDistance = this._verticalDistance(quarter, distance);
        for (var i = 0; i < this.levels.length; i++) {
            if (!this._isLevelVisible(this.levels[i]))
                continue;
            var point1 = {
                x: points[0].x,
                y: points[0].y + (verticalDistance * i)
            };
            var point2 = {
                x: points[0].x + (horizontalDistance * 5),
                y: points[0].y + (verticalDistance * i)
            };
            var point3 = {
                x: points[0].x + (i * horizontalDistance),
                y: points[0].y
            };
            var point4 = {
                x: points[0].x + (i * horizontalDistance),
                y: points[0].y + (verticalDistance * 5)
            };
            if (Geometry.isPointNearLine(point, point1, point2) || Geometry.isPointNearLine(point, point3, point4))
                return true;
        }
    };
    GannSquareFixedDrawing.prototype.fansHitTest = function (point, points) {
        var distance = this._calculateDistance(points);
        var quarter = this._getQuarter(points);
        var horizontalDistance = this._horizontalDistance(quarter, distance);
        var verticalDistance = this._verticalDistance(quarter, distance);
        for (var i = 0; i < this.fansValue.length; i++) {
            if (!this._isLevelVisible(this.fans[i]))
                continue;
            var point2 = void 0, point3 = void 0;
            var point1 = {
                x: points[0].x,
                y: points[0].y
            };
            if (i < 6) {
                point2 = {
                    x: points[0].x + ((horizontalDistance * 5) / this.fansValue[i]),
                    y: points[0].y + (verticalDistance * 5)
                };
                if (Geometry.isPointNearLine(point, point1, point2))
                    return true;
            }
            else {
                point3 = {
                    x: points[0].x + (5 * horizontalDistance),
                    y: points[0].y + ((verticalDistance * 5) / this.fansValue[i])
                };
                if (Geometry.isPointNearLine(point, point1, point3))
                    return true;
            }
        }
    };
    GannSquareFixedDrawing.prototype._handlePanGesture = function (gesture, event) {
        switch (gesture.state) {
            case GestureState.STARTED:
                var points = this.cartesianPoints();
                if (points.length > 1) {
                    for (var i = 0; i < points.length; i++) {
                        if (Geometry.isPointNearPoint(event.pointerPosition, points[i])) {
                            this._setDragPoint(i);
                            return true;
                        }
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
        }
        return false;
    };
    GannSquareFixedDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints();
        if (points.length === 0)
            return;
        if (points.length > 1) {
            if (this.getDrawingTheme().reverse)
                this.reversePoints(points);
            this.drawLevels(points);
            this.drawFans(points);
            this.drawArcs(points);
        }
        if (this.selected) {
            this._drawSelectionMarkers(this.getMarkerPoints());
        }
    };
    GannSquareFixedDrawing.prototype.drawLevels = function (points) {
        var distance = this._calculateDistance(points);
        var quarter = this._getQuarter(points);
        var horizontalDistance = this._horizontalDistance(quarter, distance);
        var verticalDistance = this._verticalDistance(quarter, distance);
        for (var i = 0; i < this.levels.length; i++) {
            if (!this._isLevelVisible(this.levels[i]))
                continue;
            this.context.beginPath();
            this.context.moveTo(points[0].x, points[0].y + (verticalDistance * i));
            this.context.lineTo(points[0].x + (horizontalDistance * 5), points[0].y + (verticalDistance * i));
            this.context.moveTo(points[0].x + (i * horizontalDistance), points[0].y);
            this.context.lineTo(points[0].x + (i * horizontalDistance), points[0].y + (verticalDistance * 5));
            this.context.scxStroke(this.levels[i].theme.line);
        }
    };
    GannSquareFixedDrawing.prototype.drawFans = function (points) {
        var distance = this._calculateDistance(points);
        var quarter = this._getQuarter(points);
        var horizontalDistance = this._horizontalDistance(quarter, distance);
        var verticalDistance = this._verticalDistance(quarter, distance);
        for (var i = 0; i < this.fansValue.length; i++) {
            if (!this._isLevelVisible(this.fans[i]))
                continue;
            if (i < 6) {
                this.context.beginPath();
                this.context.moveTo(points[0].x, points[0].y);
                this.context.lineTo(points[0].x + ((horizontalDistance * 5) / this.fansValue[i]), points[0].y + (verticalDistance * 5));
                this.context.scxStroke(this.fans[i].theme.line);
            }
            else {
                this.context.beginPath();
                this.context.moveTo(points[0].x, points[0].y);
                this.context.lineTo(points[0].x + (5 * horizontalDistance), points[0].y + ((verticalDistance * 5) / this.fansValue[i]));
                this.context.scxStroke(this.fans[i].theme.line);
            }
        }
    };
    GannSquareFixedDrawing.prototype.drawArcs = function (points) {
        var distance = this._calculateDistance(points);
        var quarter = this._getQuarter(points);
        var startAngle = this._startAngle(quarter);
        var endAngle = this._endAngle(quarter);
        var previousDistance = 0;
        for (var i = 0; i < this.arcsValue.length; i++) {
            if (!this._isLevelVisible(this.arcs[i]))
                continue;
            this.context.beginPath();
            this.context.arc(points[0].x, points[0].y, distance * this.arcsValue[i], startAngle, endAngle);
            this.context.scxStroke(this.arcs[i].theme.line);
            if (this.getDrawingTheme().showLevelBackgrounds) {
                var newDistance = (this.arcsValue[i] * (distance));
                this.context.beginPath();
                this.context.arc(points[0].x, points[0].y, previousDistance, startAngle, endAngle);
                this.context.arc(points[0].x, points[0].y, newDistance, endAngle, startAngle, true);
                this.context.scxFill(this.arcs[i].theme.fill);
                previousDistance = newDistance;
            }
        }
    };
    GannSquareFixedDrawing.prototype.reversePoints = function (points) {
        var xo = points[0].x;
        var yo = points[0].y;
        points[0].x = points[1].x;
        points[0].y = points[1].y;
        points[1].x = xo;
        points[1].y = yo;
    };
    GannSquareFixedDrawing.prototype._calculateDistance = function (points) {
        return Math.sqrt(Math.pow((points[1].x - points[0].x), 2) + Math.pow((points[1].y - points[0].y), 2));
    };
    GannSquareFixedDrawing.prototype._getQuarter = function (points) {
        var quarter = 0;
        if (points[0].y < points[1].y) {
            if (points[0].x < points[1].x) {
                quarter = 3;
            }
            else {
                quarter = 4;
            }
        }
        else {
            if (points[0].x < points[1].x) {
                quarter = 2;
            }
            else {
                quarter = 1;
            }
        }
        return quarter;
    };
    GannSquareFixedDrawing.prototype._horizontalDistance = function (quarter, distance) {
        switch (quarter) {
            case 1:
                return -distance;
            case 2:
                return distance;
            case 3:
                return distance;
            case 4:
                return -distance;
        }
    };
    GannSquareFixedDrawing.prototype._verticalDistance = function (quarter, distance) {
        switch (quarter) {
            case 1:
                return -distance;
            case 2:
                return -distance;
            case 3:
                return distance;
            case 4:
                return distance;
        }
    };
    GannSquareFixedDrawing.prototype._startAngle = function (quarter) {
        switch (quarter) {
            case 1:
                return Math.PI;
            case 2:
                return -0.5 * Math.PI;
            case 3:
                return 0;
            case 4:
                return 0.5 * Math.PI;
        }
    };
    GannSquareFixedDrawing.prototype._endAngle = function (quarter) {
        switch (quarter) {
            case 1:
                return -0.5 * Math.PI;
            case 2:
                return 0;
            case 3:
                return 0.5 * Math.PI;
            case 4:
                return Math.PI;
        }
    };
    GannSquareFixedDrawing.prototype._finishUserDrawing = function () {
        _super.prototype._finishUserDrawing.call(this);
        this.inDrawingState = true;
    };
    GannSquareFixedDrawing.prototype.getMarkerPoints = function () {
        var markers = [this.cartesianPoints()[0]];
        if (this.inDrawingState) {
            markers.push(this.cartesianPoints()[1]);
        }
        return markers;
    };
    return GannSquareFixedDrawing;
}(GannSquareDrawingBase));
export { GannSquareFixedDrawing };
Drawing.register(GannSquareFixedDrawing);
//# sourceMappingURL=GannSquareFixedDrawing.js.map