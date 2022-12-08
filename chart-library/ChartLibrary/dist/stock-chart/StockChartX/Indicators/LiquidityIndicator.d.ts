import { ITAIndicatorConfig, TAIndicator } from './TAIndicator';
import { Recordset } from '../../TASdk/Recordset';
import { PanGesture } from '../Gestures/PanGesture';
export interface LiquidityIndicatorConfig extends ITAIndicatorConfig {
}
export declare class LiquidityIndicator extends TAIndicator {
    private _activeSymbol;
    private _activeInterval;
    private _subscription;
    private _cachedRecordSet;
    private _recalculateRecordSet;
    constructor(config?: LiquidityIndicatorConfig);
    _initIndicator(config: LiquidityIndicatorConfig): void;
    calculate(): {
        parameters: string;
        recordSet: Recordset;
        startIndex: number;
    };
    getParametersString(): string;
    destroy(): void;
    _getIndicatorPlotType(fieldName: string): string;
    _handlePanGesture(gesture: PanGesture): void;
    _initPanel(): void;
    _preUpdateSetup(): void;
    private _getNetValues;
    private _getNetVolumeValues;
    private _getAccumulatedNetValues;
    private _getAccumulatedNetVolumeValues;
    private _getInflowValues;
    private _getOutflowValues;
    private _getInflowVolumeValues;
    private _getOutflowVolumeValues;
    private _getFieldValues;
    private _getRecordSet;
    private _calculateRecordSet;
    private getDateDataSeries;
    private _redrawChartOnLiquidityChange;
}
//# sourceMappingURL=LiquidityIndicator.d.ts.map