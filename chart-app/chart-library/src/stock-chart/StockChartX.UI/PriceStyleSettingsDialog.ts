/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {Dialog, IDialogConfig} from "./Dialog";
import {IPriceStyle} from "../StockChartX/PriceStyles/PriceStyle";
import {PointAndFigureBoxSizeKind, PointAndFigurePriceStyle} from "../StockChartX/PriceStyles/PointAndFigurePriceStyle";
import {RenkoBoxSizeKind, RenkoPriceStyle} from "../StockChartX/PriceStyles/RenkoPriceStyle";
import {KagiPriceStyle, KagiReversalKind} from "../StockChartX/PriceStyles/KagiPriceStyle";
import {LineBreakPriceStyle} from "../StockChartX/PriceStyles/LineBreakPriceStyle";

export interface IPriceStyleDialogConfig extends IDialogConfig {
    priceStyle: IPriceStyle;
}

const ID = {
    DIALOG: '#scxPriceStyleDialog_',
    INPUT: '.scxPriceStyleDialog_input_',
    FIGURE: '.scxPriceStyleDialog_panel_ntb_'
};

const numericFieldConfig = {
    showArrows: true,
    maxValue: 100,
    minValue: 1,
    value: 1
};

const numericFieldFloatConfig = {
    showArrows: true,
    maxValue: 100,
    minValue: 0.01,
    priceDecimals: 5,
    value: 1
};

export class PriceStyleSettingsDialog extends Dialog {
    protected _config: IPriceStyleDialogConfig;
    private _title: JQuery;
    private _panelFigureInputsPanel: JQuery;
    private _input_boxSizeKind: JQuery;
    private _input_ATRlength: JQuery;
    private _input_boxSize: JQuery;
    private _input_reversalAmount: JQuery;
    private _input_reversalDoubleAmount: JQuery;
    private _input_numberOfLine: JQuery;
    private _panelFigureBoxCalculationMethods: JQuery;
    private _panelFigureATRLength: JQuery;
    private _panelFigureBoxSize: JQuery;
    private _panelFigureReversalAmount: JQuery;
    private _panelFigureReversalDoubleAmount: JQuery;
    private _panelFigureNumberOfLine: JQuery;
    private _boxSizeKind: string;
    private _priceStyleKind: string;
    private _isApplyClicked: boolean = false;

    constructor(rootContainer: JQuery) {
        super(rootContainer);

        this._initFields();
        this._init();
    }

    public show(config: IPriceStyleDialogConfig): void {
        this._config = config;
        this._priceStyleKind = config.priceStyle.chart.priceStyleKind;

        this._setValues(this._priceStyleKind);
        this._switchView(this._priceStyleKind);

        this._isApplyClicked = false;
        super.show(config);
    }

    public hide(): void {
        this._config = null;
        super.hide();
    }

    private _init(): void {
        this._input_ATRlength.scxNumericField(numericFieldConfig);
        this._input_boxSize.scxNumericField(numericFieldFloatConfig);
        this._input_reversalAmount.scxNumericField(numericFieldConfig);
        this._input_reversalDoubleAmount.scxNumericField(numericFieldFloatConfig);
        this._input_numberOfLine.scxNumericField(numericFieldConfig);

        this._input_boxSizeKind.selectpicker({container: 'body'});

        this._input_boxSizeKind.on('change', () => {
            this._boxSizeKind = this._input_boxSizeKind.val();
            this._switchPriceStyleMethod();
        });

        this._dialog.find(ID.DIALOG + 'btn_save').on('click', () => {
            this._apply();
        });
    }

