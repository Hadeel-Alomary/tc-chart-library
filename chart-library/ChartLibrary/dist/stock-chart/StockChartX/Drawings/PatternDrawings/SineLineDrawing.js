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
import { Geometry } from '../../Graphics/Geometry';
import { GestureState } from '../../Gestures/Gesture';
import { ThemedDrawing } from '../ThemedDrawing';
var SineLineDrawing = (function (_super) {
    __extends(SineLineDrawing, _super);
    function SineLineDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SineLineDrawing, "className", {
        get: function () {
            return 'sineLine';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SineLineDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 2;
        },
        enumerable: true,
        configurable: true
    });
    SineLineDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        if (points.length < 2)
            return false;
        var sineAngle = this.angle();
        var y = this.amplitude() + this.amplitude() * Math.cos((point.x - points[0].x) / sineAngle);
        if (Geometry.isValueNearValue(point.y, (points[1].y + y)))
            return true;
    };
    SineLineDrawing.prototype._handlePanGesture = function (gesture, event) {
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
    SineLineDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints();
        if (points.length == this.pointsNeeded) {
            this.drawSine();
        }
        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    };
    SineLineDrawing.prototype.frequency = function () {
        var points = this.cartesianPoints();
        var width = this.context.canvas.clientWidth;
        return (width / ((points[0].x - points[1].x)));
    };
    SineLineDrawing.prototype.amplitude = function () {
        var points = this.cartesianPoints();
        return (points[0].y - points[1].y) / 2;
    };
    SineLineDrawing.prototype.angle = function () {
        var width = this.context.canvas.clientWidth;
        var frequency = this.frequency();
        return width / (Math.PI * (frequency));
    };
    SineLineDrawing.prototype.drawSine = function () {
        var points = this.cartesianPoints();
        var amplitude = this.amplitude();
        var sineAngle = this.angle();
        var y = amplitude + amplitude * Math.cos((points[0].x) / sineAngle);
        var rightContentFrame = this.chartPanel.contentFrame.right;
        this.context.beginPath();
        this.context.moveTo(this.chartPanel.contentFrame.left, points[1].y + y);
        for (var i = 0; i < this.context.canvas.clientWidth; i++) {
            if (i < rightContentFrame) {
                y = amplitude + amplitude * Math.cos((i - points[0].x) / sineAngle);
                this.context.lineTo(i, points[1].y + y);
            }
        }
        this.context.scxStroke(this.getDrawingTheme().line);
    };
    return SineLineDrawing;
}(ThemedDrawing));
export { SineLineDrawing };
Drawing.register(SineLineDrawing);
//# sourceMappingURL=SineLineDrawing.js.map