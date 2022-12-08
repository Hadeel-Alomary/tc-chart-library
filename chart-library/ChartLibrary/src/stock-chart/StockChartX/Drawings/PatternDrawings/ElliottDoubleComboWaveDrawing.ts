import {Drawing} from '../Drawing';
import {ElliottThreePointsWaveDrawing} from './ElliotThreePointsWaveDrawing';

export class ElliottDoubleComboWaveDrawing extends ElliottThreePointsWaveDrawing {

  static get className(): string {
    return 'elliottDoubleComboWave';
  }
    protected getLabels(): string[] {
        return ['0', 'W', 'X', 'Y'];
    }
}

Drawing.register(ElliottDoubleComboWaveDrawing);
