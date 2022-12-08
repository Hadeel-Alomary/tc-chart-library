import { __extends } from "tslib";
import { ContextMenu } from './ContextMenu';
import { HtmlLoader } from './HtmlLoader';
import { ChartAccessorService } from '../../services/index';
var AlertDrawingContextMenuItem = {
    UPDATE: 'update',
    DELETE: 'delete',
};
Object.freeze(AlertDrawingContextMenuItem);
var AlertDrawingContextMenu = (function (_super) {
    __extends(AlertDrawingContextMenu, _super);
    function AlertDrawingContextMenu(config, targetDomObject) {
        var _this = _super.call(this, config, targetDomObject) || this;
        HtmlLoader.getView('AlertDrawingContextMenu.html', function (html) {
            if (!AlertDrawingContextMenu._container) {
                var contextMenuElement = $(html).appendTo($('body'));
                ChartAccessorService.instance.translateHtml(contextMenuElement);
                AlertDrawingContextMenu._container = contextMenuElement;
            }
            config.menuContainer = AlertDrawingContextMenu._container;
        });
        return _this;
    }
    AlertDrawingContextMenu._container = null;
    AlertDrawingContextMenu.MenuItem = AlertDrawingContextMenuItem;
    return AlertDrawingContextMenu;
}(ContextMenu));
export { AlertDrawingContextMenu };
//# sourceMappingURL=AlertDrawingContextMenu.js.map