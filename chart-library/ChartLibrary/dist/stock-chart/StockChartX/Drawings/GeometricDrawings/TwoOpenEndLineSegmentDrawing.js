import { __extends } from "tslib";
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
        enumerable: false,
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