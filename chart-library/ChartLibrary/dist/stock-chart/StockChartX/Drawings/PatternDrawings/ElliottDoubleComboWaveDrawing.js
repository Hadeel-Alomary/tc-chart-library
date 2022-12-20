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
        enumerable: true,
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