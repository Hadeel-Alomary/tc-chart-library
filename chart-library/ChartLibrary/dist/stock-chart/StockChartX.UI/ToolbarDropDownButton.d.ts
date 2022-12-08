export interface IToolbarDropDownButtonConfig {
    selectedItem: string;
    selectionChanged: (dataValue: string, isActivated?: boolean) => void;
}
export declare class ToolbarDropDownButton {
    private _config;
    private _rootElement;
    private _btnWrapper;
    private _btnActivate;
    private _body;
    private _canToggle;
    private _canFireFromHead;
    private _hasChildren;
    private _isActivated;
    private _isActive;
    private _btn_toggleDropDown;
    private _itemsWrapper;
    private _items;
    constructor(rootElement: JQuery, config: IToolbarDropDownButtonConfig);
    selectItem(val: string, fire: boolean): void;
    deactivate(): void;
    private _init;
    private _setValue;
    private _triggerActiveButton;
    private _activateButton;
    private _deactivateButton;
    private _toggleButton;
    private _fireFromHead;
    private _showDropDown;
    private _hideDropDown;
    private _toggleDropDown;
}
//# sourceMappingURL=ToolbarDropDownButton.d.ts.map