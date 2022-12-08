import { __extends } from "tslib";
import { Drawing } from '../Drawing';
import { ElliottThreePointsWaveDrawing } from './ElliotThreePointsWaveDrawing';
var ElliottDoubleComboWaveDrawing = (function (_super) {
    __extends(ElliottDoubleComboWaveDrawing, _super);
    function ElliottDoubleComboWaveDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ElliottDoubleComboWaveDrawing, "className", {
        get: function () {
            return 'elliottDoubleComboWave';
        },
        enumerable: false,
        configurable: true
    });
    ElliottDoubleComboWaveDrawing.prototype.getLabels = function () {
        return ['0', 'W', 'X', 'Y'];
    };
    return ElliottDoubleComboWaveDrawing;
}(ElliottThreePointsWaveDrawing));
export { ElliottDoubleComboWaveDrawing };
Drawing.register(ElliottDoubleComboWaveDrawing);
//# sourceMappingURL=ElliottDoubleComboWaveDrawing.js.map