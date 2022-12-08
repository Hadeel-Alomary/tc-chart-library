import { ContextMenu, IContextMenuConfig } from "./ContextMenu";
import { ChartPanel } from '..';
export interface IChartPanelMenuConfig extends IContextMenuConfig {
    chartPanel: ChartPanel;
    isArabic: boolean;
}
export declare class ChartPanelMenu extends ContextMenu {
    private static _container;
    static menuItems: {
        ALERT: string;
        DELETE: string;
        CHART_ELEMENTS: string;
        SETTINGS: string;
        SIMPLE_MOVING_AVERAGE: any;
        EXPO_MOVING_AVERAGE: any;
    };
    private readonly chartPanel;
    private readonly isArabic;
    constructor(config: IChartPanelMenuConfig, targetDomObject?: JQuery);
    show(e: JQueryEventObject): void;
    private processMenuItemVisibility;
    private hideDeletePanelOption;
    private showDeletePanelOption;
    private hideAddAlertOption;
    private showAddAlertOption;
    private addSubMenuMovingAverageOptions;
    private addSubMenuDivider;
    private _appendMovingAverageOptions;
}
//# sourceMappingURL=ChartPanelMenu.d.ts.map