import { Chart } from "../StockChartX/Chart";
export interface IDialogConfig {
    chart: Chart;
}
export interface IDialog {
    show(config: IDialogConfig): void;
    hide(): void;
}
export interface IDialogContent {
    dialog: JQuery;
    root: JQuery;
    header: JQuery;
    body: JQuery;
    footer: JQuery;
}
export declare class Dialog implements IDialog {
    protected _isShown: boolean;
    protected _config: IDialogConfig;
    protected _dialog: JQuery;
    protected _dialogContent: IDialogContent;
    constructor(rootContainer: JQuery);
    show(config: IDialogConfig): void;
    hide(): void;
    protected get settingOptions(): {
        APPLY_ONCE: string;
        MAKE_AS_DEFAULT: string;
        RESET_DEFAULT_SETTINGS: string;
    };
    private _initDialogContentObj;
    protected _adjustDialogHeight(): void;
    protected addOnChangeEventForNumericField(config: {
        [key: string]: unknown;
    }): {
        [key: string]: unknown;
    };
    protected _apply(applySaveSettings?: boolean): void;
    protected onChangeHandler(): void;
}
//# sourceMappingURL=Dialog.d.ts.map