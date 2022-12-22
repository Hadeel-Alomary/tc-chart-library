import {TextDrawingsBase} from './TextDrawingsBase';
import {Drawing, IDrawingOptions} from '../Drawing';
import {IPointBehavior, XPointBehavior, YPointBehavior} from '../../Graphics/ChartPoint';

export class TextAnchoredDrawing extends TextDrawingsBase {
    static get className(): string {
        return 'textAnchored';
    }

    canControlPointsBeManuallyChanged(): boolean {
        return false;
    }

    protected getDefaultPointBehaviour(): IPointBehavior {
        return {x: XPointBehavior.X_PERCENT, y: YPointBehavior.Y_PERCENT};
    }

}

Drawing.register(TextAnchoredDrawing);
