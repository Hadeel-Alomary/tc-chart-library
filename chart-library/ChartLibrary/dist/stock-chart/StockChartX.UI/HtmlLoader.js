import { Dictionary } from '../StockChartX/Data/Dictionary';
import { HtmlViews } from './HtmlViews';
var DataItem = (function () {
    function DataItem(subscriber) {
        this._html = "";
        this._subscribers = [];
        if (typeof subscriber !== "undefined")
            this._subscribers.push(subscriber);
    }
    DataItem.prototype._isHtmlLoaded = function () {
        return this._html.length > 0;
    };
    DataItem.prototype._getHtml = function () {
        return this._html;
    };
    DataItem.prototype.pushHtml = function (html) {
        this._html = html;
        for (var i = this._subscribers.length - 1; i >= 0; i--) {
            this._subscribers[i](this._getHtml());
            this._subscribers.splice(i, 1);
        }
    };
    DataItem.prototype.subscribe = function (func) {
        if (this._isHtmlLoaded())
            func(this._getHtml());
        else
            this._subscribers.push(func);
    };
    return DataItem;
}());
var HtmlLoader = (function () {
    function HtmlLoader() {
    }
    HtmlLoader.getView = function (fileName, callback) {
        var dataItem = HtmlLoader._getDataItem(fileName);
        if (dataItem == null) {
            HtmlLoader._dataItems.add(fileName, new DataItem(callback));
            HtmlLoader._receiveFileContent(fileName);
        }
        else {
            dataItem.subscribe(callback);
        }
    };
    HtmlLoader._getDataItem = function (fileName) {
        return HtmlLoader._dataItems.tryGet(fileName);
    };
    HtmlLoader._receiveFileContent = function (fileName) {
        var viewKey = fileName.replace('.html', '');
        HtmlLoader._onFileContentReceived(fileName, HtmlViews.getView(viewKey));
    };
    HtmlLoader._onFileContentReceived = function (fileName, html) {
        var dataItem = HtmlLoader._getDataItem(fileName);
        if (dataItem == null)
            return;
        dataItem.pushHtml(html);
    };
    HtmlLoader._dataItems = new Dictionary();
    return HtmlLoader;
}());
export { HtmlLoader };
//# sourceMappingURL=HtmlLoader.js.map