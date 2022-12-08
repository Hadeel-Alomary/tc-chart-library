export interface ICallbackFunction {
    (html: string): void;
}
export declare class HtmlLoader {
    private static _dataItems;
    static getView(fileName: string, callback: ICallbackFunction): void;
    private static _getDataItem;
    private static _receiveFileContent;
    private static _onFileContentReceived;
}
//# sourceMappingURL=HtmlLoader.d.ts.map