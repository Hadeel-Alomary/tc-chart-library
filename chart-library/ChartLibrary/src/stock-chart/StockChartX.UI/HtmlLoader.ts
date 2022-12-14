/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {Dictionary} from '../StockChartX/Data/Dictionary';
import {HtmlViews} from './HtmlViews';

export interface ICallbackFunction {
    (html: string): void;
}

class DataItem {
    private _html: string;
    private _subscribers: ICallbackFunction[];

    constructor(subscriber?: ICallbackFunction) {
        this._html = "";
        this._subscribers = [];

        if (typeof subscriber !== "undefined")
            this._subscribers.push(subscriber);
    }

    private _isHtmlLoaded(): boolean {
        return this._html.length > 0;
    }

    private _getHtml(): string {
        return this._html;
    }

    public pushHtml(html: string): void {
        this._html = html;

        for (var i = this._subscribers.length - 1; i >= 0; i--) {
            this._subscribers[i](this._getHtml());
            this._subscribers.splice(i, 1);
        }
    }

    public subscribe(func: ICallbackFunction): void {
        if (this._isHtmlLoaded())
            func(this._getHtml());
        else
            this._subscribers.push(func);
    }
}

export class HtmlLoader {

    private static _dataItems = new Dictionary<DataItem>();

    public static getView(fileName: string, callback: ICallbackFunction): void {

        let dataItem = HtmlLoader._getDataItem(fileName);

        if (dataItem == null) {
            HtmlLoader._dataItems.add(fileName, new DataItem(callback));
            HtmlLoader._receiveFileContent(fileName);
        } else {
            dataItem.subscribe(callback);
        }
    }

    private static _getDataItem(fileName: string): DataItem {
        return HtmlLoader._dataItems.tryGet(fileName);
    }

    private static _receiveFileContent(fileName: string): void {
        // MA original code used to fetch HTML views here over the internet. For better packaging, mainly
        // driven then by having chart-viewer element, I've changed this to be an inline HTML views. 
        let viewKey: string = fileName.replace('.html', ''); // remove html extension
        HtmlLoader._onFileContentReceived(fileName, HtmlViews.getView(viewKey));
    }

    private static _onFileContentReceived(fileName: string, html: string): void {
        let dataItem = HtmlLoader._getDataItem(fileName);

        if (dataItem == null)
            return;

        dataItem.pushHtml(html);
    }
}
