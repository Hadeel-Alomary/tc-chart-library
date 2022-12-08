import { ChartAnnotation, IChartAnnotationConfig } from './ChartAnnotation';
import { IRect } from '../Graphics/Rect';
import { IPoint } from '../Graphics/ChartPoint';
import { Gesture, WindowEvent } from '../Gestures/Gesture';
import { CategoryNews } from '../../../services/data/news';
import { Chart } from '../Chart';
export interface INewsConfig extends IChartAnnotationConfig {
    categoryNews: CategoryNews;
}
export declare class NewsChartAnnotation extends ChartAnnotation {
    private width;
    private height;
    private padding;
    private categoryNews;
    constructor(chart: Chart, config: INewsConfig);
    draw(): void;
    protected bounds(): IRect;
    protected isVisible(): boolean;
    protected hitTest(point: IPoint): boolean;
    protected handleMouseHoverGesture(gesture: Gesture, event: WindowEvent): void;
    protected handleMouseClickGesture(gesture: Gesture, event: WindowEvent): void;
    private xInsideView;
    private getOffsetDistance;
}
//# sourceMappingURL=NewsChartAnnotation.d.ts.map