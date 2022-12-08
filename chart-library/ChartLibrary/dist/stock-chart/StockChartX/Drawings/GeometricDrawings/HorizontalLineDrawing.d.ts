import { IDrawingOptions } from '../Drawing';
import { IRect } from '../../Graphics/Rect';
import { ChartPoint, IPoint } from '../../Graphics/ChartPoint';
import { AlertableDrawing } from '../AlertableDrawing';
import { LineWithTextDrawingTheme } from '../DrawingThemeTypes';
export interface IHorizontalLineDrawingOptions extends IDrawingOptions {
    showValue: boolean;
    text: string;
}
export declare class HorizontalLineDrawing extends AlertableDrawing<LineWithTextDrawingTheme> {
    static get className(): string;
    get text(): string;
    set text(value: string);
    get textHorizontalPosition(): string;
    set textHorizontalPosition(value: string);
    get textVerticalPosition(): string;
    set textVerticalPosition(value: string);
    bounds(): IRect;
    hitTest(point: IPoint): boolean;
    draw(): void;
    drawValue(): void;
    protected drawText(point: IPoint): void;
    protected getTextHorizontalPosition(point: IPoint): number;
    protected isHorizontalLineAlert(): boolean;
    protected canAlertExtendRight(): boolean;
    protected canAlertExtendLeft(): boolean;
    protected getAlertFirstChartPoint(): ChartPoint;
    protected getAlertIconPoint(): IPoint;
    protected getAlertSecondChartPoint(): ChartPoint;
    private getTextVerticalPosition;
    protected shouldDrawMarkers(): boolean;
}
//# sourceMappingURL=HorizontalLineDrawing.d.ts.map