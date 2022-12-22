/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


import {Chart} from "../StockChartX/Chart";
import {ContextMenu, IContextMenuConfig} from "./ContextMenu";
import {HtmlLoader} from "./HtmlLoader";
import {KagiPriceStyle} from "../StockChartX/PriceStyles/KagiPriceStyle";
import {LineBreakPriceStyle} from "../StockChartX/PriceStyles/LineBreakPriceStyle";
import {PointAndFigurePriceStyle} from "../StockChartX/PriceStyles/PointAndFigurePriceStyle";
import {RenkoPriceStyle} from "../StockChartX/PriceStyles/RenkoPriceStyle";

const CLASS_DISABLED = 'disabled';

const ChartContextMenuItem = {
    FORMAT: 'format'
};
Object.freeze(ChartContextMenuItem);

export interface IChartContextMenuConfig extends IContextMenuConfig {
    chart: Chart;
}

interface IMenuItemsDomObjects {
    priceStyleFormat?: JQuery;
}

export class ChartContextMenu extends ContextMenu {
    private static _container: JQuery = null;
    private _menuItems: IMenuItemsDomObjects = {};

    public static MenuItem = ChartContextMenuItem;

    constructor(targetDomObject: JQuery, config: IChartContextMenuConfig) {
        super(config, targetDomObject);

        HtmlLoader.getView('ChartContextMenu.html', (html: string) => {

            if (!ChartContextMenu._container) {
                ChartContextMenu._container = $(html).appendTo($('body'));
            }

            this._initMenu(config);
        });
    }

    private _initMenu(config: IChartContextMenuConfig): void {
        this._defineMenuItems();

        config.menuContainer = ChartContextMenu._container;
        config.onShow = () => {
            switch (config.chart.priceStyleKind) {
                case KagiPriceStyle.className:
                case LineBreakPriceStyle.className:
                case PointAndFigurePriceStyle.className:
                case RenkoPriceStyle.className:
                    this._menuItems.priceStyleFormat.removeClass(CLASS_DISABLED);
                    break;
                default:
                    this._menuItems.priceStyleFormat.addClass(CLASS_DISABLED);
                    break;
            }
        };
    }

    private _defineMenuItems(): void {
        this._menuItems.priceStyleFormat = ChartContextMenu._container.find('[data-id=format]');
    }
}
