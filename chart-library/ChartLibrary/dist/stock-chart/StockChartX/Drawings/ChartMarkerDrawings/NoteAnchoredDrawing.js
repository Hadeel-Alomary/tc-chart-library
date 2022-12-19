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