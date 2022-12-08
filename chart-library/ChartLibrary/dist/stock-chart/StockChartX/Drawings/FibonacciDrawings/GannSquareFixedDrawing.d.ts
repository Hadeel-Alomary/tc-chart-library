import { GannSquareDrawingBase } from './GannSquareDrawingBase';
import { IPoint } from '../../Graphics/ChartPoint';
import { PanGesture } from '../../Gestures/PanGesture';
import { WindowEvent } from '../../Gestures/Gesture';
import { GannSquareFixedDrawingTheme } from '../DrawingThemeTypes';
export declare class GannSquareFixedDrawing extends GannSquareDrawingBase<GannSquareFixedDrawingTheme> {
    static get className(): string;
    fansValue: number[];
    arcsValue: number[];
    inDrawingState: boolean;
    get pointsNeeded(): number;
    startUserDrawing(): void;
    hitTest(point: IPoint): boolean;
    private levelsHitTest;
    private fansHitTest;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    draw(): void;
    private drawLevels;
    private drawFans;
    private drawArcs;
    private reversePoints;
    private _calculateDistance;
    private _getQuarter;
    private _horizontalDistance;
    private _verticalDistance;
    private _startAngle;
    private _endAngle;
    _finishUserDrawing(): void;
    private getMarkerPoints;
}
//# sourceMappingURL=GannSquareFixedDrawing.d.ts.map