import { ContextMenu, IContextMenuConfig } from "./ContextMenu";
import { Drawing } from "../StockChartX/Drawings/Drawing";
export interface IDrawingContextMenu extends IContextMenuConfig {
    drawing: Drawing;
}
export declare class DrawingContextMenu extends ContextMenu {
    private static _container;
    static MenuItem: {
        SETTINGS: string;
        DELETE: string;
        CLONE: string;
        LOCK: string;
        TREND_LINE_ALERT: string;
    };
    constructor(config: IDrawingContextMenu, targetDomObject?: JQuery);
}
//# sourceMappingURL=DrawingContextMenu.d.ts.map