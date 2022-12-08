import { IDrawingState } from './Drawing';
import { TrendLineAlert, TrendLineAlertDrawingDefinition } from '../../../services/data/alert';
import { Interval } from '../../../services/loader';
import { ChartPoint, IPoint } from '../../StockChartX/Graphics/ChartPoint';
import { ThemedDrawing } from './ThemedDrawing';
import { DrawingTheme } from './DrawingThemeTypes';
export declare abstract class AlertableDrawing<T extends DrawingTheme> extends ThemedDrawing<T> {
    private _bellImage;
    private _achievedBellImage;
    private _updateAlertTimeoutHandle;
    loadState(state: IDrawingState): void;
    protected finishedDragging(): void;
    preDeleteCleanUp(): void;
    addOrEditAlert(): void;
    protected drawAlertBellIfNeeded(): void;
    private drawAlertBell;
    canAddAlerts(): boolean;
    createTrendLineAlert(): TrendLineAlert;
    getTrendLineAlertDefinition(interval: Interval): TrendLineAlertDrawingDefinition;
    protected getAlertIconPoint(): IPoint;
    protected abstract canAlertExtendRight(): boolean;
    protected abstract canAlertExtendLeft(): boolean;
    protected abstract getAlertFirstChartPoint(): ChartPoint;
    protected abstract getAlertSecondChartPoint(): ChartPoint;
}
//# sourceMappingURL=AlertableDrawing.d.ts.map