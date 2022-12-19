var DerayahOrderFill = (function () {
    function DerayahOrderFill(type, name) {
        this.type = type;
        this.name = name;
    }
    DerayahOrderFill.getAllTypes = function () {
        if (DerayahOrderFill.allStatus.length == 0) {
            DerayahOrderFill.allStatus.push(new DerayahOrderFill(DerayahOrderFillType.Normal, 'عادي'));
            DerayahOrderFill.allStatus.push(new DerayahOrderFill(DerayahOrderFillType.MinimumFill, 'اقل كمية  للتنفيذ'));
            DerayahOrderFill.allStatus.push(new DerayahOrderFill(DerayahOrderFillType.AllOrNone, 'كل الكمية او لا شيء'));
        }
        return DerayahOrderFill.allStatus;
    };
    DerayahOrderFill.getByType = function (type) {
        return DerayahOrderFill.getAllTypes().find(function (item) { return item.type == type; });
    };
    DerayahOrderFill.getByTypeAsString = function (type) {
        return DerayahOrderFill.getByType(+type);
    };
    DerayahOrderFill.allStatus = [];
    return DerayahOrderFill;
}());
export { DerayahOrderFill };
export var DerayahOrderFillType;
(function (DerayahOrderFillType) {
    DerayahOrderFillType[DerayahOrderFillType["Normal"] = 1] = "Normal";
    DerayahOrderFillType[DerayahOrderFillType["MinimumFill"] = 2] = "MinimumFill";
    DerayahOrderFillType[DerayahOrderFillType["AllOrNone"] = 3] = "AllOrNone";
})(DerayahOrderFillType || (DerayahOrderFillType = {}));
//# sourceMappingURL=derayah-order-fill.js.map