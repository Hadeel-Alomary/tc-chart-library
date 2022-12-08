import { ContextMenu, IContextMenuConfig } from "./ContextMenu";
import { Indicator } from "../StockChartX/Indicators/Indicator";
export interface IndicatorContextMenuConfig extends IContextMenuConfig {
    indicator: Indicator;
}
export declare class IndicatorContextMenu extends ContextMenu {
    private static _container;
    static menuItems: {
        SETTINGS: string;
        VISIBLE: string;
        DELETE: string;
        ALERT: string;
    };
    constructor(config: IndicatorContextMenuConfig, targetDomObject?: JQuery);
}
//# sourceMappingURL=IndicatorContextMenu.d.ts.map