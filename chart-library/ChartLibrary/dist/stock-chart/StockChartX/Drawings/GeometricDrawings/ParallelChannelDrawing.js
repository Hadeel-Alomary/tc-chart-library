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
import { DrawingCalculationUtil } from '../../Utils/DrawingCalculationUtil';
import { ThemedDrawing } from '../ThemedDrawing';
import { DrawingsHelper } from '../../Helpers/DrawingsHelper';
var ParallelChannelDrawing = (function (_super) {
    __extends(ParallelChannelDrawing, _super);
    function ParallelChannelDrawing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._splits = [0, 1];
        _this._linePoints = {};
        _this._distance = 0;
        return _this;
    }
    Object.defineProperty(ParallelChannelDrawing, "className", {
        get: function () {
            return 'parallelChannel';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ParallelChannelDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 3;
        },
        enumerable: false,
        configurable: true
    });
    ParallelChannelDrawing.prototype.hitTest = function (point) {
        if (Object.keys(this._linePoints).length < this.pointsNeeded) {
            return false;
        }
        return Geometry.isPointNearPolyline(point, [this._linePoints[0].startPoint, this._linePoints[0].endPoint]) ||
            Geometry.isPointNearPolyline(point, [this._linePoints[1].startPoint, this._linePoints[1].endPoint]) || (Geometry.isPointNearPolyline(point, [this._linePoints[2].startPoint, this._linePoints[2].endPoint]) &&
            this.getDrawingTheme().middleLine.strokeEnabled);
    };
    ParallelChannelDrawing.prototype._handlePanGesture = function (gesture, event) {
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
    ParallelChannelDrawing.prototype.draw = function () {
        if (!this.visible) {
            return;
        }
        var points = this.cartesianPoints();
        var extendLeft = this.getDrawingTheme().linesExtension.leftExtensionEnabled;
        var extendRight = this.getDrawingTheme().linesExtension.rightExtensionEnabled;
        if (points.length >= 2) {
            if (this._dragPoint && this._dragPoint == 2)
                this._distance = this.computeDistance(points);
            if (!this._dragPoint)
                this._distance = this.computeDistance(points);
            this.context.beginPath();
            for (var i = 0; i < this._splits.length; i++) {
                var rayStart = { x: points[0].x, y: points[0].y };
                var rayEnd = { x: points[1].x, y: points[1].y };
                if (rayStart.x < rayEnd.x) {
                    rayStart = { x: points[1].x, y: points[1].y };
                    rayEnd = { x: points[0].x, y: points[0].y };
                }
                rayStart.y -= this._splits[i] * this._distance;
                rayEnd.y -= this._splits[i] * this._distance;
                if (points.length == this.pointsNeeded && i == 1) {
                    this.setCenterPoint(points, rayStart, rayEnd);
                }
                if (extendLeft) {
                    rayEnd = DrawingsHelper.getExtendedLineEndPoint(rayStart, rayEnd, this.chartPanel);
                }
                if (extendRight) {
                    rayStart = DrawingsHelper.getExtendedLineEndPoint(rayEnd, rayStart, this.chartPanel);
                }
                this.addLinePoints(i, rayStart, rayEnd);
                this.context.scxStrokePolyline([rayStart, rayEnd], this.getDrawingTheme().line);
            }
            if (points.length == this.pointsNeeded) {
                if (this.getDrawingTheme().middleLine.strokeEnabled) {
                    this.drawMiddleLine();
                }
                this.context.scxFillPolyLine([
                    this._linePoints[0].startPoint, this._linePoints[0].endPoint, this._linePoints[1].endPoint, this._linePoints[1].startPoint
                ], this.getDrawingTheme().fill);
            }
        }
        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    };
    ParallelChannelDrawing.prototype.computeDistance = function (points) {
        var midPointY = (points[0].y + points[1].y) / 2;
        return points.length == 3 ? midPointY - points[2].y : 0;
    };
    ParallelChannelDrawing.prototype.drawMiddleLine = function () {
        var startPoint = {
            x: (this._linePoints[0].startPoint.x + this._linePoints[1].startPoint.x) / 2,
            y: (this._linePoints[0].startPoint.y + this._linePoints[1].startPoint.y) / 2
        };
        var endPoint = {
            x: (this._linePoints[0].endPoint.x + this._linePoints[1].endPoint.x) / 2,
            y: (this._linePoints[0].endPoint.y + this._linePoints[1].endPoint.y) / 2
        };
        this.addLinePoints(2, startPoint, endPoint);
        this.context.scxStrokePolyline([startPoint, endPoint], this.getDrawingTheme().middleLine);
    };
    ParallelChannelDrawing.prototype.addLinePoints = function (index, startPoint, endPoint) {
        this._linePoints[index] = { startPoint: startPoint, endPoint: endPoint };
    };
    ParallelChannelDrawing.prototype.setCenterPoint = function (points, rayStart, rayEnd) {
        var centerPoint = DrawingCalculationUtil.centerPointOfLine(rayStart, rayEnd);
        points[2] = { x: centerPoint.x, y: centerPoint.y };
        this.chartPoints[2].moveToPoint(centerPoint, this.projection);
    };
    ParallelChannelDrawing.prototype._finishUserDrawing = function () {
        _super.prototype._finishUserDrawing.call(this);
    };
    return ParallelChannelDrawing;
}(ThemedDrawing));
export { ParallelChannelDrawing };
Drawing.register(ParallelChannelDrawing);
//# sourceMappingURL=ParallelChannelDrawing.js.map