import { IPoint } from '../../Graphics/ChartPoint';
import { PanGesture } from '../../Gestures/PanGesture';
import { WindowEvent } from '../../Gestures/Gesture';
import { AbstractCurvedPathDrawing } from './AbstractCurvedPathDrawing';
export declare class ArcDrawing extends AbstractCurvedPathDrawing {
    static get className(): string;
    private distanceBeforeRotate;
    private rotateState;
    get pointsNeeded(): number;
    hitTest(point: IPoint): boolean;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    draw(): void;
    private curveControlPoint;
    private curveHeadPoint;
    private calculateHeadPointX;
    private distance;
    private slope;
    private lineEquation;
    private setHeadPoint;
    _finishUserDrawing(): void;
    canControlPointsBeManuallyChanged(): boolean;
}
//# sourceMappingURL=ArcDrawing.d.ts.map