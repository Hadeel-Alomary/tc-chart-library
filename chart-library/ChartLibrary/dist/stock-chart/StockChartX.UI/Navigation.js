import { HtmlLoader } from "./HtmlLoader";
var ChartNavigation = (function () {
    function ChartNavigation(config) {
        var _this = this;
        HtmlLoader.getView('Navigation.html', function (html) {
            _this._init(html, config);
        });
    }
    ChartNavigation.prototype._init = function (html, config) {
        var controls = $(html).appendTo(config.target);
        var chart = config.chart;
        controls.find('.scxNavigation-btn-scrollLeft').on('click', function () {
            chart.scrollOnPixels(chart.size.width / 5);
            chart.setNeedsUpdate(true);
            return false;
        });
        controls.find('.scxNavigation-btn-scrollRight').on('click', function () {
            chart.scrollOnPixels(-chart.size.width / 5);
            chart.setNeedsUpdate(true);
            return false;
        });
        controls.find('.scxNavigation-btn-zoomIn').on('click', function () {
            chart.handleZoom(chart.size.width / 5);
            chart.setNeedsUpdate(true);
            return false;
        });
        controls.find('.scxNavigation-btn-zoomOut').on('click', function () {
            chart.handleZoom(-chart.size.width / 5);
            chart.setNeedsUpdate(true);
            return false;
        });
        controls.find('.scxNavigation-btn-scrollToFirst').on('click', function () {
            var records = chart.lastVisibleRecord - chart.firstVisibleRecord;
            if (records > 1) {
                chart.firstVisibleRecord = 0;
                chart.lastVisibleRecord = Math.min(records, chart.recordCount - 1);
                chart.setNeedsUpdate(true);
            }
            return false;
        });
        controls.find('.scxNavigation-btn-scrollToLast').on('click', function () {
            var recordCount = chart.recordCount;
            if (recordCount > 0) {
                var firstRec = chart.firstVisibleRecord;
                var lastRec = chart.lastVisibleRecord;
                chart.lastVisibleRecord = recordCount - 1;
                chart.firstVisibleRecord = Math.max(recordCount - (lastRec - firstRec + 1), 0);
                chart.setNeedsUpdate(true);
            }
            return false;
        });
    };
    return ChartNavigation;
}());
export { ChartNavigation };
//# sourceMappingURL=Navigation.js.map