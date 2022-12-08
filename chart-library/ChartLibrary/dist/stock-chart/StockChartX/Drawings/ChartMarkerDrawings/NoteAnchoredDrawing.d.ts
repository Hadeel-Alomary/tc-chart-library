import { NoteBase } from './NoteBase';
import { IPointBehavior } from '../../Graphics/ChartPoint';
export declare class NoteAnchoredDrawing extends NoteBase {
    static get className(): string;
    canControlPointsBeManuallyChanged(): boolean;
    protected getDefaultPointBehaviour(): IPointBehavior;
}
//# sourceMappingURL=NoteAnchoredDrawing.d.ts.map