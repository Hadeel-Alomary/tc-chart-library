import { StringUtils } from './string.utils';
var SecurityUtils = (function () {
    function SecurityUtils() {
    }
    SecurityUtils.h = function (m) {
        return StringUtils.md5(atob(SecurityUtils.k) + m);
    };
    SecurityUtils.hBefore = function (h) {
        return StringUtils.md5(h + atob(SecurityUtils.k));
    };
    SecurityUtils.k = 'UlhfMDZfMDFfMTVfVEM=';
    return SecurityUtils;
}());
export { SecurityUtils };
//# sourceMappingURL=security.utils.js.map