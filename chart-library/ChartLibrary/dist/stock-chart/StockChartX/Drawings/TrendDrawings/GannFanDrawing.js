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
import { FibonacciDrawingBase } from '../FibonacciDrawings/FibonacciDrawingBase';
export var DrawingEvent;
(function (DrawingEvent) {
    DrawingEvent.ANGLES_CHANGED = 'drawingAnglesChanged';
    DrawingEvent.SHOW_ANGLE_LINE_CHANGED = 'drawingShowAngleLineChanged';
})(DrawingEvent || (DrawingEvent = {}));
var GannFanDrawing = (function (_super) {
    __extends(GannFanDrawing, _super);
    function GannFanDrawing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.angles = [1 / 8, 1 / 4, 1 / 3, 1 / 2, 1 / 1, 2 / 1, 3 / 1, 4 / 1, 8 / 1];
        return _this;
    }
    Object.defineProperty(GannFanDrawing, "className", {
        get: function () {
            return 'gannFan';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GannFanDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GannFanDrawing.prototype, "anglesText", {
        get: function () {
            return ['8/1', '4/1', '3/1', '2/1', '1/1', '1/2', '1/3', '1/4', '1/8'];
        },
        enumerable: true,
        configurable: true
    });
    GannFanDrawing.prototype.bounds = function () {
        var points = this.cartesianPoints();
        if (points.length < 2)
            return null;
        return {
            left: Math.min(points[0].x, points[1].x),
            top: Math.max(points[0].y, points[1].y),
            width: Math.abs(points[1].x - points[0].x),
            height: Math.abs(points[1].y - points[0].y)
        };
    };
    GannFanDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        if (points.length < this.pointsNeeded)
            return false;
        var pointsOfLines = this.pointsOfLines;
        for (var i = 0; i < pointsOfLines.length; i++) {
            var startPointOfLine = pointsOfLines[i][0];
            var endPointOfLine = pointsOfLines[i][2];
            if (Geometry.isPointNearLine(point, startPointOfLine, endPointOfLine))
                return true;
        }
        return false;
    };
    GannFanDrawing.prototype._handlePanGesture = function (gesture, event) {
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
    GannFanDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints();
        if (points.length === 0)
            return;
        if (points.length > 1) {
            var pointsOfLines = this.pointsOfLines = this._calculateLinesPoints(points);
            this.numberOfLastTwoLineDrawn = [];
            var numberOfDeletedLine = 0;
            for (var lineNumber = 0; lineNumber < pointsOfLines.length; lineNumber++) {
                if (!this._isLevelVisible(this.levels[lineNumber])) {
                    numberOfDeletedLine++;
                    continue;
                }
                this.drawLine(lineNumber, pointsOfLines);
                if (this.getDrawingTheme().showLevelValues) {
                    this.drawText(lineNumber, pointsOfLines, points);
                }
                if (this.getDrawingTheme().showLevelBackgrounds) {
                    this.fillDrawing(lineNumber, pointsOfLines, points, numberOfDeletedLine);
                }
            }
        }
        if (this.selected)
            this._drawSelectionMarkers(points);
    };
    GannFanDrawing.prototype.drawLine = function (lineNumber, pointsOfLines) {
        var startPointOfLine = { x: pointsOfLines[lineNumber][0].x, y: pointsOfLines[lineNumber][0].y };
        var endPointOfLine = { x: pointsOfLines[lineNumber][2].x, y: pointsOfLines[lineNumber][2].y };
        var themeLevel = this.levels[lineNumber].theme;
        this.context.beginPath();
        this.context.moveTo(startPointOfLine.x, startPointOfLine.y);
        this.context.lineTo(endPointOfLine.x, endPointOfLine.y);
        this.context.scxStroke(themeLevel.line);
        this.numberOfLastTwoLineDrawn.push(lineNumber);
    };
    GannFanDrawing.prototype.drawText = function (lineNumber, pointsOfLines, points) {
        var centerPointOfLine = { x: pointsOfLines[lineNumber][1].x, y: pointsOfLines[lineNumber][1].y };
        var horizontalText_X = this.calculate_X_ForHorizontalTextUsing_Y_OfLineCenterPoint(centerPointOfLine.y, points);
        this.context.beginPath();
        this.context.scxApplyTextTheme(this.levels[lineNumber].theme.text);
        if (lineNumber < 5) {
            this.context.fillText(this.anglesText[lineNumber].toString(), points[1].x, centerPointOfLine.y);
        }
        else {
            this.context.fillText(this.anglesText[lineNumber].toString(), horizontalText_X, points[1].y);
        }
    };
    GannFanDrawing.prototype.fillDrawing = function (lineNumber, pointsOfLines, points, numberOfDeletedLine) {
        if (lineNumber <= 5) {
            this.fillAboveCenterLines(pointsOfLines, points);
        }
        else {
            this.fillBelowCenterLines(pointsOfLines, points, numberOfDeletedLine);
        }
    };
    GannFanDrawing.prototype.fillAboveCenterLines = function (pointsOfLines, points) {
        var assemblyPoint = points[0];
        if (this.numberOfLastTwoLineDrawn.length > 1) {
            var firstLine = pointsOfLines[this.numberOfLastTwoLineDrawn[0]][2];
            var secondLine = pointsOfLines[this.numberOfLastTwoLineDrawn[1]][2];
            this.context.scxFillPolyLine([assemblyPoint, firstLine, secondLine], this.levels[this.numberOfLastTwoLineDrawn[0]].theme.fill);
            this.numberOfLastTwoLineDrawn.shift();
        }
    };
    GannFanDrawing.prototype.fillBelowCenterLines = function (pointsOfLines, points, numberOfDeletedLine) {
        var assemblyPoint = points[0];
        var firstLine = pointsOfLines[this.numberOfLastTwoLineDrawn[0]][2];
        var secondLine = pointsOfLines[this.numberOfLastTwoLineDrawn[1]][2];
        if (!this._isLevelVisible(this.levels[5]) && this.numberOfLastTwoLineDrawn[1] == this.numberOfLastTwoLineDrawn[0] + numberOfDeletedLine + 1) {
            this.context.scxFillPolyLine([assemblyPoint, firstLine, secondLine], this.levels[this.numberOfLastTwoLineDrawn[0]].theme.fill);
        }
        this.context.scxFillPolyLine([assemblyPoint, firstLine, secondLine], this.levels[this.numberOfLastTwoLineDrawn[1]].theme.fill);
        this.numberOfLastTwoLineDrawn.shift();
    };
    GannFanDrawing.prototype.calculate_X_ForHorizontalTextUsing_Y_OfLineCenterPoint = function (centerPoint_y, points) {
        var slope = (centerPoint_y - points[0].y) / (points[1].x - points[0].x);
        return ((points[1].y - points[0].y) / slope) + points[0].x;
    };
    GannFanDrawing.prototype._calculateLinesPoints = function (points) {
        var assemblyPoint = { x: points[0].x, y: points[0].y };
        var isLeft = points[0].x > points[1].x;
        var destinationX = isLeft ? this.chartPanel.contentFrame.left : this.chartPanel.contentFrame.right;
        var drawingPoints = [];
        for (var _i = 0, _a = this.angles; _i < _a.length; _i++) {
            var angle = _a[_i];
            var centerPoint_X = points[1].x;
            var centerPoint_Y = assemblyPoint.y - (Math.round(assemblyPoint.y - points[1].y) * angle);
            var endPoint_X = destinationX;
            var endPoint_Y = Math.round(assemblyPoint.y + (destinationX - assemblyPoint.x) * (centerPoint_Y - assemblyPoint.y) / (centerPoint_X - assemblyPoint.x));
            drawingPoints.push([{ x: assemblyPoint.x, y: assemblyPoint.y }, { x: centerPoint_X, y: centerPoint_Y }, {
                    x: endPoint_X,
                    y: endPoint_Y
                }]);
        }
        return drawingPoints;
    };
    return GannFanDrawing;
}(FibonacciDrawingBase));
export { GannFanDrawing };
Drawing.register(GannFanDrawing);
//# sourceMappingURL=GannFanDrawing.js.map