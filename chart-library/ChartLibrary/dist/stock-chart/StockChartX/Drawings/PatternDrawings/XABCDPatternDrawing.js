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
import { AbstractXABCDPatternDrawing } from './AbstractXABCDPatternDrawing';
var XABCDPatternDrawing = (function (_super) {
    __extends(XABCDPatternDrawing, _super);
    function XABCDPatternDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(XABCDPatternDrawing, "className", {
        get: function () {
            return 'xabcdPattern';
        },
        enumerable: false,
        configurable: true
    });
    XABCDPatternDrawing.prototype.calculatePointZeroToFourRatio = function () {
        return this.calculateRatio(1, 4, 0);
    };
    return XABCDPatternDrawing;
}(AbstractXABCDPatternDrawing));
export { XABCDPatternDrawing };
Drawing.register(XABCDPatternDrawing);
//# sourceMappingURL=XABCDPatternDrawing.js.map