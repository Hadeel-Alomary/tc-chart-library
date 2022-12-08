import { IDrawingOptions } from '../Drawing';
import { PanGesture } from '../../Gestures/PanGesture';
import { WindowEvent } from '../../Gestures/Gesture';
import { IPoint } from '../../Graphics/ChartPoint';
import { GannSquareDrawingBase } from './GannSquareDrawingBase';
import { GannSquareDrawingTheme } from '../DrawingThemeTypes';
export interface IGannSquareDrawingOptions extends IDrawingOptions {
    endUserDrawing?: boolean;
}
export declare class GannSquareDrawing extends GannSquareDrawingBase<GannSquareDrawingTheme> {
    static get className(): string;
    fansValue: number[];
    arcsValue: number[];
    thirdPoint: IPoint;
    rangeAndRatio: number;
    get pointsNeeded(): number;
    get endUserDrawing(): boolean;
    set endUserDrawing(value: boolean);
    hitTest(point: IPoint): boolean;
    private levelsHitTest;
    private fansHitTest;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    draw(): void;
    private drawLevels;
    private drawFans;
    private drawArcs;
    private drawText;
    private _calculateThirdPoint;
    private _angles;
    private _getQuarter;
    private positionOfDivText;
    private positionOfBarsCountText;
    private positionOfPriceDiffText;
    private divOfPriceDifferenceAndBarsCount;
    getBarCount(): number;
    priceDifference(points: IPoint[]): number;
    _finishUserDrawing(): void;
    private getMarkerPoints;
}
//# sourceMappingURL=GannSquareDrawing.d.ts.map