import {Drawing} from '../Drawing';
import {AbstractXABCDPatternDrawing} from './AbstractXABCDPatternDrawing';

export class XABCDPatternDrawing extends AbstractXABCDPatternDrawing {

  static get className(): string {
    return 'xabcdPattern';
  }

    protected calculatePointZeroToFourRatio(): number {
      return this.calculateRatio(1, 4, 0);
    }


}
Drawing.register(XABCDPatternDrawing);

