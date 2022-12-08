import { TextBase } from '../../Drawings/ChartMarkerDrawings/TextBase';
import { IRect } from '../../Graphics/Rect';
import { IPoint } from '../../Graphics/ChartPoint';
import { PanGesture } from '../../Gestures/PanGesture';
import { WindowEvent } from '../../Gestures/Gesture';
export declare class TextDrawingsBase extends TextBase {
    private _draggedWrappingPoint;
    bounds(): IRect;
    getTextRectangle(): IRect;
    hitTest(point: IPoint): boolean;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    draw(): void;
    private drawText;
    private xByTextDirection;
    private drawBackgroundIfNeeded;
    private drawBorderIfNeeded;
    private drawWrapBorderIfNeeded;
    private getMarkerPoints;
    private bottomCenterBorderPoint;
    private rightCenterBorderPoint;
    deleteDrawingIfNoTextExists(): boolean;
}
//# sourceMappingURL=TextDrawingsBase.d.ts.map