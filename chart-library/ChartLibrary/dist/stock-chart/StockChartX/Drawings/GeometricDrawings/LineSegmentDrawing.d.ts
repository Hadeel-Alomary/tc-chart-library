import { IRect } from '../../Graphics/Rect';
import { ChartPoint, IPoint } from '../../Graphics/ChartPoint';
import { PanGesture } from '../../Gestures/PanGesture';
import { WindowEvent } from '../../Gestures/Gesture';
import { AlertableDrawing } from '../AlertableDrawing';
import { FilledShapeDrawingTheme } from '../DrawingThemeTypes';
export declare class LineSegmentDrawing extends AlertableDrawing<FilledShapeDrawingTheme> {
    static get className(): string;
    get pointsNeeded(): number;
    get hasTooltip(): boolean;
    bounds(): IRect;
    hitTest(point: IPoint): boolean;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    protected canAlertExtendRight(): boolean;
    protected canAlertExtendLeft(): boolean;
    protected getAlertFirstChartPoint(): ChartPoint;
    protected getAlertSecondChartPoint(): ChartPoint;
    draw(): void;
}
//# sourceMappingURL=LineSegmentDrawing.d.ts.map