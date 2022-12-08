import { ChartPanelObject, IChartPanelObjectConfig } from '../ChartPanels/ChartPanelObject';
import { IPoint } from '../Graphics/ChartPoint';
import { Gesture, WindowEvent } from '../Gestures/Gesture';
import { ChartPanel } from '../ChartPanels/ChartPanel';
import { Chart, IRect } from '../..';
export declare enum ChartAnnotationType {
    Split = 1,
    TradingOrder = 2,
    News = 3
}
export interface IChartAnnotationConfig extends IChartPanelObjectConfig {
    date: string;
    type: ChartAnnotationType;
    belowCandle: boolean;
}
export declare const ChartAnnotationEvents: {
    CLICK_EVENT: string;
    HOVER_EVENT: string;
};
export declare abstract class ChartAnnotation extends ChartPanelObject {
    private gestures;
    protected type: ChartAnnotationType;
    protected date: string;
    protected time: number;
    protected belowCandle: boolean;
    protected offset: number;
    constructor(chart: Chart, config: IChartAnnotationConfig);
    abstract draw(): void;
    protected abstract bounds(): IRect;
    protected abstract isVisible(): boolean;
    protected abstract hitTest(point: IPoint): boolean;
    protected abstract handleMouseClickGesture(gesture: Gesture, event: WindowEvent): void;
    getAnnotationType(): ChartAnnotationType;
    setOffset(offset: number): void;
    handleEvent(event: WindowEvent): boolean;
    setPanel(panel: ChartPanel): void;
    isBelowCandle(): boolean;
    getPositionIndex(): number;
    protected getCandleHigh(): number;
    protected getCandleLow(): number;
    protected handleMouseHoverGesture(gesture: Gesture, event: WindowEvent): void;
    protected getRecord(): number;
    private setInitialState;
    private initGesture;
    private getPriceData;
}
//# sourceMappingURL=ChartAnnotation.d.ts.map