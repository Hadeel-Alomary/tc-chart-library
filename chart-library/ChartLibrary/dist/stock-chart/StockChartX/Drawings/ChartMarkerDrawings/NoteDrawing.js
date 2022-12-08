import { __extends } from "tslib";
import { Drawing } from '../Drawing';
import { NoteBase } from './NoteBase';
var NoteDrawing = (function (_super) {
    __extends(NoteDrawing, _super);
    function NoteDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(NoteDrawing, "className", {
        get: function () {
            return 'note';
        },
        enumerable: false,
        configurable: true
    });
    return NoteDrawing;
}(NoteBase));
export { NoteDrawing };
Drawing.register(NoteDrawing);
//# sourceMappingURL=NoteDrawing.js.map