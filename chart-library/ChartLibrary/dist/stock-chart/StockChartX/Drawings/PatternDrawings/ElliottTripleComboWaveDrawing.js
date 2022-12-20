var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
        enumerable: true,
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