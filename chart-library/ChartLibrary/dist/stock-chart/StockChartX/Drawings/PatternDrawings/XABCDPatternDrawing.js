import { __extends } from "tslib";
import { Drawing } from '../Drawing';
import { AbstractXABCDPatternDrawing } from './AbstractXABCDPatternDrawing';
var XABCDPatternDrawing = (function (_super) {
    __extends(XABCDPatternDrawing, _super);
    function XABCDPatternDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(XABCDPatternDrawing, "className", {
        get: function () {
            return 'xabcdPattern';
        },
        enumerable: false,
        configurable: true
    });
    XABCDPatternDrawing.prototype.calculatePointZeroToFourRatio = function () {
        return this.calculateRatio(1, 4, 0);
    };
    return XABCDPatternDrawing;
}(AbstractXABCDPatternDrawing));
export { XABCDPatternDrawing };
Drawing.register(XABCDPatternDrawing);
//# sourceMappingURL=XABCDPatternDrawing.js.map