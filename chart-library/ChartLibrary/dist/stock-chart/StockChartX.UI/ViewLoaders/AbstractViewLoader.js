import { JsUtil } from "../../StockChartX/Utils/JsUtil";
var AbstractViewLoader = (function () {
    function AbstractViewLoader() {
    }
    AbstractViewLoader.prototype._insertIntoPage = function (html, languageService) {
        var htmlPage = $(html).appendTo($('body'));
        languageService.translateHtml(htmlPage);
        return htmlPage;
    };
    AbstractViewLoader.prototype._invokeOnLoad = function (onLoad, dialog) {
        JsUtil.isFunction(onLoad) && onLoad(dialog);
    };
    return AbstractViewLoader;
}());
export { AbstractViewLoader };
//# sourceMappingURL=AbstractViewLoader.js.map