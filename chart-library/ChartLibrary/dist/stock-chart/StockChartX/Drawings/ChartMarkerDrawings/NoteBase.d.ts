import { IRect } from '../../Graphics/Rect';
import { IPoint } from '../../Graphics/ChartPoint';
import { Gesture, WindowEvent } from '../../Gestures/Gesture';
import { TextBase } from './TextBase';
export declare class NoteBase extends TextBase {
    rectangle: NoteRectangle;
    hover: boolean;
    pointerBounds(): IRect;
    hitTest(point: IPoint): boolean;
    get textWrapWidth(): number;
    set textWrapWidth(value: number);
    protected _handleMouseHover(gesture: Gesture, event: WindowEvent): void;
    draw(): void;
    private drawPointer;
    private CoordinatesOfRectangleBasedOnLocation;
    private normalSituation;
    private rectangleIsCloseToTheTop;
    private rectangleIsCloseToTheRight;
    private pointerIsCloseToRight;
    private rectangleIsCloseToTheLeft;
    private pointerIsCloseToLeft;
    private drawRect;
    private drawText;
    protected xByTextDirection(): number;
    private yByRectLocation;
    private lineHeight;
    private frame;
    private basicRectData;
    private basicTriangleData;
}
declare class NoteRectangle {
    rootX: number;
    centerRightX: number;
    centerLeftX: number;
    rightX: number;
    leftX: number;
    rootY: number;
    bottomY: number;
    topY: number;
}
export {};
//# sourceMappingURL=NoteBase.d.ts.map