import { IPoint } from '../../Graphics/ChartPoint';
import { PanGesture } from '../../Gestures/PanGesture';
import { WindowEvent } from '../../Gestures/Gesture';
import { GannBoxDrawingBase } from './GannBoxDrawingBase';
import { FibonacciSpeedResistanceFanDrawingTheme } from '../DrawingThemeTypes';
export declare class FibonacciSpeedResistanceFanDrawing extends GannBoxDrawingBase<FibonacciSpeedResistanceFanDrawingTheme> {
    static get className(): string;
    get pointsNeeded(): number;
    hitTest(point: IPoint): boolean;
    private priceLinesHitTest;
    private timeLinesHitTest;
    private fansHitTest;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    draw(): void;
    private drawPriceLevelsLinesAndFans;
    private drawPriceFans;
    getFanY(points: IPoint[], x3: number, levelValue: number): number;
    private drawPriceLines;
    private drawRightLabels;
    private drawLeftLabels;
    private drawTimeLevelsLinesAndFans;
    private drawTimeFans;
    private drawTimeLines;
    private drawTopLabels;
    private drawBottomLabels;
    private _getQuarter;
    private _calculateValue;
    private _calculateX;
}
//# sourceMappingURL=FibonacciSpeedResistanceFanDrawing.d.ts.map