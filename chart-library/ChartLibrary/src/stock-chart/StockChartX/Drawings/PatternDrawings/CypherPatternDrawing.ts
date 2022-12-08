import {Drawing} from '../Drawing';
import {AbstractXABCDPatternDrawing} from './AbstractXABCDPatternDrawing';

export class CypherPatternDrawing extends AbstractXABCDPatternDrawing {

    static get className(): string {
        return 'cypherPattern';
    }

    protected calculatePointZeroToFourRatio(): number {
        return this.calculateRatio(3, 4, 0);
    }

}
Drawing.register(CypherPatternDrawing);
