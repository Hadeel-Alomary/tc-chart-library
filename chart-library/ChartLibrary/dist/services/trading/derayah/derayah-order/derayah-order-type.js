var DerayahOrderTypeWrapper = (function () {
    function DerayahOrderTypeWrapper(type, name) {
        this.type = type;
        this.name = name;
    }
    DerayahOrderTypeWrapper.getAllTypes = function () {
        if (!DerayahOrderTypeWrapper.allTypes) {
            DerayahOrderTypeWrapper.allTypes = [];
            DerayahOrderTypeWrapper.allTypes.push(new DerayahOrderTypeWrapper(DerayahOrderType.Buy, 'طلب شراء'));
            DerayahOrderTypeWrapper.allTypes.push(new DerayahOrderTypeWrapper(DerayahOrderType.Sell, 'طلب بيع'));
        }
        return DerayahOrderTypeWrapper.allTypes;
    };
    DerayahOrderTypeWrapper.fromType = function (type) {
        return DerayahOrderTypeWrapper.getAllTypes().find(function (item) { return item.type == type; });
    };
    DerayahOrderTypeWrapper.getDerayahOrderTypeAsString = function (type) {
        return DerayahOrderTypeWrapper.fromType(type);
    };
    return DerayahOrderTypeWrapper;
}());
export { DerayahOrderTypeWrapper };
export var DerayahOrderType;
(function (DerayahOrderType) {
    DerayahOrderType[DerayahOrderType["Buy"] = 1] = "Buy";
    DerayahOrderType[DerayahOrderType["Sell"] = 2] = "Sell";
})(DerayahOrderType || (DerayahOrderType = {}));
//# sourceMappingURL=derayah-order-type.js.map