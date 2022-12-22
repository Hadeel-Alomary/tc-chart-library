import {ContextMenu, IContextMenuConfig} from './ContextMenu';
import {HtmlLoader} from './HtmlLoader';
import {ChartAccessorService} from '../../services/index';

const AlertDrawingContextMenuItem = {
    UPDATE: 'update',
    DELETE: 'delete',
};
Object.freeze(AlertDrawingContextMenuItem);

export interface IAlertDrawingContextMenu extends IContextMenuConfig {
}

export class AlertDrawingContextMenu extends ContextMenu {
    private static _container: JQuery = null;

    public static MenuItem = AlertDrawingContextMenuItem;

    constructor(config: IAlertDrawingContextMenu, targetDomObject?: JQuery) {
        super(config, targetDomObject);

        HtmlLoader.getView('AlertDrawingContextMenu.html', (html: string) => {

            if (!AlertDrawingContextMenu._container) {
                let contextMenuElement:JQuery = $(html).appendTo($('body'));
                ChartAccessorService.instance.translateHtml(contextMenuElement);
                AlertDrawingContextMenu._container = contextMenuElement;
            }

            config.menuContainer = AlertDrawingContextMenu._container;
        });
    }
}
