import { __extends } from "tslib";
import { Drawing } from '../Drawing';
import { AbstractXABCDPatternDrawing } from './AbstractXABCDPatternDrawing';
var CypherPatternDrawing = (function (_super) {
    __extends(CypherPatternDrawing, _super);
    function CypherPatternDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(CypherPatternDrawing, "className", {
        get: function () {
            return 'cypherPattern';
        },
        enumerable: false,
        configurable: true
    });
    CypherPatternDrawing.prototype.calculatePointZeroToFourRatio = function () {
        return this.calculateRatio(3, 4, 0);
    };
    return CypherPatternDrawing;
}(AbstractXABCDPatternDrawing));
export { CypherPatternDrawing };
Drawing.register(CypherPatternDrawing);
//# sourceMappingURL=CypherPatternDrawing.js.map