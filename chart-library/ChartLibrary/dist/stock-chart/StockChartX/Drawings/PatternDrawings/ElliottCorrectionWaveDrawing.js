var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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