import {NoteBase} from './NoteBase';
import {Drawing} from '../Drawing';
import {IPointBehavior, XPointBehavior, YPointBehavior} from '../../Graphics/ChartPoint';

export class NoteAnchoredDrawing extends NoteBase{
    static get className(): string {
        return 'noteAnchored';
    }

    canControlPointsBeManuallyChanged(): boolean {
        return false;
    }

    protected getDefaultPointBehaviour(): IPointBehavior {
        return {x: XPointBehavior.X_PERCENT, y: YPointBehavior.Y_PERCENT};
    }


}
Drawing.register(NoteAnchoredDrawing);
