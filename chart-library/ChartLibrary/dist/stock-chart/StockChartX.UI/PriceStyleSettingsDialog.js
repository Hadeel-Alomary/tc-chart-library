import { __extends } from "tslib";
import { Dialog } from "./Dialog";
import { PointAndFigureBoxSizeKind, PointAndFigurePriceStyle } from "../StockChartX/PriceStyles/PointAndFigurePriceStyle";
import { RenkoBoxSizeKind, RenkoPriceStyle } from "../StockChartX/PriceStyles/RenkoPriceStyle";
import { KagiPriceStyle, KagiReversalKind } from "../StockChartX/PriceStyles/KagiPriceStyle";
import { LineBreakPriceStyle } from "../StockChartX/PriceStyles/LineBreakPriceStyle";
var ID = {
    DIALOG: '#scxPriceStyleDialog_',
    INPUT: '.scxPriceStyleDialog_input_',
    FIGURE: '.scxPriceStyleDialog_panel_ntb_'
};
var numericFieldConfig = {
    showArrows: true,
    maxValue: 100,
    minValue: 1,
    value: 1
};
var numericFieldFloatConfig = {
    showArrows: true,
    maxValue: 100,
    minValue: 0.01,
    priceDecimals: 5,
    value: 1
};
var PriceStyleSettingsDialog = (function (_super) {
    __extends(PriceStyleSettingsDialog, _super);
    function PriceStyleSettingsDialog(rootContainer) {
        var _this = _super.call(this, rootContainer) || this;
        _this._isApplyClicked = false;
        _this._initFields();
        _this._init();
        return _this;
    }
    PriceStyleSettingsDialog.prototype.show = function (config) {
        this._config = config;
        this._priceStyleKind = config.priceStyle.chart.priceStyleKind;
        this._setValues(this._priceStyleKind);
        this._switchView(this._priceStyleKind);
        this._isApplyClicked = false;
        _super.prototype.show.call(this, config);
    };
    PriceStyleSettingsDialog.prototype.hide = function () {
        this._config = null;
        _super.prototype.hide.call(this);
    };
    PriceStyleSettingsDialog.prototype._init = function () {
        var _this = this;
        this._input_ATRlength.scxNumericField(numericFieldConfig);
        this._input_boxSize.scxNumericField(numericFieldFloatConfig);
        this._input_reversalAmount.scxNumericField(numericFieldConfig);
        this._input_reversalDoubleAmount.scxNumericField(numericFieldFloatConfig);
        this._input_numberOfLine.scxNumericField(numericFieldConfig);
        this._input_boxSizeKind.selectpicker({ container: 'body' });
        this._input_boxSizeKind.on('change', function () {
            _this._boxSizeKind = _this._input_boxSizeKind.val();
            _this._switchPriceStyleMethod();
        });
        this._dialog.find(ID.DIALOG + 'btn_save').on('click', function () {
            _this._apply();
        });
    };
    PriceStyleSettingsDialog.prototype._switchView = function (priceStyleKind) {
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
    };
    PriceStyleSettingsDialog.prototype._switchPriceStyleMethod = function () {
        if (this._boxSizeKind === PointAndFigureBoxSizeKind.ATR) {
            this._panelFigureBoxSize.hide();
            this._panelFigureATRLength.show();
        }
        else {
            this._panelFigureBoxSize.show();
            this._panelFigureATRLength.hide();
        }
        if (this._priceStyleKind === KagiPriceStyle.className && this._boxSizeKind === KagiReversalKind.ATR) {
            this._panelFigureATRLength.hide();
            this._panelFigureReversalAmount.show();
            this._panelFigureReversalDoubleAmount.hide();
        }
        else if (this._priceStyleKind === KagiPriceStyle.className) {
            this._panelFigureBoxSize.hide();
            this._panelFigureReversalAmount.hide();
            this._panelFigureReversalDoubleAmount.show();
        }
    };
    PriceStyleSettingsDialog.prototype._setValues = function (priceStyleKind) {
        switch (priceStyleKind) {
            case PointAndFigurePriceStyle.className:
                var pointAndFigurePriceStyle = (this._config.priceStyle);
                this._boxSizeKind = pointAndFigurePriceStyle.boxSize.kind;
                this._input_boxSizeKind.selectpicker('val', this._boxSizeKind || PointAndFigureBoxSizeKind.ATR);
                if (this._boxSizeKind === PointAndFigureBoxSizeKind.ATR)
                    this._input_ATRlength.scxNumericField('setValue', pointAndFigurePriceStyle.boxSize.value || 1);
                else
                    this._input_boxSize.scxNumericField('setValue', pointAndFigurePriceStyle.boxSize.value || 1);
                this._input_reversalAmount.scxNumericField('setValue', pointAndFigurePriceStyle.reversal || 1);
                return;
            case RenkoPriceStyle.className:
                var renkoPriceStyle = (this._config.priceStyle);
                this._boxSizeKind = renkoPriceStyle.boxSize.kind;
                this._input_boxSizeKind.selectpicker('val', this._boxSizeKind || RenkoBoxSizeKind.ATR);
                if (this._boxSizeKind === RenkoBoxSizeKind.ATR)
                    this._input_ATRlength.scxNumericField('setValue', renkoPriceStyle.boxSize.value || 1);
                else
                    this._input_boxSize.scxNumericField('setValue', renkoPriceStyle.boxSizeValue || 1);
                return;
            case KagiPriceStyle.className:
                var kagiPriceStyle = (this._config.priceStyle);
                this._boxSizeKind = kagiPriceStyle.reversal.kind;
                this._input_boxSizeKind.selectpicker('val', this._boxSizeKind || KagiReversalKind.ATR);
                if (this._boxSizeKind === KagiReversalKind.ATR)
                    this._input_reversalAmount.scxNumericField('setValue', kagiPriceStyle.reversal.value || 1);
                else
                    this._input_reversalDoubleAmount.scxNumericField('setValue', kagiPriceStyle.reversal.value || 1);
                return;
            case LineBreakPriceStyle.className:
                var lineBreakPriceStyle = (this._config.priceStyle);
                this._input_numberOfLine.scxNumericField('setValue', lineBreakPriceStyle.lines || 1);
                return;
            default:
                this.hide();
                return;
        }
    };
    PriceStyleSettingsDialog.prototype._getValues = function () {
        switch (this._priceStyleKind) {
            case PointAndFigurePriceStyle.className:
                var pointAndFigurePriceStyle = (this._config.priceStyle);
                pointAndFigurePriceStyle.boxSize.kind = this._input_boxSizeKind.val();
                if (pointAndFigurePriceStyle.boxSize.kind === PointAndFigureBoxSizeKind.ATR)
                    pointAndFigurePriceStyle.boxSize.value = this._input_ATRlength.scxNumericField('getValue');
                else
                    pointAndFigurePriceStyle.boxSize.value = this._input_boxSize.scxNumericField('getValue');
                pointAndFigurePriceStyle.reversal = this._input_reversalAmount.scxNumericField('getValue');
                return;
            case RenkoPriceStyle.className:
                var renkoPriceStyle = (this._config.priceStyle);
                renkoPriceStyle.boxSize.kind = this._input_boxSizeKind.val();
                if (renkoPriceStyle.boxSize.kind === RenkoBoxSizeKind.ATR)
                    renkoPriceStyle.boxSize.value = this._input_ATRlength.scxNumericField('getValue');
                else
                    renkoPriceStyle.boxSize.value = this._input_boxSize.scxNumericField('getValue');
                return;
            case KagiPriceStyle.className:
                var kagiPriceStyle = (this._config.priceStyle);
                kagiPriceStyle.reversal.kind = this._input_boxSizeKind.val();
                if (kagiPriceStyle.reversal.kind === KagiReversalKind.ATR)
                    kagiPriceStyle.reversal.value = this._input_ATRlength.scxNumericField('getValue');
                else
                    kagiPriceStyle.reversal.value = this._input_reversalDoubleAmount.scxNumericField('getValue');
                return;
            case LineBreakPriceStyle.className:
                var lineBreakPriceStyle = (this._config.priceStyle);
                lineBreakPriceStyle.lines = this._input_numberOfLine.scxNumericField('getValue');
                return;
            default:
                return;
        }
    };
    PriceStyleSettingsDialog.prototype._apply = function (applySaveSettings) {
        if (applySaveSettings === void 0) { applySaveSettings = true; }
        this._getValues();
        this._config.priceStyle.updateComputedDataSeries();
        this._config.priceStyle.chart.update();
        this._isApplyClicked = true;
        this.hide();
    };
    PriceStyleSettingsDialog._getTitle = function (priceStyleKind) {
        var name = "";
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
    };
    PriceStyleSettingsDialog.prototype._initFields = function () {
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
    };
    return PriceStyleSettingsDialog;
}(Dialog));
export { PriceStyleSettingsDialog };
//# sourceMappingURL=PriceStyleSettingsDialog.js.map