import { __extends } from "tslib";
import { ContextMenu } from "./ContextMenu";
import { HtmlLoader } from "./HtmlLoader";
import { ChartAccessorService } from '../../services/index';
import { TechnicalIndicatorType } from '../../components/chart/technical-indicators/technical-indicator-type';
var ContextMenuOptionItem = {
    ALERT: 'alert',
    DELETE: 'delete',
    CHART_ELEMENTS: 'chart-elements',
    SETTINGS: 'settings',
    SIMPLE_MOVING_AVERAGE: TechnicalIndicatorType.SimpleMovingAverage,
    EXPO_MOVING_AVERAGE: TechnicalIndicatorType.ExponentialMovingAverage
};
Object.freeze(ContextMenuOptionItem);
var ChartPanelMenu = (function (_super) {
    __extends(ChartPanelMenu, _super);
    function ChartPanelMenu(config, targetDomObject) {
        var _this = _super.call(this, config, targetDomObject) || this;
        _this.chartPanel = null;
        _this.chartPanel = config.chartPanel;
        _this.isArabic = config.isArabic;
        HtmlLoader.getView('ChartPanelMenu.html', function (html) {
            if (!ChartPanelMenu._container) {
                var contextMenuElement = $(html).appendTo($('body'));
                ChartAccessorService.instance.translateHtml(contextMenuElement);
                ChartPanelMenu._container = contextMenuElement;
            }
            config.menuContainer = ChartPanelMenu._container;
            _this._appendMovingAverageOptions();
        });
        return _this;
    }
    ChartPanelMenu.prototype.show = function (e) {
        this.processMenuItemVisibility();
        _super.prototype.show.call(this, e);
        event.stopPropagation();
        event.preventDefault();
    };
    ChartPanelMenu.prototype.processMenuItemVisibility = function () {
        if (this.chartPanel === this.chartPanel.chart.mainPanel) {
            this.hideDeletePanelOption();
            this.showAddAlertOption();
        }
        else {
            this.showDeletePanelOption();
            if (this.chartPanel.indicators[0].isAlertable()) {
                this.showAddAlertOption();
            }
            else {
                this.hideAddAlertOption();
            }
        }
    };
    ChartPanelMenu.prototype.hideDeletePanelOption = function () {
        ChartPanelMenu._container.find('[data-id="delete"]').addClass('hidden');
        ChartPanelMenu._container.find('[data-id=delete-divider]').addClass('hidden');
    };
    ChartPanelMenu.prototype.showDeletePanelOption = function () {
        ChartPanelMenu._container.find('[data-id="delete"]').removeClass('hidden');
        ChartPanelMenu._container.find('[data-id=delete-divider]').removeClass('hidden');
    };
    ChartPanelMenu.prototype.hideAddAlertOption = function () {
        ChartPanelMenu._container.find('[data-id="alert"]').addClass('hidden');
    };
    ChartPanelMenu.prototype.showAddAlertOption = function () {
        ChartPanelMenu._container.find('[data-id="alert"]').removeClass('hidden');
    };
    ChartPanelMenu.prototype.addSubMenuMovingAverageOptions = function (dataId, dataPeriod, text) {
        var movingAverageLi = ChartPanelMenu._container.find('.moving-average');
        var movingAverageSubMenu = movingAverageLi.find('.dropdown-menu');
        if (movingAverageSubMenu.find('[data-id=' + dataId + '][data-period=' + dataPeriod + ']').length < 1) {
            movingAverageSubMenu.append("<li data-id= " + dataId + " data-period= " + dataPeriod + "><a href=\"#\">" + text + "</a></li>");
        }
    };
    ChartPanelMenu.prototype.addSubMenuDivider = function () {
        var movingAverageLi = ChartPanelMenu._container.find('.moving-average');
        var movingAverageSubMenu = movingAverageLi.find('.dropdown-menu');
        if (movingAverageSubMenu.find('.divider.first').length < 1) {
            movingAverageSubMenu.append("<div class=\"divider first\"></div>");
        }
    };
    ChartPanelMenu.prototype._appendMovingAverageOptions = function () {
        var _this = this;
        var simpleMovingAverageOptions = this.chartPanel.chart.movingAverageOptions.simpleMovingAverageOptions();
        simpleMovingAverageOptions.forEach(function (indicator, index) {
            var text = _this.isArabic ? indicator.arabicName : indicator.englishName;
            _this.addSubMenuMovingAverageOptions(indicator.type.type, indicator.period.toString(), text + ' ' + indicator.period);
            if (simpleMovingAverageOptions.length - 1 == index) {
                _this.addSubMenuDivider();
            }
        });
        var exponentialMovingAverageOptions = this.chartPanel.chart.movingAverageOptions.exponentialMovingAverageOptions();
        exponentialMovingAverageOptions.forEach(function (indicator) {
            var text = _this.isArabic ? indicator.arabicName : indicator.englishName;
            _this.addSubMenuMovingAverageOptions(indicator.type.type, indicator.period.toString(), text + ' ' + indicator.period);
        });
    };
    ChartPanelMenu._container = null;
    ChartPanelMenu.menuItems = ContextMenuOptionItem;
    return ChartPanelMenu;
}(ContextMenu));
export { ChartPanelMenu };
//# sourceMappingURL=ChartPanelMenu.js.map