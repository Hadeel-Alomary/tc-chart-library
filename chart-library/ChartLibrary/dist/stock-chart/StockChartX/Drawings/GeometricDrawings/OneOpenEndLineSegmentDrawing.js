import { __extends } from "tslib";
import { Drawing } from "../Drawing";
import { Geometry } from "../../Graphics/Geometry";
import { LineSegmentDrawing } from "./LineSegmentDrawing";
import { BrowserUtils } from '../../../../utils';
var OneOpenEndLineSegmentDrawing = (function (_super) {
    __extends(OneOpenEndLineSegmentDrawing, _super);
    function OneOpenEndLineSegmentDrawing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.endPoint = { x: 0, y: 0 };
        return _this;
    }
    Object.defineProperty(OneOpenEndLineSegmentDrawing, "className", {
        get: function () {
            return 'oneOpenEndLineSegment';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OneOpenEndLineSegmentDrawing.prototype, "hasTooltip", {
        get: function () {
            return BrowserUtils.isDesktop();
        },
        enumerable: false,
        configurable: true
    });
    OneOpenEndLineSegmentDrawing.prototype.hitTest = function (point) {
        if (_super.prototype.hitTest.call(this, point))
            return true;
        if (this.cartesianPoints().length < this.pointsNeeded) {
            return false;
        }
        return Geometry.isPointNearPolyline(point, [this.cartesianPoint(1), this.endPoint]);
    };
    OneOpenEndLineSegmentDrawing.prototype.draw = function () {
        if (!this.visible) {
            return;
        }
        if (this.chartPoints.length > 1) {
            _super.prototype.draw.call(this);
            this.endPoint = this.getExtendedLineEndPoint(this.cartesianPoint(0), this.cartesianPoint(1));
            this.context.scxStrokePolyline([this.cartesianPoint(1), this.endPoint], this.getDrawingTheme().line);
        }
        else {
            if (this.selected) {
                this._drawSelectionMarkers(this.cartesianPoints());
            }
        }
    };
    OneOpenEndLineSegmentDrawing.prototype.getExtendedLineEndPoint = function (point1, point2) {
        var deltaX = point2.x - point1.x;
        var deltaY = point2.y - point1.y;
        var x = point2.x;
        var y = point2.y;
        var panelFrame = this.chartPanel.contentFrame;
        if (deltaX < 0) {
            x = panelFrame.left;
        }
        else if (deltaX > 0) {
            x = panelFrame.right;
        }
        if (deltaX == 0) {
            if (deltaY > 0) {
                y = panelFrame.bottom;
            }
            else {
                y = panelFrame.top;
            }
        }
        else {
            y = (x - point2.x) / deltaX * deltaY + point2.y;
            if (y < panelFrame.top || y > panelFrame.bottom) {
                if (y > panelFrame.bottom) {
                    y = panelFrame.bottom;
                }
                else if (y < panelFrame.top) {
                    y = panelFrame.top;
                }
                if (deltaY !== 0) {
                    x = (y - point2.y) / deltaY * deltaX + point2.x;
                }
            }
        }
        return { x: x, y: y };
    };
    OneOpenEndLineSegmentDrawing.prototype.canAlertExtendRight = function () {
        return this.chartPoints[1].date > this.chartPoints[0].date;
    };
    OneOpenEndLineSegmentDrawing.prototype.canAlertExtendLeft = function () {
        return this.chartPoints[0].date >= this.chartPoints[1].date;
    };
    return OneOpenEndLineSegmentDrawing;
}(LineSegmentDrawing));
export { OneOpenEndLineSegmentDrawing };
Drawing.register(OneOpenEndLineSegmentDrawing);
//# sourceMappingURL=OneOpenEndLineSegmentDrawing.js.map