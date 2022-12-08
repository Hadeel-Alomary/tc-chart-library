import { Dialog, IDialogConfig } from "./Dialog";
import { IPriceStyle } from "../StockChartX/PriceStyles/PriceStyle";
export interface IPriceStyleDialogConfig extends IDialogConfig {
    priceStyle: IPriceStyle;
}
export declare class PriceStyleSettingsDialog extends Dialog {
    protected _config: IPriceStyleDialogConfig;
    private _title;
    private _panelFigureInputsPanel;
    private _input_boxSizeKind;
    private _input_ATRlength;
    private _input_boxSize;
    private _input_reversalAmount;
    private _input_reversalDoubleAmount;
    private _input_numberOfLine;
    private _panelFigureBoxCalculationMethods;
    private _panelFigureATRLength;
    private _panelFigureBoxSize;
    private _panelFigureReversalAmount;
    private _panelFigureReversalDoubleAmount;
    private _panelFigureNumberOfLine;
    private _boxSizeKind;
    private _priceStyleKind;
    private _isApplyClicked;
    constructor(rootContainer: JQuery);
    show(config: IPriceStyleDialogConfig): void;
    hide(): void;
    private _init;
    private _switchView;
    private _switchPriceStyleMethod;
    private _setValues;
    private _getValues;
    protected _apply(applySaveSettings?: boolean): void;
    private static _getTitle;
    private _initFields;
}
//# sourceMappingURL=PriceStyleSettingsDialog.d.ts.map