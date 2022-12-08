import { __extends } from "tslib";
import { ChartComponent } from "../Controls/ChartComponent";
import { MouseHoverGesture } from "../Gestures/MouseHoverGesture";
import { ClickGesture } from "../Gestures/ClickGesture";
import { GestureState } from '../Gestures/Gesture';
import { ChartEvent } from "../Chart";
import { ChartPoint } from "../Graphics/ChartPoint";
import { DummyCanvasContext } from "../Utils/DummyCanvasContext";
import { MeasuringUtil } from "../Utils/MeasuringUtil";
import { DrawingCalculationUtil } from "../Utils/DrawingCalculationUtil";
import { BrowserUtils } from '../../../utils';
import { PanGesture } from '../Gestures/PanGesture';
var MeasurementToolState;
(function (MeasurementToolState) {
    MeasurementToolState[MeasurementToolState["Active_Changing"] = 1] = "Active_Changing";
    MeasurementToolState[MeasurementToolState["Active_Fixed"] = 2] = "Active_Fixed";
    MeasurementToolState[MeasurementToolState["Inactive"] = 3] = "Inactive";
})(MeasurementToolState || (MeasurementToolState = {}));
var theme = {
    fillTheme: {
        fillEnabled: true,
        fillColor: 'rgba(138, 180, 180, 0.4)'
    }
};
var valuesTheme = {
    fillTheme: {
        fillEnabled: true,
        fillColor: 'rgba(107, 145, 197, 0.9)'
    }
};
var arrowTheme = {
    strokeTheme: {
        width: 2,
        strokeColor: 'black',
        lineStyle: 'dash'
    }
};
var textTheme = {
    fontFamily: 'Arial',
    fontSize: 12,
    fontStyle: 'bold',
    fillColor: 'white'
};
var MeasurementTool = (function (_super) {
    __extends(MeasurementTool, _super);
    function MeasurementTool(config) {
        var _this = _super.call(this, config) || this;
        _this._state = MeasurementToolState.Inactive;
        _this._points = [];
        _this._values = {
            barsCount: 0,
            change: 0,
            changePercentage: 0,
            period: '0',
        };
        return _this;
    }
    MeasurementTool.prototype.startMeasuring = function () {
        this._points = [];
        this._state = MeasurementToolState.Inactive;
        this._initializeGestures();
    };
    MeasurementTool.prototype.finishMeasuring = function () {
        this._state = MeasurementToolState.Inactive;
        this._resetGestures();
    };
    MeasurementTool.prototype.handleEvent = function (event) {
        return BrowserUtils.isMobile() ? this.handleMobileEvent(event) : this.handleDesktopEvent(event);
    };
    MeasurementTool.prototype.handleMobileEvent = function (event) {
        if (this._panGesture && this._panGesture.handleEvent(event)) {
            return true;
        }
        return this._mouseClickGesture.handleEvent(event) ||
            this._mouseHoverGesture.handleEvent(event);
    };
    MeasurementTool.prototype.handleDesktopEvent = function (event) {
        if (this._mouseClickGesture.handleEvent(event)) {
            return true;
        }
        else if (this._mouseHoverGesture.handleEvent(event)) {
            return true;
        }
        return false;
    };
    MeasurementTool.prototype.isMeasuringPanel = function (panel) {
        return this._chartPanel === panel;
    };
    MeasurementTool.prototype.draw = function () {
        if (this._state == MeasurementToolState.Inactive) {
            return;
        }
        var arrowBoundsRect = this._getArrowsRectangleBounds();
        var valuesBoundsRect = this._getValuesRectangleBounds(arrowBoundsRect);
        this._forceBoundsInsideChartPanel(valuesBoundsRect);
        this._drawArrowsRectangle(arrowBoundsRect);
        this._drawValuesRectangle(valuesBoundsRect);
    };
    MeasurementTool.prototype.loadState = function () {
    };
    MeasurementTool.prototype.saveState = function () {
        return null;
    };
    MeasurementTool.prototype._handleMouseClick = function (gesture, event) {
        switch (this._state) {
            case MeasurementToolState.Inactive:
                this._startInternalMeasuringProcess(event.pointerPosition);
                break;
            case MeasurementToolState.Active_Changing:
                this._state = MeasurementToolState.Active_Fixed;
                break;
            case MeasurementToolState.Active_Fixed:
                this._finishInternalMeasuringProcess();
                break;
        }
    };
    MeasurementTool.prototype._handleMouseHover = function (gesture, event) {
        if (this._state != MeasurementToolState.Active_Changing) {
            return;
        }
        var point = event.pointerPosition;
        if (!this._isMeasuringInSamePanel(point)) {
            return;
        }
        if (this._isMouseHoverValueScale(point)) {
            return;
        }
        this._updateLastPoint(point);
        this._magnetChartPointIfNeeded(this._points[1]);
        this._values = MeasuringUtil.getMeasuringValues(this._points, this._chartPanel);
        this._chartPanel.setNeedsUpdate();
    };
    MeasurementTool.prototype._handlePanGesture = function (gesture, event) {
        switch (gesture.state) {
            case GestureState.STARTED:
                this._handleMouseClick(gesture, event);
                break;
            case GestureState.CONTINUED:
                this._handleMouseHover(gesture, event);
                break;
            case GestureState.FINISHED:
                this._handleMouseClick(gesture, event);
                break;
        }
    };
    MeasurementTool.prototype._resetGestures = function () {
        this._mouseClickGesture = null;
        this._mouseHoverGesture = null;
    };
    MeasurementTool.prototype._initializeGestures = function () {
        this._mouseClickGesture = new ClickGesture({
            handler: this._handleMouseClick.bind(this),
            hitTest: function () {
                return true;
            }
        });
        this._mouseHoverGesture = new MouseHoverGesture({
            handler: this._handleMouseHover.bind(this),
            hitTest: function () {
                return true;
            }
        });
        this._panGesture = new PanGesture({
            handler: this._handlePanGesture.bind(this),
            hitTest: function () {
                return true;
            }
        });
    };
    MeasurementTool.prototype._drawValuesRectangle = function (bounds) {
        var context = this._chartPanel.context, radius = 5;
        if (bounds) {
            context.beginPath();
            context.scxRounderRectangle(bounds, radius);
            context.scxFill(valuesTheme.fillTheme);
            var padding = 5;
            var textSizes = this._getValuesTextSize();
            context.scxApplyTextTheme(textTheme);
            context.textAlign = 'left';
            context.textBaseline = 'alphabetic';
            var xOffset = bounds.left + padding;
            var yOffset = bounds.top + padding;
            var text = this._getTextThatWillBeDrawn();
            context.fillText(text.change, xOffset, yOffset + textSizes.changeSize.height);
            xOffset += textSizes.changeSize.width + padding;
            context.fillText(text.changePercentage, xOffset, yOffset + textSizes.changePercentageSize.height);
            xOffset = bounds.left + padding;
            yOffset += textSizes.changePercentageSize.height + padding;
            context.fillText(text.bars, xOffset, yOffset + textSizes.barsSize.height);
            xOffset += textSizes.barsSize.width + padding;
            context.fillText(text.period, xOffset, yOffset + textSizes.periodSize.height);
        }
    };
    MeasurementTool.prototype._drawArrowsRectangle = function (bounds) {
        if (bounds) {
            var context = this._chartPanel.context;
            context.beginPath();
            var leftPoint = {
                x: bounds.left,
                y: bounds.top + (bounds.height / 2)
            };
            var rightPoint = {
                x: bounds.left + bounds.width,
                y: bounds.top + (bounds.height / 2)
            };
            context.scxDrawAntiAliasingLine(leftPoint, rightPoint);
            var topPoint = {
                x: bounds.left + (bounds.width / 2),
                y: bounds.top
            };
            var bottomPoint = {
                x: bounds.left + (bounds.width / 2),
                y: bounds.top + bounds.height
            };
            context.scxDrawAntiAliasingLine(topPoint, bottomPoint);
            context.scxStroke(arrowTheme.strokeTheme);
            this._drawArrows(context, bounds);
            context.rect(bounds.left, bounds.top, bounds.width, bounds.height);
            context.scxFill(theme.fillTheme);
        }
    };
    MeasurementTool.prototype._drawArrows = function (context, bounds) {
        var radius = 10, point = null, angle = 0;
        var leftArrow = this._points[1].date < this._points[0].date;
        if (leftArrow) {
            point = { x: bounds.left, y: bounds.top + (bounds.height / 2) };
            angle = 180;
        }
        else {
            point = { x: bounds.left + bounds.width, y: bounds.top + (bounds.height / 2) };
            angle = 0;
        }
        context.scxDrawArrow(point, DrawingCalculationUtil.convertDegreeToRadian(angle), radius, radius);
        context.scxStroke(arrowTheme.strokeTheme);
        var bottomArrow = this._points[1].value < this._points[0].value;
        if (bottomArrow) {
            point = { x: bounds.left + (bounds.width / 2), y: bounds.top + bounds.height };
            angle = -90;
        }
        else {
            point = { x: bounds.left + (bounds.width / 2), y: bounds.top };
            angle = 90;
        }
        context.scxDrawArrow(point, DrawingCalculationUtil.convertDegreeToRadian(angle), radius, radius);
        context.scxStroke(arrowTheme.strokeTheme);
    };
    MeasurementTool.prototype._updateLastPoint = function (point) {
        this._points[1].moveToPoint(this._getPointCoordinationBasedOnChartPanel(point), this._chartPanel.projection);
    };
    MeasurementTool.prototype._getArrowsRectangleBounds = function () {
        var point1 = this._points[0].toPoint(this._chartPanel.projection);
        var point2 = this._points[1].toPoint(this._chartPanel.projection);
        var x1 = point1.x;
        var x2 = point2.x;
        var y1 = point1.y;
        var y2 = point2.y;
        return {
            left: x2 < x1 ? x2 : x1,
            top: y2 < y1 ? y2 : y1,
            height: Math.abs(y1 - y2),
            width: Math.abs(x1 - x2)
        };
    };
    MeasurementTool.prototype._getValuesRectangleBounds = function (arrowRectangleBounds) {
        var sizes = this._getValuesTextSize();
        var padding = 5;
        var firstRowWidth = sizes.changeSize.width + sizes.changePercentageSize.width, secondRowWidth = sizes.barsSize.width + sizes.periodSize.width, width = Math.max(firstRowWidth, secondRowWidth) + (3 * padding), height = sizes.changePercentageSize.height + sizes.periodSize.height + (4 * padding), left = (arrowRectangleBounds.left + (arrowRectangleBounds.width / 2) - (width / 2));
        var reversed = this._points[1].value < this._points[0].value, reversedLocation = arrowRectangleBounds.top + arrowRectangleBounds.height + padding, normalLocation = arrowRectangleBounds.top - height - padding;
        var top = reversed ? reversedLocation : normalLocation;
        return {
            left: left,
            top: top,
            height: height,
            width: width
        };
    };
    MeasurementTool.prototype._forceBoundsInsideChartPanel = function (bounds) {
        if (bounds.top < 0) {
            bounds.top = 0;
        }
        else if (bounds.top + bounds.height > this._chartPanel.contentFrame.height) {
            bounds.top -= bounds.top + bounds.height - this._chartPanel.contentFrame.height;
        }
    };
    MeasurementTool.prototype._startInternalMeasuringProcess = function (point) {
        this._updateChartPanel(point.y);
        this._state = MeasurementToolState.Active_Changing;
        point = this._getPointCoordinationBasedOnChartPanel(point);
        var date = this._chartPanel.projection.dateByX(point.x), value = this._chartPanel.projection.valueByY(point.y);
        this._points.push(new ChartPoint({
            date: date,
            value: value
        }));
        this._points.push(new ChartPoint({
            date: date,
            value: value
        }));
    };
    MeasurementTool.prototype._finishInternalMeasuringProcess = function () {
        this.finishMeasuring();
        this.chart.finishMeasuring();
        this.chart.fireValueChanged(ChartEvent.USER_MEASURING_FINISHED);
    };
    MeasurementTool.prototype._getValuesTextSize = function () {
        var text = this._getTextThatWillBeDrawn();
        return {
            changeSize: DummyCanvasContext.measureText(text.change, textTheme),
            changePercentageSize: DummyCanvasContext.measureText(text.changePercentage, textTheme),
            barsSize: DummyCanvasContext.measureText(text.bars, textTheme),
            periodSize: DummyCanvasContext.measureText(text.period, textTheme)
        };
    };
    MeasurementTool.prototype._getTextThatWillBeDrawn = function () {
        var change = this._values.change.toFixed(2);
        var changePercentage = '(' + this._values.changePercentage.toFixed(2) + '%)';
        var bars = this._values.barsCount + ' bars, ';
        var period = this._values.period;
        return {
            change: change,
            changePercentage: changePercentage,
            bars: bars,
            period: period
        };
    };
    MeasurementTool.prototype._updateChartPanel = function (y) {
        this._chartPanel = this.chart.chartPanelsContainer.findPanelAt(y);
    };
    MeasurementTool.prototype._isMeasuringInSamePanel = function (point) {
        return this.chart.chartPanelsContainer.findPanelAt(point.y) === this._chartPanel;
    };
    MeasurementTool.prototype._isMouseHoverValueScale = function (point) {
        return this._chartPanel.valueScale.rightFrame.left <= point.x;
    };
    MeasurementTool.prototype._getPointCoordinationBasedOnChartPanel = function (point) {
        if (this._chartPanel !== this.chart.mainPanel) {
            point.y -= this._chartPanel.contentFrame.top;
        }
        return point;
    };
    MeasurementTool.prototype._magnetChartPointIfNeeded = function (point) {
        if (this.chart.magnetRatio == 0) {
            return point;
        }
        if (this._chartPanel !== this.chart.mainPanel) {
            return point;
        }
        var dataSeries = this.chart.barDataSeries();
        var hoveredRecord = this.chart.hoveredRecord;
        if (hoveredRecord >= dataSeries.open.length) {
            return point;
        }
        var open = dataSeries.open.valueAtIndex(hoveredRecord), high = dataSeries.high.valueAtIndex(hoveredRecord), low = dataSeries.low.valueAtIndex(hoveredRecord), close = dataSeries.close.valueAtIndex(hoveredRecord);
        var fields = [open, high, low, close];
        var hoveredRecordX = this._chartPanel.projection.xByRecord(hoveredRecord);
        var pointY = this._chartPanel.projection.yByValue(point.value);
        var updatedPoint = { x: hoveredRecordX, y: pointY };
        var smallestDistance = this.chart.magnetRatio * 25;
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
            var field = fields_1[_i];
            var fieldY = this._chartPanel.projection.yByValue(field);
            if (Math.abs(pointY - fieldY) <= smallestDistance) {
                smallestDistance = Math.abs(pointY - fieldY);
                updatedPoint.y = fieldY;
            }
        }
        point.moveToPoint(updatedPoint, this._chartPanel.projection);
    };
    return MeasurementTool;
}(ChartComponent));
export { MeasurementTool };
//# sourceMappingURL=MeasurementTool.js.map