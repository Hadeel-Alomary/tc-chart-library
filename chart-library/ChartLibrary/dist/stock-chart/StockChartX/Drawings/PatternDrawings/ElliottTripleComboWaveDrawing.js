import { __extends } from "tslib";
import { Drawing } from '../Drawing';
import { ElliottFivePointsWaveDrawing } from './ElliottFivePointsWaveDrawing';
var ElliottTripleComboWaveDrawing = (function (_super) {
    __extends(ElliottTripleComboWaveDrawing, _super);
    function ElliottTripleComboWaveDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ElliottTripleComboWaveDrawing, "className", {
        get: function () {
            return 'elliottTripleComboWave';
        },
        enumerable: false,
        configurable: true
    });
    ElliottTripleComboWaveDrawing.prototype.getLabels = function () {
        return ['0', 'W', 'X', 'Y', 'X', 'Z'];
    };
    return ElliottTripleComboWaveDrawing;
}(ElliottFivePointsWaveDrawing));
export { ElliottTripleComboWaveDrawing };
Drawing.register(ElliottTripleComboWaveDrawing);
//# sourceMappingURL=ElliottTripleComboWaveDrawing.js.map