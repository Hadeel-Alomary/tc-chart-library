var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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