    private _switchView(priceStyleKind: string): void {
        this._title.text(PriceStyleSettingsDialog._getTitle(priceStyleKind));
        this._panelFigureInputsPanel.show();

        switch (priceStyleKind) {
            case PointAndFigurePriceStyle.className:
                this._switchPriceStyleMethod();
                this._panelFigureNumberOfLine.hide();
                this._panelFigureBoxCalculationMethods.show();
                this._panelFigureReversalAmount.show();
                this._panelFigureReversalDoubleAmount.hide();
                return;
            case RenkoPriceStyle.className:
                this._switchPriceStyleMethod();
                this._panelFigureNumberOfLine.hide();
                this._panelFigureBoxCalculationMethods.show();
                this._panelFigureReversalAmount.hide();
                this._panelFigureReversalDoubleAmount.hide();
                return;
            case KagiPriceStyle.className:
                this._switchPriceStyleMethod();
                this._panelFigureNumberOfLine.hide();
                this._panelFigureBoxCalculationMethods.show();
                this._panelFigureBoxSize.hide();
                this._panelFigureATRLength.hide();
                return;
            case LineBreakPriceStyle.className:
                this._panelFigureNumberOfLine.show();
                this._panelFigureBoxCalculationMethods.hide();
                this._panelFigureReversalAmount.hide();
                this._panelFigureBoxSize.hide();
                this._panelFigureATRLength.hide();
                this._panelFigureReversalDoubleAmount.hide();
                return;
            default:
                return;
        }
    }

    private _switchPriceStyleMethod(): void {
        if (this._boxSizeKind === PointAndFigureBoxSizeKind.ATR) {
            this._panelFigureBoxSize.hide();
            this._panelFigureATRLength.show();
        } else {
            this._panelFigureBoxSize.show();
            this._panelFigureATRLength.hide();
        }

        if (this._priceStyleKind === KagiPriceStyle.className && this._boxSizeKind === KagiReversalKind.ATR) {
            this._panelFigureATRLength.hide();
            this._panelFigureReversalAmount.show();
            this._panelFigureReversalDoubleAmount.hide();
        } else if (this._priceStyleKind === KagiPriceStyle.className) {
            this._panelFigureBoxSize.hide();
            this._panelFigureReversalAmount.hide();
            this._panelFigureReversalDoubleAmount.show();
        }
    }

    private _setValues(priceStyleKind: string): void {
        switch (priceStyleKind) {
            case PointAndFigurePriceStyle.className:
                let pointAndFigurePriceStyle = <PointAndFigurePriceStyle> (this._config.priceStyle);
                this._boxSizeKind = pointAndFigurePriceStyle.boxSize.kind;
                this._input_boxSizeKind.selectpicker('val', this._boxSizeKind || PointAndFigureBoxSizeKind.ATR
            )
                ;

                if (this._boxSizeKind === PointAndFigureBoxSizeKind.ATR)
                    this._input_ATRlength.scxNumericField('setValue', pointAndFigurePriceStyle.boxSize.value || 1);
                else
                    this._input_boxSize.scxNumericField('setValue', pointAndFigurePriceStyle.boxSize.value || 1);

                this._input_reversalAmount.scxNumericField('setValue', pointAndFigurePriceStyle.reversal || 1);
                return;
            case RenkoPriceStyle.className:
                let renkoPriceStyle = <RenkoPriceStyle> (this._config.priceStyle);
                this._boxSizeKind = renkoPriceStyle.boxSize.kind;
                this._input_boxSizeKind.selectpicker('val', this._boxSizeKind || RenkoBoxSizeKind.ATR
            )
                ;

                if (this._boxSizeKind === RenkoBoxSizeKind.ATR)
                    this._input_ATRlength.scxNumericField('setValue', renkoPriceStyle.boxSize.value || 1);
                else
                    this._input_boxSize.scxNumericField('setValue', renkoPriceStyle.boxSizeValue || 1);

                return;
            case KagiPriceStyle.className:
                let kagiPriceStyle = <KagiPriceStyle> (this._config.priceStyle);
                this._boxSizeKind = kagiPriceStyle.reversal.kind;

                this._input_boxSizeKind.selectpicker('val', this._boxSizeKind || KagiReversalKind.ATR
            )
                ;

                if (this._boxSizeKind === KagiReversalKind.ATR)
                    this._input_reversalAmount.scxNumericField('setValue', kagiPriceStyle.reversal.value || 1);
                else
                    this._input_reversalDoubleAmount.scxNumericField('setValue', kagiPriceStyle.reversal.value || 1);

                return;
            case LineBreakPriceStyle.className:
                let lineBreakPriceStyle = <LineBreakPriceStyle> (this._config.priceStyle);
                this._input_numberOfLine.scxNumericField('setValue', lineBreakPriceStyle.lines || 1);
                return;
            default:
                this.hide();
                return;
        }
    }

