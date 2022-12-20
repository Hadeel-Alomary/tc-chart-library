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
        enumerable: true,
        configurable: true
    });
    return NoteDrawing;
}(NoteBase));
export { NoteDrawing };
Drawing.register(NoteDrawing);
//# sourceMappingURL=NoteDrawing.js.map