import { ChartAnnotation, IChartAnnotationConfig } from './ChartAnnotation';
import { IRect } from '../Graphics/Rect';
import { IPoint } from '../Graphics/ChartPoint';
import { Gesture, WindowEvent } from '../Gestures/Gesture';
import { Chart } from '../Chart';
export interface ISplitConfig extends IChartAnnotationConfig {
    splitValue: number;
}
export declare class SplitChartAnnotation extends ChartAnnotation {
    private width;
    private height;
    private padding;
    private splitValue;
    constructor(chart: Chart, config: ISplitConfig);
    draw(): void;
    protected bounds(): IRect;
    protected isVisible(): boolean;
    protected hitTest(point: IPoint): boolean;
    protected handleMouseHoverGesture(gesture: Gesture, event: WindowEvent): void;
    protected handleMouseClickGesture(gesture: Gesture, event: WindowEvent): void;
    private xInsideView;
    private getOffsetDistance;
}
//# sourceMappingURL=SplitChartAnnotation.d.ts.map