import { IPoint } from '../../Graphics/ChartPoint';
import { PanGesture } from '../../Gestures/PanGesture';
import { WindowEvent } from '../../Gestures/Gesture';
import { AbstractCurvedPathDrawing } from './AbstractCurvedPathDrawing';
export declare class CurveDrawing extends AbstractCurvedPathDrawing {
    static get className(): string;
    get pointsNeeded(): number;
    hitTest(point: IPoint): boolean;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    draw(): void;
    private curveControlPoints;
    private headPoint;
    private calculateHeadPointX;
    private distance;
    private slope;
    _finishUserDrawing(): void;
}
//# sourceMappingURL=CurveDrawing.d.ts.map