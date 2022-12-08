import {ElliottFivePointsWaveDrawing} from './ElliottFivePointsWaveDrawing';
import {Drawing} from '../Drawing';

export class ElliottTriangleWaveDrawing extends ElliottFivePointsWaveDrawing {
    static get className(): string {
        return 'elliottTriangleWave';
    }
    protected getLabels(): string[] {
        return ['0', 'A', 'B', 'C', 'D', 'E'];
    }
}

Drawing.register(ElliottTriangleWaveDrawing);
