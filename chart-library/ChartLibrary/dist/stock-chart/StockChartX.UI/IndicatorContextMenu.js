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