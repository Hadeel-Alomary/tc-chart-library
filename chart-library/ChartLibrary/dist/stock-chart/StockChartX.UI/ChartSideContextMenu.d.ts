import { ContextMenu, IContextMenuConfig } from './ContextMenu';
export interface IChartSideContextMenu extends IContextMenuConfig {
}
export declare class ChartSideContextMenu extends ContextMenu {
    private static _container;
    private _keepShowing;
    static MenuItem: {
        ALERT: string;
        BUY: string;
        SELL: string;
        STOP: string;
    };
    constructor(config: IChartSideContextMenu, targetDomObject?: JQuery);
    hide(): void;
    show(e: JQueryEventObject): void;
    hideTradingOptions(): void;
    showStopOption(): void;
    hideStopOption(): void;
    showTradingOptions(price: number, tradingPrice: number): void;
}
//# sourceMappingURL=ChartSideContextMenu.d.ts.map