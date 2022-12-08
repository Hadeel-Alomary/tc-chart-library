import { __extends } from "tslib";
import { Drawing } from '../Drawing';
import { TextDrawingsBase } from './TextDrawingsBase';
var TextDrawing = (function (_super) {
    __extends(TextDrawing, _super);
    function TextDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(TextDrawing, "className", {
        get: function () {
            return 'text';
        },
        enumerable: false,
        configurable: true
    });
    return TextDrawing;
}(TextDrawingsBase));
export { TextDrawing };
Drawing.register(TextDrawing);
//# sourceMappingURL=TextDrawing.js.map