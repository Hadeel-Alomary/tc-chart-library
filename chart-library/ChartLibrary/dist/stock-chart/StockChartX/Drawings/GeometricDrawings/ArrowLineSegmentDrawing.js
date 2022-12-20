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
import { LineSegmentDrawing } from "./LineSegmentDrawing";
import { Drawing } from "../Drawing";
import { DrawingCalculationUtil } from "../../Utils/DrawingCalculationUtil";
var ArrowLineSegmentDrawing = (function (_super) {
    __extends(ArrowLineSegmentDrawing, _super);
    function ArrowLineSegmentDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ArrowLineSegmentDrawing, "className", {
        get: function () {
            return 'arrowLineSegment';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArrowLineSegmentDrawing.prototype, "width", {
        get: function () {
            return Math.max(this.getDrawingTheme().line.width * 3, 6);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArrowLineSegmentDrawing.prototype, "height", {
        get: function () {
            return Math.max(this.getDrawingTheme().line.width * 4, 10);
        },
        enumerable: true,
        configurable: true
    });
    ArrowLineSegmentDrawing.prototype.draw = function () {
        if (!this.visible) {
            return;
        }
        var points = this.cartesianPoints();
        if (this.pointsNeeded == points.length) {
            this.context.scxStrokePolyline(points, this.getDrawingTheme().line);
            this.drawArrows(points[0], points[1]);
        }
        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    };
    ArrowLineSegmentDrawing.prototype.drawArrows = function (point1, point2) {
        var radians = DrawingCalculationUtil.calculateAngleBetweenTwoPointsInRadians(point1, point2);
        this.context.beginPath();
        this.context.scxDrawArrow(point2, radians, this.width, this.height);
        this.context.scxApplyStrokeTheme(this.getDrawingTheme().line);
        this.context.stroke();
    };
    return ArrowLineSegmentDrawing;
}(LineSegmentDrawing));
export { ArrowLineSegmentDrawing };
Drawing.register(ArrowLineSegmentDrawing);
//# sourceMappingURL=ArrowLineSegmentDrawing.js.map