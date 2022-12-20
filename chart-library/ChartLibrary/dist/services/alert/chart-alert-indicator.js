import { IndicatorHelper } from '../../stock-chart/StockChartX/Indicators/IndicatorHelper';
var ChartAlertIndicator = (function () {
    function ChartAlertIndicator(indicatorType, selectedIndicatorField, indicatorParameters, indicatorId) {
        this.indicatorType = indicatorType;
        this.selectedIndicatorField = selectedIndicatorField;
        this.indicatorParameters = indicatorParameters;
        this.indicatorId = indicatorId;
    }
    Object.defineProperty(ChartAlertIndicator.prototype, "name", {
        get: function () {
            if (this.indicatorType == ChartAlertIndicator.CLOSE_INDICATOR_TYPE) {
                return 'CLOSE';
            }
            return IndicatorHelper.indicatorToString(this.indicatorType) + ' ' + this.indicatorParametersString;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartAlertIndicator.prototype, "indicatorParametersString", {
        get: function () {
            var parameters = this.indicatorParameters;
            return parameters.length > 0 ? ("(" + parameters.join(', ') + ")").replace(new RegExp('\\$', 'g'), '') : '';
        },
        enumerable: true,
        configurable: true
    });
    ChartAlertIndicator.CLOSE_INDICATOR_TYPE = -1;
    ChartAlertIndicator.CLOSE_INDICATOR_ID = '';
    return ChartAlertIndicator;
}());
export { ChartAlertIndicator };
//# sourceMappingURL=chart-alert-indicator.js.map