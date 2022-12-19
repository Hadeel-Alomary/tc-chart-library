var SnbcapitalOrderFill = (function () {
    function SnbcapitalOrderFill(type, name) {
        this.type = type;
        this.name = name;
    }
    SnbcapitalOrderFill.getAllTypes = function () {
        if (SnbcapitalOrderFill.allStatus.length == 0) {
            SnbcapitalOrderFill.allStatus.push(new SnbcapitalOrderFill(SnbcapitalOrderFillType.Normal, 'عادي'));
            SnbcapitalOrderFill.allStatus.push(new SnbcapitalOrderFill(SnbcapitalOrderFillType.MinimumFill, 'اقل كمية  للتنفيذ'));
            SnbcapitalOrderFill.allStatus.push(new SnbcapitalOrderFill(SnbcapitalOrderFillType.AllOrNone, 'كل الكمية او لا شيء'));
        }
        return SnbcapitalOrderFill.allStatus;
    };
    SnbcapitalOrderFill.getByType = function (type) {
        return SnbcapitalOrderFill.getAllTypes().find(function (item) { return item.type == type; });
    };
    SnbcapitalOrderFill.getByTypeAsString = function (type) {
        return SnbcapitalOrderFill.getByType(+type);
    };
    SnbcapitalOrderFill.allStatus = [];
    return SnbcapitalOrderFill;
}());
export { SnbcapitalOrderFill };
export var SnbcapitalOrderFillType;
(function (SnbcapitalOrderFillType) {
    SnbcapitalOrderFillType[SnbcapitalOrderFillType["Normal"] = 1] = "Normal";
    SnbcapitalOrderFillType[SnbcapitalOrderFillType["MinimumFill"] = 2] = "MinimumFill";
    SnbcapitalOrderFillType[SnbcapitalOrderFillType["AllOrNone"] = 3] = "AllOrNone";
})(SnbcapitalOrderFillType || (SnbcapitalOrderFillType = {}));
//# sourceMappingURL=snbcapital-order-fill.js.map