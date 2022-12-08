import {Drawing} from '../Drawing';
import {ElliottThreePointsWaveDrawing} from './ElliotThreePointsWaveDrawing';

export class ElliottCorrectionWaveDrawing extends ElliottThreePointsWaveDrawing {

    static get className(): string {
        return 'elliottCorrectionWave';
    }

    protected getLabels(): string[] {
        return ['0', 'A', 'B', 'C'];
    }
}

Drawing.register(ElliottCorrectionWaveDrawing);
