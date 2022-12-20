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
import { Drawing } from "../Drawing";
import { Geometry } from "../../Graphics/Geometry";
import { OneOpenEndLineSegmentDrawing } from "./OneOpenEndLineSegmentDrawing";
var TwoOpenEndLineSegmentDrawing = (function (_super) {
    __extends(TwoOpenEndLineSegmentDrawing, _super);
    function TwoOpenEndLineSegmentDrawing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.secondEndPoint = { x: 0, y: 0 };
        return _this;
    }
    Object.defineProperty(TwoOpenEndLineSegmentDrawing, "className", {
        get: function () {
            return 'twoOpenEndLineSegment';
        },
        enumerable: true,
        configurable: true
    });
    TwoOpenEndLineSegmentDrawing.prototype.hitTest = function (point) {
        if (_super.prototype.hitTest.call(this, point))
            return true;
        if (this.cartesianPoints().length < this.pointsNeeded) {
            return false;
        }
        return Geometry.isPointNearPolyline(point, [this.cartesianPoint(0), this.secondEndPoint]);
    };
    TwoOpenEndLineSegmentDrawing.prototype.draw = function () {
        if (!this.visible) {
            return;
        }
        if (this.chartPoints.length > 1) {
            _super.prototype.draw.call(this);
            this.secondEndPoint = this.getExtendedLineEndPoint(this.cartesianPoint(1), this.cartesianPoint(0));
            this.context.scxStrokePolyline([this.cartesianPoint(0), this.secondEndPoint], this.getDrawingTheme().line);
        }
        else {
            if (this.selected) {
                this._drawSelectionMarkers(this.cartesianPoints());
            }
        }
    };
    TwoOpenEndLineSegmentDrawing.prototype.canAlertExtendRight = function () {
        return true;
    };
    TwoOpenEndLineSegmentDrawing.prototype.canAlertExtendLeft = function () {
        return true;
    };
    return TwoOpenEndLineSegmentDrawing;
}(OneOpenEndLineSegmentDrawing));
export { TwoOpenEndLineSegmentDrawing };
Drawing.register(TwoOpenEndLineSegmentDrawing);
//# sourceMappingURL=TwoOpenEndLineSegmentDrawing.js.map