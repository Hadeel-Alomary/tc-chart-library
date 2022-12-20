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
import { ContextMenu } from "./ContextMenu";
import { HtmlLoader } from "./HtmlLoader";
import { ChartAccessorService } from '../../services/index';
var DrawingContextMenuItem = {
    SETTINGS: 'settings',
    DELETE: 'delete',
    CLONE: 'clone',
    LOCK: 'lock',
    TREND_LINE_ALERT: 'trend-line-alert'
};
Object.freeze(DrawingContextMenuItem);
var DrawingContextMenu = (function (_super) {
    __extends(DrawingContextMenu, _super);
    function DrawingContextMenu(config, targetDomObject) {
        var _this = _super.call(this, config, targetDomObject) || this;
        HtmlLoader.getView('DrawingContextMenu.html', function (html) {
            if (!DrawingContextMenu._container) {
                var contextMenuElement = $(html).appendTo($('body'));
                ChartAccessorService.instance.translateHtml(contextMenuElement);
                DrawingContextMenu._container = contextMenuElement;
            }
            config.menuContainer = DrawingContextMenu._container;
        });
        return _this;
    }
    DrawingContextMenu._container = null;
    DrawingContextMenu.MenuItem = DrawingContextMenuItem;
    return DrawingContextMenu;
}(ContextMenu));
export { DrawingContextMenu };
//# sourceMappingURL=DrawingContextMenu.js.map