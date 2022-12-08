import {Drawing} from '../Drawing';
import {ElliottFivePointsWaveDrawing} from './ElliottFivePointsWaveDrawing';

export class ElliottTripleComboWaveDrawing extends ElliottFivePointsWaveDrawing {
    static get className(): string {
        return 'elliottTripleComboWave';
    }

    protected getLabels(): string[] {
        return ['0', 'W', 'X', 'Y', 'X', 'Z'];
    }
}

Drawing.register(ElliottTripleComboWaveDrawing);
