/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


import {ContextMenu, IContextMenuConfig} from "./ContextMenu";
import {Drawing} from "../StockChartX/Drawings/Drawing";
import {HtmlLoader} from "./HtmlLoader";
import {ChartAccessorService} from '../../services/index';

const DrawingContextMenuItem = {
    SETTINGS: 'settings',
    DELETE: 'delete',
    CLONE: 'clone',
    LOCK: 'lock',
    TREND_LINE_ALERT: 'trend-line-alert'
};
Object.freeze(DrawingContextMenuItem);

export interface IDrawingContextMenu extends IContextMenuConfig {
    drawing: Drawing;
}

export class DrawingContextMenu extends ContextMenu {
    private static _container: JQuery = null;

    public static MenuItem = DrawingContextMenuItem;

    constructor(config: IDrawingContextMenu, targetDomObject?: JQuery) {
        super(config, targetDomObject);

        HtmlLoader.getView('DrawingContextMenu.html', (html: string) => {

            if (!DrawingContextMenu._container) {
                let contextMenuElement:JQuery = $(html).appendTo($('body'));
                ChartAccessorService.instance.translateHtml(contextMenuElement);
                DrawingContextMenu._container = contextMenuElement;
            }

            config.menuContainer = DrawingContextMenu._container;
        });
    }
}
