import { Chart } from "../StockChartX/Chart";
import { ContextMenu, IContextMenuConfig } from "./ContextMenu";
export interface IChartContextMenuConfig extends IContextMenuConfig {
    chart: Chart;
}
export declare class ChartContextMenu extends ContextMenu {
    private static _container;
    private _menuItems;
    static MenuItem: {
        FORMAT: string;
    };
    constructor(targetDomObject: JQuery, config: IChartContextMenuConfig);
    private _initMenu;
    private _defineMenuItems;
}
//# sourceMappingURL=ChartContextMenu.d.ts.map