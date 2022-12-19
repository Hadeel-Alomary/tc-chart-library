var SnbcapitalOrderTypeWrapper = (function () {
    function SnbcapitalOrderTypeWrapper(type, name) {
        this.type = type;
        this.name = name;
    }
    SnbcapitalOrderTypeWrapper.getAllTypes = function () {
        if (!SnbcapitalOrderTypeWrapper.allTypes) {
            SnbcapitalOrderTypeWrapper.allTypes = [];
            SnbcapitalOrderTypeWrapper.allTypes.push(new SnbcapitalOrderTypeWrapper(SnbcapitalOrderType.Buy, 'شراء'));
            SnbcapitalOrderTypeWrapper.allTypes.push(new SnbcapitalOrderTypeWrapper(SnbcapitalOrderType.Sell, 'بيع'));
        }
        return SnbcapitalOrderTypeWrapper.allTypes;
    };
    SnbcapitalOrderTypeWrapper.fromType = function (type) {
        return SnbcapitalOrderTypeWrapper.getAllTypes().find(function (item) { return item.type == type; });
    };
    SnbcapitalOrderTypeWrapper.getSnbcapitalOrderType = function (type) {
        return SnbcapitalOrderTypeWrapper.fromType(type);
    };
    return SnbcapitalOrderTypeWrapper;
}());
export { SnbcapitalOrderTypeWrapper };
export var SnbcapitalOrderType;
(function (SnbcapitalOrderType) {
    SnbcapitalOrderType[SnbcapitalOrderType["Buy"] = 1] = "Buy";
    SnbcapitalOrderType[SnbcapitalOrderType["Sell"] = 2] = "Sell";
})(SnbcapitalOrderType || (SnbcapitalOrderType = {}));
//# sourceMappingURL=snbcapital-order-type.js.map