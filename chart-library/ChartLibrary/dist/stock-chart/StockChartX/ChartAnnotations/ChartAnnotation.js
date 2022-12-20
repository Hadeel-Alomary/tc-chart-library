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
import { ChartPanelObject } from '../ChartPanels/ChartPanelObject';
import { GestureArray } from '../Gestures/GestureArray';
import { GestureState } from '../Gestures/Gesture';
import { ClickGesture } from '../Gestures/ClickGesture';
import { MouseHoverGesture } from '../Gestures/MouseHoverGesture';
export var ChartAnnotationType;
(function (ChartAnnotationType) {
    ChartAnnotationType[ChartAnnotationType["Split"] = 1] = "Split";
    ChartAnnotationType[ChartAnnotationType["TradingOrder"] = 2] = "TradingOrder";
    ChartAnnotationType[ChartAnnotationType["News"] = 3] = "News";
})(ChartAnnotationType || (ChartAnnotationType = {}));
export var ChartAnnotationEvents = {
    CLICK_EVENT: 'Click event',
    HOVER_EVENT: 'Hover event'
};
var ChartAnnotation = (function (_super) {
    __extends(ChartAnnotation, _super);
    function ChartAnnotation(chart, config) {
        var _this = _super.call(this, chart, config) || this;
        _this.offset = 0;
        _this.setInitialState(config);
        _this.initGesture();
        return _this;
    }
    ChartAnnotation.prototype.getAnnotationType = function () {
        return this.type;
    };
    ChartAnnotation.prototype.setOffset = function (offset) {
        this.offset = offset;
    };
    ChartAnnotation.prototype.handleEvent = function (event) {
        return this.gestures.handleEvent(event);
    };
    ChartAnnotation.prototype.setPanel = function (panel) {
        this.chartPanel = panel;
    };
    ChartAnnotation.prototype.isBelowCandle = function () {
        return this.belowCandle;
    };
    ChartAnnotation.prototype.getPositionIndex = function () {
        return this.getRecord();
    };
    ChartAnnotation.prototype.getCandleHigh = function () {
        var priceData = this.getPriceData();
        switch (this.chart.priceStyleKind) {
            case 'line':
            case 'mountain':
                return priceData.close;
            case 'coloredBar':
            case 'candle':
            case 'hollowCandle':
            case 'renko':
            case 'heikinAshi':
                return priceData.high;
            default:
                throw new Error('unknown price style kind ' + this.chart.priceStyleKind);
        }
    };
    ChartAnnotation.prototype.getCandleLow = function () {
        var priceData = this.getPriceData();
        switch (this.chart.priceStyleKind) {
            case 'line':
            case 'mountain':
                return priceData.close;
            case 'coloredBar':
            case 'candle':
            case 'hollowCandle':
            case 'renko':
            case 'heikinAshi':
                return priceData.low;
            default:
                throw new Error('unknown price style kind ' + this.chart.priceStyleKind);
        }
    };
    ChartAnnotation.prototype.handleMouseHoverGesture = function (gesture, event) {
        switch (gesture.state) {
            case GestureState.STARTED:
            case GestureState.CONTINUED:
                this.chartPanel.rootDiv.addClass('chart-annotation-mouse-hover');
                break;
            case GestureState.FINISHED:
                this.chartPanel.rootDiv.removeClass('chart-annotation-mouse-hover');
                break;
        }
    };
    ChartAnnotation.prototype.getRecord = function () {
        return this.projection.recordByDate(new Date(this.date));
    };
    ChartAnnotation.prototype.setInitialState = function (config) {
        if (!config) {
            throw new Error('cannot find config for chart annotation');
        }
        if (!config.date) {
            throw new Error('cannot find date for chart annotation');
        }
        this.date = config.date;
        this.time = new Date(this.date).getTime();
        if (!config.type) {
            throw new Error('cannot find type for chart annotation');
        }
        this.type = config.type;
        this.belowCandle = config.belowCandle;
    };
    ChartAnnotation.prototype.initGesture = function () {
        this.gestures = new GestureArray([
            new ClickGesture({
                handler: this.handleMouseClickGesture.bind(this),
                hitTest: this.hitTest.bind(this)
            }),
            new MouseHoverGesture({
                handler: this.handleMouseHoverGesture.bind(this),
                hitTest: this.hitTest.bind(this)
            })
        ], this);
    };
    ChartAnnotation.prototype.getPriceData = function () {
        var record = this.getRecord();
        switch (this.chart.priceStyleKind) {
            case 'line':
            case 'mountain':
            case 'coloredBar':
            case 'candle':
            case 'hollowCandle':
                var chartBarDataSeries = this.chart.barDataSeries();
                return {
                    open: chartBarDataSeries.open.valueAtIndex(record),
                    high: chartBarDataSeries.high.valueAtIndex(record),
                    low: chartBarDataSeries.low.valueAtIndex(record),
                    close: chartBarDataSeries.close.valueAtIndex(record)
                };
                break;
            case 'renko':
                return {
                    open: this.chart.dataManager.getDataSeries('.renko.open').valueAtIndex(record),
                    high: this.chart.dataManager.getDataSeries('.renko.high').valueAtIndex(record),
                    low: this.chart.dataManager.getDataSeries('.renko.low').valueAtIndex(record),
                    close: this.chart.dataManager.getDataSeries('.renko.close').valueAtIndex(record)
                };
                break;
            case 'heikinAshi':
                return {
                    open: this.chart.dataManager.getDataSeries('.heikin_ashi.open').valueAtIndex(record),
                    high: this.chart.dataManager.getDataSeries('.heikin_ashi.high').valueAtIndex(record),
                    low: this.chart.dataManager.getDataSeries('.heikin_ashi.low').valueAtIndex(record),
                    close: this.chart.dataManager.getDataSeries('.heikin_ashi.close').valueAtIndex(record)
                };
                break;
            default:
                throw new Error('unknown price style kind ' + this.chart.priceStyleKind);
        }
    };
    return ChartAnnotation;
}(ChartPanelObject));
export { ChartAnnotation };
//# sourceMappingURL=ChartAnnotation.js.map