    private _getValues(): void {
        switch (this._priceStyleKind) {
            case PointAndFigurePriceStyle.className:
                let pointAndFigurePriceStyle = <PointAndFigurePriceStyle> (this._config.priceStyle);
                pointAndFigurePriceStyle.boxSize.kind = this._input_boxSizeKind.val();

                if (pointAndFigurePriceStyle.boxSize.kind === PointAndFigureBoxSizeKind.ATR)
                    pointAndFigurePriceStyle.boxSize.value = this._input_ATRlength.scxNumericField('getValue');
                else
                    pointAndFigurePriceStyle.boxSize.value = this._input_boxSize.scxNumericField('getValue');

                pointAndFigurePriceStyle.reversal = this._input_reversalAmount.scxNumericField('getValue');
                return;
            case RenkoPriceStyle.className:
                let renkoPriceStyle = <RenkoPriceStyle> (this._config.priceStyle);
                renkoPriceStyle.boxSize.kind = this._input_boxSizeKind.val();

                if (renkoPriceStyle.boxSize.kind === RenkoBoxSizeKind.ATR)
                    renkoPriceStyle.boxSize.value = this._input_ATRlength.scxNumericField('getValue');
                else
                    renkoPriceStyle.boxSize.value = this._input_boxSize.scxNumericField('getValue');

                return;
            case KagiPriceStyle.className:
                let kagiPriceStyle = <KagiPriceStyle> (this._config.priceStyle);
                kagiPriceStyle.reversal.kind = this._input_boxSizeKind.val();

                if (kagiPriceStyle.reversal.kind === KagiReversalKind.ATR)
                    kagiPriceStyle.reversal.value = this._input_ATRlength.scxNumericField('getValue');
                else
                    kagiPriceStyle.reversal.value = this._input_reversalDoubleAmount.scxNumericField('getValue');

                return;
            case LineBreakPriceStyle.className:
                let lineBreakPriceStyle = <LineBreakPriceStyle> (this._config.priceStyle);
                lineBreakPriceStyle.lines = this._input_numberOfLine.scxNumericField('getValue');
                return;
            default:
                return;
        }
    }

    protected _apply(applySaveSettings: boolean = true): void {
        this._getValues();

        this._config.priceStyle.updateComputedDataSeries();
        this._config.priceStyle.chart.update();

        this._isApplyClicked = true;
        this.hide();
    }

    private static _getTitle(priceStyleKind: string): string {
        let name = "";
        switch (priceStyleKind) {
            case PointAndFigurePriceStyle.className:
                name += "Point and Figure";
                break;
            case RenkoPriceStyle.className:
                name += "Renko";
                break;
            case KagiPriceStyle.className:
                name += "Kagi";
                break;
            case LineBreakPriceStyle.className:
                name += "Line Break";
                break;
        }
        return name += " Settings";
    }

    private _initFields(): void {
        this._title = this._dialog.find(ID.DIALOG + 'title');
        this._panelFigureInputsPanel = this._dialog.find(ID.FIGURE + 'inputsPanel');
        this._input_boxSizeKind = this._dialog.find(ID.INPUT + 'boxSizeKind');
        this._input_ATRlength = this._dialog.find(ID.INPUT + 'ATRLength');
        this._input_boxSize = this._dialog.find(ID.INPUT + 'boxSize');
        this._input_reversalAmount = this._dialog.find(ID.INPUT + 'reversalAmount');
        this._input_reversalDoubleAmount = this._dialog.find(ID.INPUT + 'reversalDoubleAmount');
        this._input_numberOfLine = this._dialog.find(ID.INPUT + 'numberOfLine');
        this._panelFigureBoxCalculationMethods = this._dialog.find(ID.FIGURE + 'boxSizeKind');
        this._panelFigureATRLength = this._dialog.find(ID.FIGURE + 'ATRLength');
        this._panelFigureBoxSize = this._dialog.find(ID.FIGURE + 'boxSize');
        this._panelFigureReversalAmount = this._dialog.find(ID.FIGURE + 'reversalAmount');
        this._panelFigureReversalDoubleAmount = this._dialog.find(ID.FIGURE + 'reversalDoubleAmount');
        this._panelFigureNumberOfLine = this._dialog.find(ID.FIGURE + 'numberOfLine');
    }
}
