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
import { ThemedDrawing } from '../ThemedDrawing';
import { Geometry } from '../../Graphics/Geometry';
import { GestureState } from '../../Gestures/Gesture';
var ChannelBase = (function (_super) {
    __extends(ChannelBase, _super);
    function ChannelBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ChannelBase.prototype, "pointsNeeded", {
        get: function () {
            return 2;
        },
        enumerable: false,
        configurable: true
    });
    ChannelBase.prototype.hitTest = function (point) {
        if (this.chartPoints.length < this.pointsNeeded)
            return false;
        var p = this._drawingPoints;
        return Geometry.isPointNearLine(point, p[0], p[1]) ||
            Geometry.isPointNearLine(point, p[2], p[3]) ||
            Geometry.isPointNearLine(point, p[4], p[5]);
    };
    ChannelBase.prototype._handlePanGesture = function (gesture, event) {
        switch (gesture.state) {
            case GestureState.STARTED:
                this.moveChartPointsToMainLinePoints();
                if (Geometry.isPointNearPoint(this.cartesianPoint(0), event.pointerPosition))
                    this._setDragPoint(0);
                else if (Geometry.isPointNearPoint(this.cartesianPoint(1), event.pointerPosition))
                    this._setDragPoint(1);
                else
                    return false;
                return true;
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
    ChannelBase.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints();
        if (points.length === 0)
            return;
        if (points.length > 1) {
            this.drawLines();
            points = this._getMainLinePoints();
        }
        if (this.selected)
            this._drawSelectionMarkers(points);
    };
    ChannelBase.prototype.drawLines = function () {
        var points = this.cartesianPoints();
        var theme = this.getDrawingTheme();
        var context = this.context;
        var p = this._drawingPoints = this._calculateDrawingPoints(points);
        this._moveMainLineYPoint(p[2].y, p[3].y);
        context.beginPath();
        context.moveTo(p[0].x, p[0].y);
        context.lineTo(p[1].x, p[1].y);
        context.moveTo(p[2].x, p[2].y);
        context.lineTo(p[3].x, p[3].y);
        context.moveTo(p[4].x, p[4].y);
        context.lineTo(p[5].x, p[5].y);
        context.scxStroke(theme.line);
    };
    ChannelBase.prototype.moveChartPointsToMainLinePoints = function () {
        var points = this._getMainLinePoints();
        this.chartPoints[0].moveToPoint(points[0], this.projection);
        this.chartPoints[1].moveToPoint(points[1], this.projection);
    };
    ChannelBase.prototype._getMainLinePoints = function () {
        return [
            this._drawingPoints[2],
            this._drawingPoints[3]
        ];
    };
    ChannelBase.prototype._moveMainLineYPoint = function (y1, y2) {
        this.chartPoints[0].moveToY(y1, this.projection);
        this.chartPoints[1].moveToY(y2, this.projection);
    };
    ChannelBase.prototype._calculateDrawingPoints = function (points) {
        return [];
    };
    return ChannelBase;
}(ThemedDrawing));
export { ChannelBase };
//# sourceMappingURL=ChannelBase.js.map