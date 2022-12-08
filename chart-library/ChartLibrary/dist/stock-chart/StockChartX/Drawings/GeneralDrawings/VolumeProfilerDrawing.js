import { __extends } from "tslib";
import { Drawing, DrawingDragPoint } from '../Drawing';
import { Geometry } from '../../Graphics/Geometry';
import { GestureState } from '../../Gestures/Gesture';
import { Interval } from '../../../../services/loader';
import { ChartAccessorService } from '../../../../services/chart';
import { ThemedDrawing } from '../ThemedDrawing';
import { StringUtils } from '../../../../utils';
var VolumeProfilerDrawing = (function (_super) {
    __extends(VolumeProfilerDrawing, _super);
    function VolumeProfilerDrawing(chart) {
        var _this = _super.call(this, chart) || this;
        _this.showPointsLine = false;
        _this.volumeProfilerDataRequested = false;
        _this.guid = StringUtils.guid();
        _this.subscription = ChartAccessorService.instance.getVolumeProfilerResultStream().subscribe(function (result) {
            if (result.requesterId == _this.guid) {
                _this.volumeProfilerData = result.data[0];
                _this.setYForChartPoints();
                _this.chart.setNeedsUpdate();
            }
        });
        return _this;
    }
    Object.defineProperty(VolumeProfilerDrawing, "className", {
        get: function () {
            return 'volumeProfiler';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VolumeProfilerDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 2;
        },
        enumerable: false,
        configurable: true
    });
    VolumeProfilerDrawing.prototype.preDeleteCleanUp = function () {
        _super.prototype.preDeleteCleanUp.call(this);
        ChartAccessorService.instance.cleanVolumeProfilerData(this.guid);
        this.subscription.unsubscribe();
    };
    VolumeProfilerDrawing.prototype.onRemove = function () {
        _super.prototype.onRemove.call(this);
        ChartAccessorService.instance.cleanVolumeProfilerData(this.guid);
        this.subscription.unsubscribe();
    };
    VolumeProfilerDrawing.prototype.startUserDrawing = function () {
        _super.prototype.startUserDrawing.call(this);
        this.showPointsLine = true;
    };
    VolumeProfilerDrawing.prototype._panGestureHitTest = function (point) {
        var points = this.cartesianPoints();
        if (Geometry.isPointNearPoint(point, points)) {
            return _super.prototype._panGestureHitTest.call(this, point);
        }
        return false;
    };
    VolumeProfilerDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        var point1, point2;
        if (this.volumeProfilerData) {
            var y = this.projection.yByValue(this.volumeProfilerData.pointOfControl);
            point1 = { x: Math.min(points[0].x, points[1].x), y: y };
            point2 = { x: Math.max(points[0].x, points[1].x), y: y };
            return points.length > 1 && Geometry.isPointNearLine(point, point1, point2) || Geometry.isPointNearPoint(point, points) || this.barsHitTest(point, points);
        }
    };
    VolumeProfilerDrawing.prototype.barsHitTest = function (point, points) {
        if (!this.drawnBars) {
            return false;
        }
        for (var _i = 0, _a = this.drawnBars; _i < _a.length; _i++) {
            var bars = _a[_i];
            if (Geometry.isPointInsideOrNearRect(point, {
                left: bars.left,
                top: bars.top,
                width: bars.width,
                height: bars.height
            }))
                return true;
        }
    };
    VolumeProfilerDrawing.prototype.onApplySettings = function () {
        this.requestVolumeProfilerData();
    };
    VolumeProfilerDrawing.prototype.resetDefaultSettings = function () {
        _super.prototype.resetDefaultSettings.call(this);
        this.requestVolumeProfilerData();
    };
    VolumeProfilerDrawing.prototype._handlePanGesture = function (gesture, event) {
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
                var magnetChartPoint = this._magnetChartPointIfNeeded(event.pointerPosition);
                if (this._dragPoint >= 0) {
                    this.chartPoints[this._dragPoint].moveToPoint(magnetChartPoint, this.projection);
                    this.showPointsLine = true;
                    this.preventChartPointsFromGettingOutsidePriceRange();
                    return true;
                }
                break;
            case GestureState.FINISHED:
                this._setDragPoint(DrawingDragPoint.NONE);
                this.setYForChartPoints();
                this.showPointsLine = false;
                this.ensureChartPointsDoNotOverlap();
                this.requestVolumeProfilerData();
                break;
        }
        return false;
    };
    VolumeProfilerDrawing.prototype.onMoveChartPointInUserDrawingState = function () {
        this.preventChartPointsFromGettingOutsidePriceRange();
    };
    VolumeProfilerDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints();
        if (points.length > 1) {
            if (this.showPointsLine) {
                this.context.beginPath();
                this.drawPointsLine(points);
            }
            else {
                this.context.beginPath();
                this.doInitialRequestIfNeeded();
                this.drawBox(points);
                if (this.volumeProfilerData) {
                    this.drawPointOfControlLine(points);
                    if (this.getDrawingTheme().showBars) {
                        this.drawBars(points);
                    }
                }
            }
        }
        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    };
    VolumeProfilerDrawing.prototype.preventChartPointsFromGettingOutsidePriceRange = function () {
        var points = this.cartesianPoints();
        var lastVisibleRecord = this.getLastVisibleRecord();
        var furthestPointIndex = points[0].x < points[1].x ? 1 : 0;
        var furthestRecordX = this.projection.xByDate(this.projection.dateByRecord(lastVisibleRecord));
        if (furthestRecordX < points[furthestPointIndex].x) {
            this.chartPoints[furthestPointIndex].moveToX(furthestRecordX, this.projection);
        }
    };
    VolumeProfilerDrawing.prototype.ensureChartPointsDoNotOverlap = function () {
        var points = this.cartesianPoints();
        if (points.length == 2) {
            if (points[0].x == points[1].x) {
                var currentRecord = this.projection.recordByX(points[0].x);
                var previousX = this.projection.xByRecord(currentRecord - 5);
                this.chartPoints[0].moveToX(previousX, this.projection);
                this.setYForChartPoints();
            }
        }
    };
    VolumeProfilerDrawing.prototype.getLastVisibleRecord = function () {
        if (this.chart.lastVisibleRecord !== null) {
            return Math.min(Math.ceil(this.chart.lastVisibleRecord), this.chart.recordCount - 1);
        }
    };
    VolumeProfilerDrawing.prototype.drawPointsLine = function (points) {
        var context = this.context, frame = this.chartPanel.contentFrame;
        context.moveTo(points[0].x, points[0].y);
        context.lineTo(points[1].x, points[1].y);
        context.moveTo(points[0].x, frame.top);
        context.lineTo(points[0].x, frame.bottom);
        context.moveTo(points[1].x, frame.top);
        context.lineTo(points[1].x, frame.bottom);
        context.scxStroke(this.getDrawingTheme().line);
    };
    VolumeProfilerDrawing.prototype.drawBox = function (points) {
        var context = this.context, height = Math.abs(points[0].y - points[1].y), width = Math.abs(points[0].x - points[1].x);
        context.scxFill(this.getDrawingTheme().fill);
        context.fillRect(Math.min(points[0].x, points[1].x), Math.min(points[0].y, points[1].y), width, height);
    };
    VolumeProfilerDrawing.prototype.drawPointOfControlLine = function (points) {
        var context = this.context, y = this.projection.yByValue(this.volumeProfilerData.pointOfControl);
        context.moveTo(Math.min(points[0].x, points[1].x), y);
        context.lineTo(Math.max(points[0].x, points[1].x), y);
        context.scxStroke(this.getDrawingTheme().line);
    };
    VolumeProfilerDrawing.prototype.drawBars = function (points) {
        this.drawUpDownBars(points);
    };
    VolumeProfilerDrawing.prototype.drawUpDownBars = function (points) {
        var context = this.context;
        var boxWidth = this.getDrawingTheme().boxWidth > 100 ? 100 : this.getDrawingTheme().boxWidth;
        var quarterDistanceOfTheBox = (Math.max(points[1].x, points[0].x) - Math.min(points[1].x, points[0].x)) * (boxWidth / 100);
        var maximumTotalVolumeBasedOnQuarter = this.maximumTotalVolume() / quarterDistanceOfTheBox;
        var areaDownColor = this.getDrawingTheme().downArea;
        var areaUpColor = this.getDrawingTheme().upArea;
        var volumeDownColor = this.getDrawingTheme().downVolume;
        var volumeUpColor = this.getDrawingTheme().upVolume;
        this.drawnBars = [];
        for (var i = 0; i < this.volumeProfilerData.bars.length; i++) {
            var padding = 1, height = Math.abs(this.projection.yByValue(this.volumeProfilerData.bars[i].toPrice) - this.projection.yByValue(this.volumeProfilerData.bars[i].fromPrice)) - padding, greenRectWidth = Math.floor(this.volumeProfilerData.bars[i].greenVolume / maximumTotalVolumeBasedOnQuarter), redRectWidth = Math.floor(this.volumeProfilerData.bars[i].redVolume / maximumTotalVolumeBasedOnQuarter), y = this.projection.yByValue(this.volumeProfilerData.bars[i].toPrice) - padding;
            context.scxFill(this.volumeProfilerData.bars[i].valueArea ? areaDownColor : volumeDownColor);
            context.fillRect(this.xPosForDownBars(points, greenRectWidth, redRectWidth), y + 0.5, redRectWidth, height);
            this.drawnBars.push({ left: this.xPosForDownBars(points, greenRectWidth, redRectWidth), top: y + 0.5, width: redRectWidth, height: height });
            context.scxFill(this.volumeProfilerData.bars[i].valueArea ? areaUpColor : volumeUpColor);
            context.fillRect(this.xPosForUpBards(points, greenRectWidth), y + 0.5, greenRectWidth, height);
            this.drawnBars.push({ left: this.xPosForUpBards(points, greenRectWidth), top: y + 0.5, width: greenRectWidth, height: height });
        }
    };
    VolumeProfilerDrawing.prototype.xPosForUpBards = function (points, greenRectWidth) {
        if (this.getDrawingTheme().direction == 'left') {
            return Math.min(points[0].x, points[1].x) + 0.5;
        }
        else {
            return Math.max(points[0].x, points[1].x) - greenRectWidth - 0.5;
        }
    };
    VolumeProfilerDrawing.prototype.xPosForDownBars = function (points, greenRectWidth, redRectWidth) {
        if (this.getDrawingTheme().direction == 'left') {
            return Math.min(points[0].x, points[1].x) + greenRectWidth + 0.5;
        }
        else {
            return Math.max(points[0].x, points[1].x) - redRectWidth - greenRectWidth - 0.5;
        }
    };
    VolumeProfilerDrawing.prototype.maximumTotalVolume = function () {
        var arr = [];
        for (var i = 0; i < this.volumeProfilerData.bars.length; i++) {
            arr.push(this.volumeProfilerData.bars[i].totalVolume);
        }
        return Math.max.apply(Math, arr);
    };
    VolumeProfilerDrawing.prototype.setYForChartPoints = function () {
        this.chartPoints[0].moveToY(this.getMaxPrice(this.chartPoints[0].date, this.chartPoints[1].date), this.projection);
        this.chartPoints[1].moveToY(this.getMinPrice(this.chartPoints[0].date, this.chartPoints[1].date), this.projection);
    };
    VolumeProfilerDrawing.prototype.getMaxPrice = function (date1, date2) {
        var firstDate = date1 > date2 ? date2 : date1;
        var secondDate = date1 > date2 ? date1 : date2;
        var highPrices = [];
        for (var i = 0; i <= this.chartPanel.chart.barDataSeries().date.values.length - 1; i++) {
            if (this.chartPanel.chart.barDataSeries().date.values[i] < firstDate)
                continue;
            if (this.chartPanel.chart.barDataSeries().date.values[i] > secondDate)
                break;
            highPrices.push(this.chartPanel.chart.barDataSeries().high.values[i]);
        }
        return this.projection.yByValue(Math.max.apply(Math, highPrices));
    };
    VolumeProfilerDrawing.prototype.getMinPrice = function (date1, date2) {
        var firstDate = date1 > date2 ? date2 : date1;
        var secondDate = date1 > date2 ? date1 : date2;
        var lowPrices = [];
        for (var i = 0; i <= this.chartPanel.chart.barDataSeries().date.values.length - 1; i++) {
            if (this.chartPanel.chart.barDataSeries().date.values[i] < firstDate)
                continue;
            if (this.chartPanel.chart.barDataSeries().date.values[i] > secondDate)
                break;
            lowPrices.push(this.chartPanel.chart.barDataSeries().low.values[i]);
        }
        return this.projection.yByValue(Math.min.apply(Math, lowPrices));
    };
    VolumeProfilerDrawing.prototype.requestVolumeProfilerData = function () {
        var symbol = this.chart.instrument.symbol;
        var interval = Interval.fromChartInterval(this.chart.timeInterval);
        var volumeProfileSettings = {
            rowSize: this.getDrawingTheme().rowSize,
            valueAreaVolumeRatio: this.getDrawingTheme().valueAreaPercentage * 0.01,
            rowLayout: this.getDrawingTheme().rowType
        };
        var fromDate = this.chartPoints[0].date < this.chartPoints[1].date ? this.chartPoints[0].date : this.chartPoints[1].date;
        var toDate = this.chartPoints[0].date < this.chartPoints[1].date ? this.chartPoints[1].date : this.chartPoints[0].date;
        var fromDateAsString = moment(fromDate).format('YYYY-MM-DD HH:mm:ss');
        var toDateAsString = moment(toDate).format('YYYY-MM-DD HH:mm:ss');
        var request = ChartAccessorService.instance.getVolumeProfilerRequestBuilder()
            .prepareHistoricalVolumeProfilerRequest(this.guid, symbol, interval, volumeProfileSettings, fromDateAsString, toDateAsString);
        if (!ChartAccessorService.instance.isVolumeProfilerRequested(request)) {
            ChartAccessorService.instance.requestVolumeProfilerData(request);
            this.volumeProfilerDataRequested = true;
            this.volumeProfilerData = null;
        }
    };
    VolumeProfilerDrawing.prototype._finishUserDrawing = function () {
        _super.prototype._finishUserDrawing.call(this);
        this.setYForChartPoints();
        this.preventChartPointsFromGettingOutsidePriceRange();
        this.ensureChartPointsDoNotOverlap();
        this.requestVolumeProfilerData();
        this.showPointsLine = false;
    };
    VolumeProfilerDrawing.prototype.doInitialRequestIfNeeded = function () {
        if (!this.volumeProfilerDataRequested) {
            if (this.chart && this.chart.instrument && this.chart.instrument.symbol) {
                this.requestVolumeProfilerData();
            }
        }
    };
    VolumeProfilerDrawing.prototype.canControlPointsBeManuallyChanged = function () {
        return false;
    };
    return VolumeProfilerDrawing;
}(ThemedDrawing));
export { VolumeProfilerDrawing };
Drawing.register(VolumeProfilerDrawing);
//# sourceMappingURL=VolumeProfilerDrawing.js.map