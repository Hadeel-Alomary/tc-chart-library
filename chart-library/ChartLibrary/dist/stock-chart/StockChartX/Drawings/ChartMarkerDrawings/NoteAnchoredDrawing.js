import { __extends } from "tslib";
import { NoteBase } from './NoteBase';
import { Drawing } from '../Drawing';
import { XPointBehavior, YPointBehavior } from '../../Graphics/ChartPoint';
var NoteAnchoredDrawing = (function (_super) {
    __extends(NoteAnchoredDrawing, _super);
    function NoteAnchoredDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(NoteAnchoredDrawing, "className", {
        get: function () {
            return 'noteAnchored';
        },
        enumerable: false,
        configurable: true
    });
    NoteAnchoredDrawing.prototype.canControlPointsBeManuallyChanged = function () {
        return false;
    };
    NoteAnchoredDrawing.prototype.getDefaultPointBehaviour = function () {
        return { x: XPointBehavior.X_PERCENT, y: YPointBehavior.Y_PERCENT };
    };
    return NoteAnchoredDrawing;
}(NoteBase));
export { NoteAnchoredDrawing };
Drawing.register(NoteAnchoredDrawing);
//# sourceMappingURL=NoteAnchoredDrawing.js.map