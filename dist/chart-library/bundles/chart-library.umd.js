(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define('chart-library', ['exports'], factory) :
    (global = global || self, factory(global['chart-library'] = {}));
}(this, (function (exports) { 'use strict';

    var ChartClient = /** @class */ (function () {
        function ChartClient() {
        }
        return ChartClient;
    }());

    exports.ChartClient = ChartClient;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=chart-library.umd.js.map
