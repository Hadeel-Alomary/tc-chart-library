var EnumUtils = (function () {
    function EnumUtils() {
    }
    EnumUtils.enumValues = function (enumType) {
        return Object.keys(enumType).map(function (k) { return enumType[k]; }).filter(function (v) { return typeof v === "number"; });
    };
    EnumUtils.enumValueToString = function (enumType, enumValue) {
        return enumType[enumValue];
    };
    EnumUtils.enumStringToValue = function (enumType, enumString) {
        return enumType[enumString];
    };
    return EnumUtils;
}());
export { EnumUtils };
//# sourceMappingURL=enum.utils.js.map