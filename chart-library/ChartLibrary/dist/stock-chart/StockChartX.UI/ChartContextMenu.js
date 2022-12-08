import { __extends } from "tslib";
import { ContextMenu } from "./ContextMenu";
import { HtmlLoader } from "./HtmlLoader";
import { KagiPriceStyle } from "../StockChartX/PriceStyles/KagiPriceStyle";
import { LineBreakPriceStyle } from "../StockChartX/PriceStyles/LineBreakPriceStyle";
import { PointAndFigurePriceStyle } from "../StockChartX/PriceStyles/PointAndFigurePriceStyle";
import { RenkoPriceStyle } from "../StockChartX/PriceStyles/RenkoPriceStyle";
var CLASS_DISABLED = 'disabled';
var ChartContextMenuItem = {
    FORMAT: 'format'
};
Object.freeze(ChartContextMenuItem);
var ChartContextMenu = (function (_super) {
    __extends(ChartContextMenu, _super);
    function ChartContextMenu(targetDomObject, config) {
        var _this = _super.call(this, config, targetDomObject) || this;
        _this._menuItems = {};
        HtmlLoader.getView('ChartContextMenu.html', function (html) {
            if (!ChartContextMenu._container) {
                ChartContextMenu._container = $(html).appendTo($('body'));
            }
            _this._initMenu(config);
        });
        return _this;
    }
    ChartContextMenu.prototype._initMenu = function (config) {
        var _this = this;
        this._defineMenuItems();
        config.menuContainer = ChartContextMenu._container;
        config.onShow = function () {
            switch (config.chart.priceStyleKind) {
                case KagiPriceStyle.className:
                case LineBreakPriceStyle.className:
                case PointAndFigurePriceStyle.className:
                case RenkoPriceStyle.className:
                    _this._menuItems.priceStyleFormat.removeClass(CLASS_DISABLED);
                    break;
                default:
                    _this._menuItems.priceStyleFormat.addClass(CLASS_DISABLED);
                    break;
            }
        };
    };
    ChartContextMenu.prototype._defineMenuItems = function () {
        this._menuItems.priceStyleFormat = ChartContextMenu._container.find('[data-id=format]');
    };
    ChartContextMenu._container = null;
    ChartContextMenu.MenuItem = ChartContextMenuItem;
    return ChartContextMenu;
}(ContextMenu));
export { ChartContextMenu };
//# sourceMappingURL=ChartContextMenu.js.map