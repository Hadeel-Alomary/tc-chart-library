import { Tc } from '../../utils/index';
var ChartAccessorService = (function () {
    function ChartAccessorService() {
    }
    Object.defineProperty(ChartAccessorService, "instance", {
        get: function () {
            Tc.assert(ChartAccessorService._instance !== null, "Trying to access chart accessor before initialize it");
            return ChartAccessorService._instance;
        },
        enumerable: false,
        configurable: true
    });
    ChartAccessorService._instance = null;
    return ChartAccessorService;
}());
export { ChartAccessorService };
//# sourceMappingURL=chart-accessor.service.js.map