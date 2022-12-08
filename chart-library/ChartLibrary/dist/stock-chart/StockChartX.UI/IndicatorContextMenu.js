import { __extends } from "tslib";
import { ContextMenu } from "./ContextMenu";
import { HtmlLoader } from "./HtmlLoader";
import { ChartAccessorService } from '../../services/index';
var IndicatorContextMenuItem = {
    SETTINGS: 'settings',
    VISIBLE: 'visible',
    DELETE: 'delete',
    ALERT: 'alert'
};
Object.freeze(IndicatorContextMenuItem);
var IndicatorContextMenu = (function (_super) {
    __extends(IndicatorContextMenu, _super);
    function IndicatorContextMenu(config, targetDomObject) {
        var _this = _super.call(this, config, targetDomObject) || this;
        HtmlLoader.getView('IndicatorContextMenu.html', function (html) {
            if (!IndicatorContextMenu._container) {
                var contextMenuElement = $(html).appendTo($('body'));
                ChartAccessorService.instance.translateHtml(contextMenuElement);
                IndicatorContextMenu._container = contextMenuElement;
            }
            config.menuContainer = IndicatorContextMenu._container;
        });
        return _this;
    }
    IndicatorContextMenu._container = null;
    IndicatorContextMenu.menuItems = IndicatorContextMenuItem;
    return IndicatorContextMenu;
}(ContextMenu));
export { IndicatorContextMenu };
//# sourceMappingURL=IndicatorContextMenu.js.map