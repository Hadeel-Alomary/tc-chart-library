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
import { GestureState } from '../../Gestures/Gesture';
import { Geometry } from '../../Graphics/Geometry';
import { GannSquareDrawingBase } from './GannSquareDrawingBase';
import { MeasuringUtil } from '../../Utils/MeasuringUtil';
var GannSquareDrawing = (function (_super) {
    __extends(GannSquareDrawing, _super);
    function GannSquareDrawing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.fansValue = [8, 5, 4, 3, 2, 1, 2, 3, 4, 5, 8];
        _this.arcsValue = [1, 1.4, 1.5, 2, 2.3, 3, 3.2, 4, 4.15, 5, 5.1];
        return _this;
    }
    Object.defineProperty(GannSquareDrawing, "className", {
        get: function () {
            return 'gannSquare';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GannSquareDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GannSquareDrawing.prototype, "endUserDrawing", {
        get: function () {
            if (this._options.endUserDrawing == undefined)
                this._options.endUserDrawing = false;
            return this._options.endUserDrawing;
        },
        set: function (value) {
            this._options.endUserDrawing = value;
        },
        enumerable: true,
        configurable: true
    });
    GannSquareDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        if (points.length < this.pointsNeeded)
            return false;
        return this.levelsHitTest(point, points) || this.fansHitTest(point, points) || (Geometry.isPointNearPoint(point, points));
    };
    GannSquareDrawing.prototype.levelsHitTest = function (point, points) {
        var thirdPoint = this._calculateThirdPoint(points);
        for (var i = 0; i < this.levels.length; i++) {
            if (!this._isLevelVisible(this.levels[i]))
                continue;
            var point1 = {
                x: points[0].x,
                y: points[0].y - i * ((points[0].y - thirdPoint.y) / 5)
            };
            var point2 = {
                x: thirdPoint.x,
                y: points[0].y - i * ((points[0].y - thirdPoint.y) / 5)
            };
            var point3 = {
                x: points[0].x + i * ((thirdPoint.x - points[0].x) / 5),
                y: points[0].y
            };
            var point4 = {
                x: points[0].x + i * ((thirdPoint.x - points[0].x) / 5),
                y: thirdPoint.y
            };
            if (Geometry.isPointNearLine(point, point1, point2) || Geometry.isPointNearLine(point, point3, point4))
                return true;
        }
    };
    GannSquareDrawing.prototype.fansHitTest = function (point, points) {
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
                    x: this.thirdPoint.x,
                    y: points[0].y - ((points[0].y - this.thirdPoint.y) / this.fansValue[i])
                };
                if (Geometry.isPointNearLine(point, point1, point2))
                    return true;
            }
            else {
                point3 = {
                    x: points[0].x + ((this.thirdPoint.x - points[0].x) / this.fansValue[i]),
                    y: this.thirdPoint.y
                };
                if (Geometry.isPointNearLine(point, point1, point3))
                    return true;
            }
        }
    };
    GannSquareDrawing.prototype._handlePanGesture = function (gesture, event) {
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
    GannSquareDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints();
        if (points.length === 0)
            return;
        if (points.length > 1) {
            this.thirdPoint = this._calculateThirdPoint(points);
            this.drawLevels(points);
            this.drawFans(points);
            this.drawArcs(points);
            this.drawText(points);
        }
        if (this.selected) {
            this._drawSelectionMarkers(this.getMarkerPoints());
        }
    };
    GannSquareDrawing.prototype.drawLevels = function (points) {
        for (var i = 0; i < this.levels.length; i++) {
            if (!this._isLevelVisible(this.levels[i]))
                continue;
            this.context.beginPath();
            this.context.moveTo(points[0].x, points[0].y - i * ((points[0].y - this.thirdPoint.y) / 5));
            this.context.lineTo(this.thirdPoint.x, points[0].y - i * ((points[0].y - this.thirdPoint.y) / 5));
            this.context.moveTo(points[0].x + i * ((this.thirdPoint.x - points[0].x) / 5), points[0].y);
            this.context.lineTo(points[0].x + i * ((this.thirdPoint.x - points[0].x) / 5), this.thirdPoint.y);
            this.context.scxStroke(this.levels[i].theme.line);
        }
    };
    GannSquareDrawing.prototype.drawFans = function (points) {
        for (var i = 0; i < this.fansValue.length; i++) {
            if (!this._isLevelVisible(this.fans[i]))
                continue;
            if (i < 6) {
                this.context.beginPath();
                this.context.moveTo(points[0].x, points[0].y);
                this.context.lineTo(this.thirdPoint.x, points[0].y - ((points[0].y - this.thirdPoint.y) / this.fansValue[i]));
                this.context.scxStroke(this.fans[i].theme.line);
            }
            else {
                this.context.beginPath();
                this.context.moveTo(points[0].x, points[0].y);
                this.context.lineTo(points[0].x + ((this.thirdPoint.x - points[0].x) / this.fansValue[i]), this.thirdPoint.y);
                this.context.scxStroke(this.fans[i].theme.line);
            }
        }
    };
    GannSquareDrawing.prototype.drawArcs = function (points) {
        var quarter = this._getQuarter([points[0], { x: this.thirdPoint.x, y: this.thirdPoint.y }]);
        var angles = this._angles(quarter);
        var prevWidth = 0;
        var prevHeight = 0;
        for (var i = 0; i < this.arcsValue.length; i++) {
            if (!this._isLevelVisible(this.arcs[i]))
                continue;
            this.context.beginPath();
            this.context.ellipse(points[0].x, points[0].y, (this.arcsValue[i] * Math.abs((this.thirdPoint.x - points[0].x) / 5)), (this.arcsValue[i] * Math.abs((points[0].y - this.thirdPoint.y) / 5)), 0, angles.start, angles.end);
            this.context.scxStroke(this.arcs[i].theme.line);
            if (this.getDrawingTheme().showLevelBackgrounds) {
                var width = (this.arcsValue[i] * Math.abs((this.thirdPoint.x - points[0].x) / 5));
                var height = (this.arcsValue[i] * Math.abs((points[0].y - this.thirdPoint.y) / 5));
                this.context.beginPath();
                this.context.ellipse(points[0].x, points[0].y, prevWidth, prevHeight, 0, angles.start, angles.end);
                this.context.ellipse(points[0].x, points[0].y, width, height, 0, angles.end, angles.start, true);
                this.context.scxFill(this.arcs[i].theme.fill);
                prevWidth = width;
                prevHeight = height;
            }
        }
    };
    GannSquareDrawing.prototype.drawText = function (points) {
        var quarter = this._getQuarter([points[0], { x: this.thirdPoint.x, y: this.thirdPoint.y }]);
        var divOfPriceDifferenceAndBarsCount = this.positionOfDivText(quarter, this.thirdPoint.x, this.thirdPoint.y);
        var barsCountText = this.positionOfBarsCountText(quarter, this.thirdPoint.x, points);
        var priceDiffText = this.positionOfPriceDiffText(quarter, points, this.thirdPoint.y);
        this.rangeAndRatio = this.divOfPriceDifferenceAndBarsCount(points);
        if (this.getDrawingTheme().showText) {
            this.context.beginPath();
            this.context.scxApplyTextTheme(this.getDrawingTheme().text);
            this.context.fillText(this.divOfPriceDifferenceAndBarsCount(points).toFixed(7).toString(), divOfPriceDifferenceAndBarsCount.x, divOfPriceDifferenceAndBarsCount.y);
            this.context.fillText(this.getBarCount().toString(), barsCountText.x, barsCountText.y);
            this.context.fillText(this.priceDifference(points).toFixed(2).toString(), priceDiffText.x, priceDiffText.y);
        }
    };
    GannSquareDrawing.prototype._calculateThirdPoint = function (points) {
        var width = Math.abs(points[1].x - points[0].x);
        var height = width;
        var x;
        var y;
        if ((points[0].x < points[1].x) && (points[0].y > points[1].y)) {
            x = points[0].x + width;
            y = points[0].y - height;
        }
        if ((points[0].x > points[1].x) && (points[0].y > points[1].y)) {
            x = points[0].x - width;
            y = points[0].y - height;
        }
        if ((points[0].x > points[1].x) && (points[0].y < points[1].y)) {
            x = points[0].x - width;
            y = points[0].y + height;
        }
        if ((points[0].x < points[1].x) && (points[0].y < points[1].y)) {
            x = points[0].x + width;
            y = points[0].y + height;
        }
        if (this.endUserDrawing) {
            x = points[1].x;
            y = points[1].y;
        }
        if (this.getDrawingTheme().reverse) {
            var xo = points[0].x;
            var yo = points[0].y;
            points[0].x = points[1].x;
            points[0].y = points[1].y;
            x = xo;
            y = yo;
        }
        return { x: x, y: y };
    };
    GannSquareDrawing.prototype._angles = function (quarter) {
        switch (quarter) {
            case 1:
                return { start: Math.PI, end: -1 / 2 * Math.PI };
            case 2:
                return { start: -0.5 * Math.PI, end: 0 };
            case 3:
                return { start: 0, end: 0.5 * Math.PI };
            case 4:
                return { start: 0.5 * Math.PI, end: Math.PI };
        }
    };
    GannSquareDrawing.prototype._getQuarter = function (points) {
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
    GannSquareDrawing.prototype.positionOfDivText = function (quarter, x2, y2) {
        switch (quarter) {
            case 1:
                return { x: x2 - 70, y: y2 - 10 };
            case 2:
                return { x: x2 + 10, y: y2 - 10 };
            case 3:
                return { x: x2 + 10, y: y2 + 20 };
            case 4:
                return { x: x2 - 70, y: y2 + 20 };
        }
    };
    GannSquareDrawing.prototype.positionOfBarsCountText = function (quarter, x2, points) {
        switch (quarter) {
            case 1:
                return { x: x2 - 20, y: points[0].y + 20 };
            case 2:
                return { x: x2 + 10, y: points[0].y + 15 };
            case 3:
                return { x: x2 + 10, y: points[0].y - 10 };
            case 4:
                return { x: x2 - 30, y: points[0].y - 10 };
        }
    };
    GannSquareDrawing.prototype.positionOfPriceDiffText = function (quarter, points, y2) {
        switch (quarter) {
            case 1:
                return { x: points[0].x + 10, y: y2 - 10 };
            case 2:
                return { x: points[0].x - 20, y: y2 - 15 };
            case 3:
                return { x: points[0].x - 20, y: y2 + 25 };
            case 4:
                return { x: points[0].x + 10, y: y2 + 15 };
        }
    };
    GannSquareDrawing.prototype.divOfPriceDifferenceAndBarsCount = function (points) {
        return Math.abs(this.priceDifference(points) / this.getBarCount());
    };
    GannSquareDrawing.prototype.getBarCount = function () {
        return this.getDrawingTheme().reverse ?
            MeasuringUtil.getMeasuringValues([this.chartPoints[1], this.chartPoints[0]], this.chartPanel).barsCount :
            MeasuringUtil.getMeasuringValues([this.chartPoints[0], this.chartPoints[1]], this.chartPanel).barsCount;
    };
    GannSquareDrawing.prototype.priceDifference = function (points) {
        return this.projection.valueByY(this.thirdPoint.y) - this.projection.valueByY(points[0].y);
    };
    GannSquareDrawing.prototype._finishUserDrawing = function () {
        _super.prototype._finishUserDrawing.call(this);
        var points = this.cartesianPoints();
        this.chartPoints[1].moveToPoint(this._calculateThirdPoint(points), this.projection);
        this.endUserDrawing = true;
    };
    GannSquareDrawing.prototype.getMarkerPoints = function () {
        var markers = [this.cartesianPoints()[0]];
        if (this.endUserDrawing) {
            markers.push(this.cartesianPoints()[1]);
        }
        return markers;
    };
    return GannSquareDrawing;
}(GannSquareDrawingBase));
export { GannSquareDrawing };
Drawing.register(GannSquareDrawing);
//# sourceMappingURL=GannSquareDrawing.js.map