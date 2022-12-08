import { __extends } from "tslib";
import { Drawing } from '../Drawing';
import { ElliottThreePointsWaveDrawing } from './ElliotThreePointsWaveDrawing';
var ElliottCorrectionWaveDrawing = (function (_super) {
    __extends(ElliottCorrectionWaveDrawing, _super);
    function ElliottCorrectionWaveDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ElliottCorrectionWaveDrawing, "className", {
        get: function () {
            return 'elliottCorrectionWave';
        },
        enumerable: false,
        configurable: true
    });
    ElliottCorrectionWaveDrawing.prototype.getLabels = function () {
        return ['0', 'A', 'B', 'C'];
    };
    return ElliottCorrectionWaveDrawing;
}(ElliottThreePointsWaveDrawing));
export { ElliottCorrectionWaveDrawing };
Drawing.register(ElliottCorrectionWaveDrawing);
//# sourceMappingURL=ElliottCorrectionWaveDrawing.js.map