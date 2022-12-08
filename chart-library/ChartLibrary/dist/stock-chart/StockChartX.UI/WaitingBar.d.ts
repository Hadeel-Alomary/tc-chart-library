export interface IWaitingBarConfig {
    text?: string;
    dotsCount?: number;
}
export declare class WaitingBar {
    private _config;
    private _parentContainer;
    private _container;
    private _isWorkingNow;
    constructor(container: JQuery);
    show(config: IWaitingBarConfig): void;
    hide(): void;
    private _createDom;
    private _destroy;
}
//# sourceMappingURL=WaitingBar.d.ts.map