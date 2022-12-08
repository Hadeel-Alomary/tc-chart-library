import { TextDrawingsBase } from './TextDrawingsBase';
import { IPointBehavior } from '../../Graphics/ChartPoint';
export declare class TextAnchoredDrawing extends TextDrawingsBase {
    static get className(): string;
    canControlPointsBeManuallyChanged(): boolean;
    protected getDefaultPointBehaviour(): IPointBehavior;
}
//# sourceMappingURL=TextAnchoredDrawing.d.ts.map