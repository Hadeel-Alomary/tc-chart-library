import { IPoint } from '../../Graphics/ChartPoint';
import { PanGesture } from '../../Gestures/PanGesture';
import { WindowEvent } from '../../Gestures/Gesture';
import { GannBoxDrawingBase } from './GannBoxDrawingBase';
import { GannBoxDrawingTheme } from '../DrawingThemeTypes';
export declare class GannBoxDrawing extends GannBoxDrawingBase<GannBoxDrawingTheme> {
    static get className(): string;
    get pointsNeeded(): number;
    hitTest(point: IPoint): boolean;
    private priceLinesHitTest;
    private timeLinesHitTest;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    draw(): void;
    private drawPriceLevels;
    private drawPriceLevelLines;
    private drawRightLabels;
    private drawLeftLabels;
    private drawPriceAngles;
    private drawTimeLevels;
    private drawTimeLevelLines;
    private drawTopLabels;
    private drawBottomLabels;
    private drawTimeAngles;
    private _getQuarter;
    private _calculateValue;
    private _calculateX;
}
//# sourceMappingURL=GannBoxDrawing.d.ts.map