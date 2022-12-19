var ArrayUtils = (function () {
    function ArrayUtils() {
    }
    ArrayUtils.values = function (obj) {
        return Object.keys(obj).map(function (v) { return obj[v]; });
    };
    return ArrayUtils;
}());
export { ArrayUtils };
//# sourceMappingURL=array.utils.js.map