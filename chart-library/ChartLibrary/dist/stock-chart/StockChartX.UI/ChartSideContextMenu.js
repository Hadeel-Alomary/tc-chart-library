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
import { ContextMenu } from './ContextMenu';
import { HtmlLoader } from './HtmlLoader';
import { ChartAccessorService } from '../../services/index';
import { StringUtils } from '../../utils';
var ChartSideContextMenuItem = {
    ALERT: 'alert',
    BUY: 'buy',
    SELL: 'sell',
    STOP: 'stop'
};
Object.freeze(ChartSideContextMenuItem);
var ChartSideContextMenu = (function (_super) {
    __extends(ChartSideContextMenu, _super);
    function ChartSideContextMenu(config, targetDomObject) {
        var _this = _super.call(this, config, targetDomObject) || this;
        _this._keepShowing = false;
        HtmlLoader.getView('ChartSideContextMenu.html', function (html) {
            if (!ChartSideContextMenu._container) {
                var contextMenuElement = $(html).appendTo($('body'));
                ChartAccessorService.instance.translateHtml(contextMenuElement);
                ChartSideContextMenu._container = contextMenuElement;
            }
            config.menuContainer = ChartSideContextMenu._container;
        });
        return _this;
    }
    ChartSideContextMenu.prototype.hide = function () {
        if (this._keepShowing) {
            this._keepShowing = false;
        }
        else {
            _super.prototype.hide.call(this);
        }
    };
    ChartSideContextMenu.prototype.show = function (e) {
        _super.prototype.show.call(this, e);
        this._keepShowing = true;
    };
    ChartSideContextMenu.prototype.hideTradingOptions = function () {
        ChartSideContextMenu._container.find('[data-id=buy]').addClass('hidden');
        ChartSideContextMenu._container.find('[data-id=sell]').addClass('hidden');
        ChartSideContextMenu._container.find('[data-id=stop]').addClass('hidden');
        ChartSideContextMenu._container.find('div.divider').addClass('hidden');
    };
    ChartSideContextMenu.prototype.showStopOption = function () {
        ChartSideContextMenu._container.find('[data-id=stop]').removeClass('hidden');
    };
    ChartSideContextMenu.prototype.hideStopOption = function () {
        ChartSideContextMenu._container.find('[data-id=stop]').addClass('hidden');
    };
    ChartSideContextMenu.prototype.showTradingOptions = function (price, tradingPrice) {
        ChartSideContextMenu._container.find('[data-id=buy]').removeClass('hidden');
        ChartSideContextMenu._container.find('[data-id=sell]').removeClass('hidden');
        ChartSideContextMenu._container.find('[data-id=stop]').removeClass('hidden');
        ChartSideContextMenu._container.find('div.divider').removeClass('hidden');
        ChartSideContextMenu._container.find('span.price-span-alert').text(" @ " + StringUtils.format2DigitsNumber(price));
        ChartSideContextMenu._container.find('span.price-span-buy').text(" @ " + StringUtils.format2DigitsNumber(tradingPrice));
        ChartSideContextMenu._container.find('span.price-span-sell').text(" @ " + StringUtils.format2DigitsNumber(tradingPrice));
        ChartSideContextMenu._container.find('span.price-span-stop').text(" @ " + StringUtils.format2DigitsNumber(tradingPrice));
    };
    ChartSideContextMenu._container = null;
    ChartSideContextMenu.MenuItem = ChartSideContextMenuItem;
    return ChartSideContextMenu;
}(ContextMenu));
export { ChartSideContextMenu };
//# sourceMappingURL=ChartSideContextMenu.js.map