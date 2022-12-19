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