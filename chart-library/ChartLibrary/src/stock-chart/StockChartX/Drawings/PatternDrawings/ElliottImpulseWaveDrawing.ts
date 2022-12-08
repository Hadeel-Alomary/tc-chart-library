import {Drawing} from '../Drawing';
import {ElliottFivePointsWaveDrawing} from './ElliottFivePointsWaveDrawing';

export class ElliottImpulseWaveDrawing extends ElliottFivePointsWaveDrawing {

    static get className(): string {
        return 'elliottImpulseWave';
    }

    protected getLabels(): string[] {
        return ['0', '1', '2', '3', '4', '5'];
    }
}

Drawing.register(ElliottImpulseWaveDrawing);
