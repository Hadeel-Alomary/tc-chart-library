import { __extends } from "tslib";
import { TextDrawingsBase } from './TextDrawingsBase';
import { Drawing } from '../Drawing';
import { XPointBehavior, YPointBehavior } from '../../Graphics/ChartPoint';
var TextAnchoredDrawing = (function (_super) {
    __extends(TextAnchoredDrawing, _super);
    function TextAnchoredDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(TextAnchoredDrawing, "className", {
        get: function () {
            return 'textAnchored';
        },
        enumerable: false,
        configurable: true
    });
    TextAnchoredDrawing.prototype.canControlPointsBeManuallyChanged = function () {
        return false;
    };
    TextAnchoredDrawing.prototype.getDefaultPointBehaviour = function () {
        return { x: XPointBehavior.X_PERCENT, y: YPointBehavior.Y_PERCENT };
    };
    return TextAnchoredDrawing;
}(TextDrawingsBase));
export { TextAnchoredDrawing };
Drawing.register(TextAnchoredDrawing);
//# sourceMappingURL=TextAnchoredDrawing.js.map