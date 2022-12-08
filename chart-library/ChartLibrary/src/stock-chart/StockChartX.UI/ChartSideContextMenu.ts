import {ContextMenu, IContextMenuConfig} from './ContextMenu';
import {HtmlLoader} from './HtmlLoader';
import {ChartAccessorService} from '../../services/index';
import {StringUtils} from '../../utils';

const ChartSideContextMenuItem = {
    ALERT: 'alert',
    BUY: 'buy',
    SELL: 'sell',
    STOP: 'stop'
};
Object.freeze(ChartSideContextMenuItem);

export interface IChartSideContextMenu extends IContextMenuConfig {
}

export class ChartSideContextMenu extends ContextMenu {
    private static _container: JQuery = null;
    private _keepShowing: boolean = false;

    public static MenuItem = ChartSideContextMenuItem;

    constructor(config: IChartSideContextMenu, targetDomObject?: JQuery) {
        super(config, targetDomObject);

        HtmlLoader.getView('ChartSideContextMenu.html', (html: string) => {

            if (!ChartSideContextMenu._container) {
                let contextMenuElement:JQuery = $(html).appendTo($('body'));
                ChartAccessorService.instance.translateHtml(contextMenuElement);
                ChartSideContextMenu._container = contextMenuElement;
            }

            config.menuContainer = ChartSideContextMenu._container;
        });
    }

    hide(): void {
        if(this._keepShowing) {
            this._keepShowing = false;
        } else {
            super.hide();
        }
    }

    show(e: JQueryEventObject): void {
        super.show(e);
        this._keepShowing = true;
    }

    hideTradingOptions() {
        ChartSideContextMenu._container.find('[data-id=buy]').addClass('hidden');
        ChartSideContextMenu._container.find('[data-id=sell]').addClass('hidden');
        ChartSideContextMenu._container.find('[data-id=stop]').addClass('hidden');
        ChartSideContextMenu._container.find('div.divider').addClass('hidden');
    }

    showStopOption() {
        ChartSideContextMenu._container.find('[data-id=stop]').removeClass('hidden');
    }

    hideStopOption() {
        ChartSideContextMenu._container.find('[data-id=stop]').addClass('hidden');
    }

    showTradingOptions(price: number , tradingPrice:number) {
        ChartSideContextMenu._container.find('[data-id=buy]').removeClass('hidden');
        ChartSideContextMenu._container.find('[data-id=sell]').removeClass('hidden');
        ChartSideContextMenu._container.find('[data-id=stop]').removeClass('hidden');
        ChartSideContextMenu._container.find('div.divider').removeClass('hidden');
        ChartSideContextMenu._container.find('span.price-span-alert').text(" @ " + StringUtils.format2DigitsNumber(price));
        ChartSideContextMenu._container.find('span.price-span-buy').text(" @ " + StringUtils.format2DigitsNumber(tradingPrice));
        ChartSideContextMenu._container.find('span.price-span-sell').text(" @ " + StringUtils.format2DigitsNumber(tradingPrice));
        ChartSideContextMenu._container.find('span.price-span-stop').text(" @ " + StringUtils.format2DigitsNumber(tradingPrice));
    }
}
