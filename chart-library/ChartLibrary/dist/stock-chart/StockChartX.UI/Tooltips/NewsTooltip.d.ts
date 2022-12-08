import { ChartTooltip, ChartTooltipConfig, ChartTooltipType } from '../../../services/index';
import { IPoint } from '../../StockChartX/Graphics/ChartPoint';
import { ChartPanel } from '../../StockChartX/ChartPanels/ChartPanel';
import { DataRequesterTooltip } from './DataRequesterTooltip';
import { Observable } from 'rxjs/internal/Observable';
export interface NewsTooltipConfig extends ChartTooltipConfig {
    chartPanel: ChartPanel;
    mousePosition: IPoint;
    newsId: number;
}
export declare class NewsTooltip extends DataRequesterTooltip<string> implements ChartTooltip {
    private width;
    private height;
    private _isPointerInsideTooltip;
    private _config;
    private static _instance;
    static get instance(): NewsTooltip;
    private constructor();
    getType(): ChartTooltipType;
    show(config: NewsTooltipConfig): void;
    hide(): void;
    protected onDataCb(data: string): void;
    protected getTooltipId(): string;
    private hideTable;
    protected getRequestObservable(): Observable<string>;
    private getTableId;
    private _appendDataToHTML;
    private _setDimensions;
    private _initDetailsClickGesture;
    private _initGestures;
    private showTooltip;
}
//# sourceMappingURL=NewsTooltip.d.ts.map