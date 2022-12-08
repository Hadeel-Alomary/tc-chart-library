import { ContextMenu, IContextMenuConfig } from './ContextMenu';
export interface IAlertDrawingContextMenu extends IContextMenuConfig {
}
export declare class AlertDrawingContextMenu extends ContextMenu {
    private static _container;
    static MenuItem: {
        UPDATE: string;
        DELETE: string;
    };
    constructor(config: IAlertDrawingContextMenu, targetDomObject?: JQuery);
}
//# sourceMappingURL=AlertDrawingContextMenu.d.ts.map