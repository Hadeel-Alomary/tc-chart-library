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
import { DummyCanvasContext } from "../../Utils/DummyCanvasContext";
import { Geometry } from "../../Graphics/Geometry";
import { GestureState } from "../../Gestures/Gesture";
import { ThemedDrawing } from '../ThemedDrawing';
import { DrawingTextHorizontalPosition, DrawingTextVerticalPosition } from '../DrawingTextPosition';
import { DrawingLevelsFormatType } from '../DrawingLevelsFormatType';
var PriceCalculationDrawing = (function (_super) {
    __extends(PriceCalculationDrawing, _super);
    function PriceCalculationDrawing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.priceDiff = 0;
        return _this;
    }
    Object.defineProperty(PriceCalculationDrawing, "className", {
        get: function () {
            return 'priceCalculation';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PriceCalculationDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 2;
        },
        enumerable: false,
        configurable: true
    });
    PriceCalculationDrawing.prototype.getTextHorizontalPositionAlignment = function () {
        return this.getDrawingTheme().text.textAlign;
    };
    PriceCalculationDrawing.prototype.getTextVerticalPositionAlignment = function () {
        return this.getDrawingTheme().text.textVerticalAlign;
    };
    PriceCalculationDrawing.prototype.hitTest = function (point) {
        if (this.cartesianPoints().length < this.pointsNeeded) {
            return false;
        }
        return this.calculatePriceHitTest(point);
    };
    PriceCalculationDrawing.prototype.calculatePriceHitTest = function (point) {
        var points = this._markerPoints();
        return (Geometry.isPointNearLine(point, points.firstLineStartPoint, points.firstLineEndPoint)
            || Geometry.isPointNearLine(point, points.secondLineStartPoint, points.secondLineEndPoint)
            || Geometry.isPointNearLine(point, points.secondLineMidPoint, points.firstLineMidPoint));
    };
    PriceCalculationDrawing.prototype._handlePanGesture = function (gesture, event) {
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
    PriceCalculationDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints();
        if (points.length > 1) {
            this.secondYPoint = this._calculateSecondYPoint(points);
            this.chartPoints[1].moveToY(this.secondYPoint, this.projection);
            this.drawPriceCalculation();
            this.drawPriceCalculationText();
        }
        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    };
    PriceCalculationDrawing.prototype.drawPriceCalculation = function () {
        var points = this._markerPoints();
        this.context.scxStrokePolyline([points.firstLineStartPoint, points.firstLineEndPoint], this.getDrawingTheme().line);
        this.context.scxStrokePolyline([points.secondLineStartPoint, points.secondLineEndPoint], this.getDrawingTheme().line);
        this.context.scxStrokePolyline([points.secondLineMidPoint, points.firstLineMidPoint], this.getDrawingTheme().line);
    };
    PriceCalculationDrawing.prototype.drawPriceCalculationText = function () {
        var points = this._markerPoints(), price1 = this.projection.valueByY(points.firstLineStartPoint.y), price2 = this.projection.valueByY(points.secondLineStartPoint.y), priceChange = price2 - price1, priceText = this.formatLevelText(priceChange, DrawingLevelsFormatType.PRICE), priceTextSize = DummyCanvasContext.measureText(priceText, this.getDrawingTheme().text), changePercentText = ((priceChange / price1) * 100).toFixed(2) + ' ' + '%', textDrawingPoint = {
            x: this.getTextHorizontalPosition(priceTextSize, points.midPoint),
            y: this.getTextVerticalPosition(priceTextSize)
        };
        this.context.scxApplyTextTheme(this.getDrawingTheme().text);
        this.context.fillText(priceText, textDrawingPoint.x, textDrawingPoint.y);
        this.context.fillText(changePercentText, textDrawingPoint.x, textDrawingPoint.y + priceTextSize.height);
    };
    PriceCalculationDrawing.prototype.getTextHorizontalPosition = function (textSize, midPoint) {
        var position = 0, padding = 10;
        switch (this.getTextHorizontalPositionAlignment()) {
            case DrawingTextHorizontalPosition.RIGHT:
                position = midPoint.x + textSize.width + padding;
                break;
            case DrawingTextHorizontalPosition.CENTER:
                position = midPoint.x;
                break;
            case DrawingTextHorizontalPosition.LEFT:
                position = midPoint.x - textSize.width - padding;
                break;
            default:
                throw new Error("Unknown horizontal text position type: " + this.getTextHorizontalPositionAlignment());
        }
        return position;
    };
    PriceCalculationDrawing.prototype.getTextVerticalPosition = function (textSize) {
        var position = 0, textOffset = 8, points = this._markerPoints();
        switch (this.getTextVerticalPositionAlignment()) {
            case DrawingTextVerticalPosition.TOP:
                var isOnTopSide = points.firstLineMidPoint.y > points.secondLineMidPoint.y;
                position = isOnTopSide ? points.secondLineMidPoint.y + textSize.height : points.firstLineMidPoint.y + textSize.height;
                break;
            case DrawingTextVerticalPosition.MIDDLE:
                position = points.midPoint.y;
                break;
            case DrawingTextVerticalPosition.BOTTOM:
                var isOnBottomSide = points.firstLineMidPoint.y < points.secondLineMidPoint.y;
                position = isOnBottomSide ? points.secondLineMidPoint.y - textSize.height - textOffset : points.firstLineMidPoint.y - textSize.height - textOffset;
                break;
            default:
                throw new Error("Unknown vertical text position type: " + this.getTextVerticalPositionAlignment());
        }
        return position;
    };
    PriceCalculationDrawing.prototype._markerPoints = function () {
        var points = this.cartesianPoints();
        if (points.length === 0)
            return null;
        var midXAxis = (points[1].x + points[0].x) / 2, midYAxis = (this.secondYPoint + points[0].y) / 2;
        return {
            firstLineStartPoint: { x: points[0].x, y: points[0].y },
            firstLineEndPoint: { x: points[1].x, y: points[0].y },
            firstLineMidPoint: { x: midXAxis, y: points[0].y },
            secondLineStartPoint: { x: points[1].x, y: this.secondYPoint },
            secondLineEndPoint: { x: points[0].x, y: this.secondYPoint },
            secondLineMidPoint: { x: midXAxis, y: this.secondYPoint },
            midPoint: { x: midXAxis, y: midYAxis }
        };
    };
    PriceCalculationDrawing.prototype._calculateSecondYPoint = function (points) {
        var yValue;
        if (this._dragPoint === DrawingDragPoint.ALL) {
            if (this.priceDiff === 0) {
                this.priceDiff = this.projection.valueByY(points[1].y) - this.projection.valueByY(points[0].y);
            }
            var secondPointsPrice = this.priceDiff + this.projection.valueByY(points[0].y);
            yValue = this.projection.yByValue(secondPointsPrice);
        }
        else {
            this.priceDiff = 0;
            yValue = points[1].y;
        }
        return yValue;
    };
    return PriceCalculationDrawing;
}(ThemedDrawing));
export { PriceCalculationDrawing };
Drawing.register(PriceCalculationDrawing);
//# sourceMappingURL=PriceCalculationDrawing.js.map