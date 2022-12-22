import {ContextMenu, IContextMenuConfig} from "./ContextMenu";
import {Indicator} from "../StockChartX/Indicators/Indicator";
import {HtmlLoader} from "./HtmlLoader";
import {ChartAccessorService} from '../../services/index';

const IndicatorContextMenuItem = {
    SETTINGS: 'settings',
    VISIBLE: 'visible',
    DELETE: 'delete',
    ALERT: 'alert'
};
Object.freeze(IndicatorContextMenuItem);

export interface IndicatorContextMenuConfig extends IContextMenuConfig {
    indicator: Indicator;
}

export class IndicatorContextMenu extends ContextMenu {
    private static _container: JQuery = null;

    public static menuItems = IndicatorContextMenuItem;

    constructor(config: IndicatorContextMenuConfig, targetDomObject?: JQuery) {
        super(config, targetDomObject);

        HtmlLoader.getView('IndicatorContextMenu.html', (html: string) => {
            if (!IndicatorContextMenu._container) {
                let contextMenuElement:JQuery = $(html).appendTo($('body'));
                ChartAccessorService.instance.translateHtml(contextMenuElement);
                IndicatorContextMenu._container = contextMenuElement;
            }

            config.menuContainer = IndicatorContextMenu._container;
        });
    }
}

