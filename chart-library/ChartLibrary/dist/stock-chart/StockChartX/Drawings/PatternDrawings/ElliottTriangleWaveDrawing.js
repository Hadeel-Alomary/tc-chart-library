import { __extends } from "tslib";
import { ElliottFivePointsWaveDrawing } from './ElliottFivePointsWaveDrawing';
import { Drawing } from '../Drawing';
var ElliottTriangleWaveDrawing = (function (_super) {
    __extends(ElliottTriangleWaveDrawing, _super);
    function ElliottTriangleWaveDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ElliottTriangleWaveDrawing, "className", {
        get: function () {
            return 'elliottTriangleWave';
        },
        enumerable: false,
        configurable: true
    });
    ElliottTriangleWaveDrawing.prototype.getLabels = function () {
        return ['0', 'A', 'B', 'C', 'D', 'E'];
    };
    return ElliottTriangleWaveDrawing;
}(ElliottFivePointsWaveDrawing));
export { ElliottTriangleWaveDrawing };
Drawing.register(ElliottTriangleWaveDrawing);
//# sourceMappingURL=ElliottTriangleWaveDrawing.js.map