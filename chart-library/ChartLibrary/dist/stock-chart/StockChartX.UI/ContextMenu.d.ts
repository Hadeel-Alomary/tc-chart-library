export interface IContextMenuConfig {
    menuContainer?: JQuery;
    showOnClick?: boolean;
    onItemSelected: (selectedMenu: JQuery, isChecked?: boolean) => void;
    onShow?: () => void;
}
export declare class ContextMenu {
    private _config;
    private _isShown;
    constructor(config: IContextMenuConfig, targetDomObject?: JQuery);
    hide(): void;
    private closeAllSubMenu;
    private closeAnyOpenedContextMenu;
    show(e: JQueryEventObject): void;
    private _getLeftLocation;
    private _getRightLocation;
    private _getTopLocation;
}
//# sourceMappingURL=ContextMenu.d.ts.map