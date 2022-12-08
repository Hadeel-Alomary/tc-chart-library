import { ChartAlertDrawing } from './ChartAlertDrawing';
import { IPoint } from '../Graphics/ChartPoint';
export declare class ChartAlertChannelDrawing extends ChartAlertDrawing {
    protected _completeLinesDrawing(): void;
    protected _getHoverCartesianPoint(pointerPosition: IPoint): IPoint;
    protected _cartesianPoints(): IPoint[];
    private _drawBridge;
    private _drawCorner;
}
//# sourceMappingURL=ChartAlertChannelDrawing.d.ts.map