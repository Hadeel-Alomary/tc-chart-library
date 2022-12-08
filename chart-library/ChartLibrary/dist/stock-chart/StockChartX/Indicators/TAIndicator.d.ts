import { IIndicatorConfig, Indicator, PlotItem } from './Indicator';
import { Recordset } from '../../TASdk/Recordset';
import { Field } from '../../TASdk/Field';
import { DataSeries } from '../Data/DataSeries';
import { IPoint } from '../Graphics/ChartPoint';
import { TAIndicatorParameters } from './TAIndicatorParameters';
export interface ITAIndicatorConfig extends IIndicatorConfig {
    taIndicator?: number;
}
export declare class TAIndicator extends Indicator {
    get indicatorTypeId(): number;
    constructor(config: ITAIndicatorConfig);
    _initIndicator(config: ITAIndicatorConfig): void;
    protected _initIndicatorParameters(config: ITAIndicatorConfig): void;
    protected _initIndicatorHorizontalLines(config: ITAIndicatorConfig): void;
    protected _initPanel(): void;
    isValidAlertParameters(): boolean;
    getAlertParameters(): (string | number)[];
    getParameters(): TAIndicatorParameters;
    getParametersString(): string;
    calculate(): {
        parameters: string;
        recordSet: Recordset;
        startIndex: number;
    };
    _createField(nameSuffix: string, fieldName?: string): Field;
    _createOpenField(): Field;
    _createHighField(): Field;
    _createLowField(): Field;
    _createCloseField(): Field;
    _createVolumeField(): Field;
    _createDateField(): Field;
    _createRecordset(): Recordset;
    protected _updatePlotItem(index: number): boolean;
    _updateVolumeIndicator(plotItem: PlotItem): void;
    protected hitTest(point: IPoint): boolean;
    _getFillDataSeries(): DataSeries[];
    _getIndicatorPlotType(fieldName: string): string;
    protected _getOverlayIndicatorDefaultSource(): string;
    private _getPlotTypeDependsOnIndicator;
    private _getCustomSourceField;
    resetDefaultSettings(): void;
    saveAsDefaultSettings(): void;
    protected calculateCustomRecordset(sourceField: Field): Recordset;
}
//# sourceMappingURL=TAIndicator.d.ts.map