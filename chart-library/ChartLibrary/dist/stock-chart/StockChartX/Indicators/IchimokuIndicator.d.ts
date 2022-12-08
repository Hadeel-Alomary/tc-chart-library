import { ITAIndicatorConfig, TAIndicator } from './TAIndicator';
import { DataSeries } from '../Data/DataSeries';
import { Recordset } from '../../TASdk/Recordset';
import { PanGesture } from '../Gestures/PanGesture';
import { TAIndicatorParameters } from './TAIndicatorParameters';
import { PlotItem } from './Indicator';
import { LineParameter } from './IndicatorsDefaultSettings';
export interface IIchimukoIndicatorConfig extends ITAIndicatorConfig {
}
export declare class IchimokuIndicator extends TAIndicator {
    private _tenkanSenDataseries;
    private _kijunSenDataseries;
    private _chikouSpanDataseries;
    private _senkouSpanADataseries;
    private _senkouSpanBDataseries;
    private _tenkanSenPlotItem;
    private _kijunSenPlotItem;
    private _chikouSpanPlotItem;
    private _senkouSpanAPlotItem;
    private _senkouSpanBPlotItem;
    private _kumoPlotItem;
    constructor(config: IIchimukoIndicatorConfig);
    get lines(): LineParameter[];
    get conversionLinePeriods(): number;
    set conversionLinePeriods(val: number);
    get baseLinePeriods(): number;
    set baseLinePeriods(val: number);
    get loggingSpan2Periods(): number;
    set loggingSpan2Periods(val: number);
    getAlertParameters(): number[];
    getParameters(): TAIndicatorParameters;
    getParametersString(): string;
    _initIndicator(): void;
    calculate(): {
        parameters: string;
        recordSet: Recordset;
        startIndex: number;
    };
    fixFirstNotNullIncorrectValue(dataserie: DataSeries): DataSeries;
    getDataserieFromRecordSet(recordSet: Recordset, fieldName: string, startIndex: number): DataSeries;
    shiftInToThePast(dataserie: DataSeries, positionsCount: number): DataSeries;
    shiftInToTheFuture(dataserie: DataSeries, positionsCount: number): DataSeries;
    hidePlotItem(plotItem: PlotItem): void;
    showPlotItem(plotItem: PlotItem): void;
    update(): void;
    showSettingsDialog(): void;
    _handlePanGesture(gesture: PanGesture): void;
}
//# sourceMappingURL=IchimokuIndicator.d.ts.map