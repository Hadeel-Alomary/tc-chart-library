import { __extends } from "tslib";
import { Drawing } from '../Drawing';
import { ElliottFivePointsWaveDrawing } from './ElliottFivePointsWaveDrawing';
var ElliottImpulseWaveDrawing = (function (_super) {
    __extends(ElliottImpulseWaveDrawing, _super);
    function ElliottImpulseWaveDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ElliottImpulseWaveDrawing, "className", {
        get: function () {
            return 'elliottImpulseWave';
        },
        enumerable: false,
        configurable: true
    });
    ElliottImpulseWaveDrawing.prototype.getLabels = function () {
        return ['0', '1', '2', '3', '4', '5'];
    };
    return ElliottImpulseWaveDrawing;
}(ElliottFivePointsWaveDrawing));
export { ElliottImpulseWaveDrawing };
Drawing.register(ElliottImpulseWaveDrawing);
//# sourceMappingURL=ElliottImpulseWaveDrawing.js.map