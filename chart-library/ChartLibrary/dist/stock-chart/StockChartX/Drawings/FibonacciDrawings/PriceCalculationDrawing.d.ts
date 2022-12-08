import { IPoint } from '../../Graphics/ChartPoint';
import { WindowEvent } from "../../Gestures/Gesture";
import { PanGesture } from "../../Gestures/PanGesture";
import { LineWithTextDrawingTheme } from '../DrawingThemeTypes';
import { ThemedDrawing } from '../ThemedDrawing';
export declare class PriceCalculationDrawing extends ThemedDrawing<LineWithTextDrawingTheme> {
    static get className(): string;
    priceDiff: number;
    secondYPoint: number;
    get pointsNeeded(): number;
    private getTextHorizontalPositionAlignment;
    private getTextVerticalPositionAlignment;
    hitTest(point: IPoint): boolean;
    private calculatePriceHitTest;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    draw(): void;
    private drawPriceCalculation;
    private drawPriceCalculationText;
    private getTextHorizontalPosition;
    private getTextVerticalPosition;
    private _markerPoints;
    private _calculateSecondYPoint;
}
//# sourceMappingURL=PriceCalculationDrawing.d.ts.map