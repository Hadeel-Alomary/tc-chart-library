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
import { ClickGesture } from '../../Gestures/ClickGesture';
import { GestureState } from '../../Gestures/Gesture';
import { ChartPoint } from '../../Graphics/ChartPoint';
import { PanGesture } from '../../Gestures/PanGesture';
import { Geometry } from '../../Graphics/Geometry';
import { MouseHoverGesture } from "../../Gestures/MouseHoverGesture";
import { ThemedDrawing } from '../ThemedDrawing';
var BrushDrawing = (function (_super) {
    __extends(BrushDrawing, _super);
    function BrushDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BrushDrawing, "className", {
        get: function () {
            return 'brush';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrushDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 2;
        },
        enumerable: true,
        configurable: true
    });
    BrushDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        return points.length > 1 && Geometry.isPointNearPolyline(point, points);
    };
    BrushDrawing.prototype.startUserDrawing = function () {
        this._createBrushPanGesture = new PanGesture({
            hitTest: function () {
                return true;
            },
            handler: this._handleUserDrawingPanGesture,
            context: this,
        });
        this._createBrushClickGesture = new ClickGesture({
            hitTest: function () {
                return true;
            },
            context: this,
        });
        this._createBrushMoveGesture = new MouseHoverGesture({
            enterEventEnabled: false,
            leaveEventEnabled: false,
            hitTest: function () {
                return true;
            },
            context: this,
        });
        this.chartPoints = [];
        this.selected = true;
        var panel = this.chartPanel;
        if (panel) {
            panel.deleteDrawings(this);
            panel.setNeedsUpdate();
            this.chartPanel = null;
        }
    };
    BrushDrawing.prototype._handleUserDrawingPanGesture = function (gesture, event) {
        switch (gesture.state) {
            case GestureState.STARTED:
            case GestureState.FINISHED:
                if (!this.chartPanel) {
                    event.chartPanel.addDrawings(this);
                }
                var point = this._normalizePoint(event.pointerPosition);
                this._lastCreatePoint = null;
                if (!this._handleUserDrawingPoint(point)) {
                    this.appendChartPoint(point);
                    this.onAddNewChartPointInUserDrawingState();
                }
                if (this.chartPoints.length >= this.pointsNeeded) {
                    this._finishUserDrawing();
                    this.removeDrawingIfNotSeen();
                }
                this.chartPanel.setNeedsUpdate();
                break;
            case GestureState.CONTINUED:
                if (this.chartPoints.length > 0) {
                    var point_1 = this._normalizePoint(event.pointerPosition);
                    this._lastCreatePoint = this._normalizePoint(event.pointerPosition);
                    this.appendChartPoint(point_1);
                    this.showDrawingTooltip();
                    this.chartPanel.setNeedsUpdate();
                }
                break;
        }
    };
    BrushDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints();
        if (points.length > 1) {
            this.context.beginPath();
            for (var i = 0; i < points.length - 1; i++) {
                if (points[i + 1] !== undefined) {
                    var x = (points[i].x + points[i + 1].x) / 2, y = (points[i].y + points[i + 1].y) / 2;
                    this.context.quadraticCurveTo(points[i].x, points[i].y, x, y);
                }
            }
            this.context.scxStroke(this.getDrawingTheme().line);
            if (this.applyFillDrawing && this.getDrawingTheme().fill.fillEnabled)
                this.context.scxFill(this.getDrawingTheme().fill);
        }
        if (this.selected)
            this._drawSelectionMarkers([points[0], points[points.length - 1]]);
    };
    BrushDrawing.prototype._normalizePoint = function (point) {
        var magnetPoint = this._magnetChartPointIfNeeded(point);
        return ChartPoint.convert(magnetPoint, this.createPointBehavior, this.projection);
    };
    BrushDrawing.prototype.handleEvent = function (event) {
        if (this._createBrushPanGesture) {
            return this._createBrushPanGesture.handleEvent(event) ||
                this._createBrushClickGesture.handleEvent(event) ||
                this._createBrushMoveGesture.handleEvent(event);
        }
        return this._gestures.handleEvent(event);
    };
    BrushDrawing.prototype.removeDrawingIfNotSeen = function () {
        if (this.cartesianPoints().length < 3) {
            this.chartPanel.deleteDrawings(this);
        }
    };
    Object.defineProperty(BrushDrawing.prototype, "applyFillDrawing", {
        get: function () {
            if (this._options.applyFillDrawing == undefined)
                this._options.applyFillDrawing = false;
            return this._options.applyFillDrawing;
        },
        set: function (value) {
            this._options.applyFillDrawing = !!value;
        },
        enumerable: true,
        configurable: true
    });
    BrushDrawing.prototype.canControlPointsBeManuallyChanged = function () {
        return false;
    };
    BrushDrawing.prototype._finishUserDrawing = function () {
        this._createBrushPanGesture = null;
        this.applyFillDrawing = true;
        _super.prototype._finishUserDrawing.call(this);
    };
    return BrushDrawing;
}(ThemedDrawing));
export { BrushDrawing };
Drawing.register(BrushDrawing);
//# sourceMappingURL=BrushDrawing.js.map