import { FibonacciDrawingBase } from './FibonacciDrawingBase';
import { IPoint } from '../../Graphics/ChartPoint';
import { PanGesture } from '../../Gestures/PanGesture';
import { WindowEvent } from '../../Gestures/Gesture';
import { FibonacciSpeedResistanceArcsDrawingTheme } from '../DrawingThemeTypes';
export declare class FibonacciSpeedResistanceArcsDrawing extends FibonacciDrawingBase<FibonacciSpeedResistanceArcsDrawingTheme> {
    static get className(): string;
    get showFullCircle(): boolean;
    get pointsNeeded(): number;
    hitTest(point: IPoint): boolean;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    draw(): void;
    private drawTrendLineIfVisible;
    private drawArcs;
    private drawLevelsValueIfVisible;
    private distance;
    private startAngle;
    private endAngle;
    private textPosition;
}
//# sourceMappingURL=FibonacciSpeedResistanceArcsDrawing.d.ts.map