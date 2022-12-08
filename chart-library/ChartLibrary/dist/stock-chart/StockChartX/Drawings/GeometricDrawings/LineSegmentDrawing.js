import { __extends } from "tslib";
import { Drawing } from '../Drawing';
import { Geometry } from '../../Graphics/Geometry';
import { GestureState } from '../../Gestures/Gesture';
import { BrowserUtils } from '../../../../utils';
import { AlertableDrawing } from '../AlertableDrawing';
var LineSegmentDrawing = (function (_super) {
    __extends(LineSegmentDrawing, _super);
    function LineSegmentDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(LineSegmentDrawing, "className", {
        get: function () {
            return 'lineSegment';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LineSegmentDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LineSegmentDrawing.prototype, "hasTooltip", {
        get: function () {
            return BrowserUtils.isDesktop();
        },
        enumerable: false,
        configurable: true
    });
    LineSegmentDrawing.prototype.bounds = function () {
        var points = this.cartesianPoints();
        if (points.length < this.pointsNeeded)
            return null;
        return {
            left: Math.min(points[0].x, points[1].x),
            top: Math.min(points[0].y, points[1].y),
            width: Math.abs(points[0].x - points[1].x),
            height: Math.abs(points[0].y - points[1].y)
        };
    };
    LineSegmentDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        return points.length > 1 && Geometry.isPointNearPolyline(point, points);
    };
    LineSegmentDrawing.prototype._handlePanGesture = function (gesture, event) {
        switch (gesture.state) {
            case GestureState.STARTED:
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
    LineSegmentDrawing.prototype.canAlertExtendRight = function () {
        return false;
    };
    LineSegmentDrawing.prototype.canAlertExtendLeft = function () {
        return false;
    };
    LineSegmentDrawing.prototype.getAlertFirstChartPoint = function () {
        return this.chartPoints[0].date < this.chartPoints[1].date ? this.chartPoints[0] : this.chartPoints[1];
    };
    LineSegmentDrawing.prototype.getAlertSecondChartPoint = function () {
        return this.chartPoints[0].date >= this.chartPoints[1].date ? this.chartPoints[0] : this.chartPoints[1];
    };
    LineSegmentDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints();
        if (points.length > 1) {
            this.context.scxStrokePolyline(points, this.getDrawingTheme().line);
        }
        if (this.selected)
            this._drawSelectionMarkers(points);
        this.drawAlertBellIfNeeded();
    };
    return LineSegmentDrawing;
}(AlertableDrawing));
export { LineSegmentDrawing };
Drawing.register(LineSegmentDrawing);
//# sourceMappingURL=LineSegmentDrawing.js.map