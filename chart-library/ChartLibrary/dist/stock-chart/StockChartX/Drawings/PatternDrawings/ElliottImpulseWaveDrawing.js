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