var SnbcapitalOrderDetailsActionTypeWrapper = (function () {
    function SnbcapitalOrderDetailsActionTypeWrapper(type, name) {
        this.type = type;
        this.name = name;
    }
    SnbcapitalOrderDetailsActionTypeWrapper.getAllTypes = function () {
        if (SnbcapitalOrderDetailsActionTypeWrapper.allTypes.length == 0) {
            SnbcapitalOrderDetailsActionTypeWrapper.allTypes.push(new SnbcapitalOrderDetailsActionTypeWrapper(SnbcapitalOrderDetailsActionType.New, 'جديد'));
            SnbcapitalOrderDetailsActionTypeWrapper.allTypes.push(new SnbcapitalOrderDetailsActionTypeWrapper(SnbcapitalOrderDetailsActionType.Modify, 'معدل'));
            SnbcapitalOrderDetailsActionTypeWrapper.allTypes.push(new SnbcapitalOrderDetailsActionTypeWrapper(SnbcapitalOrderDetailsActionType.MainModify, 'معدل'));
            SnbcapitalOrderDetailsActionTypeWrapper.allTypes.push(new SnbcapitalOrderDetailsActionTypeWrapper(SnbcapitalOrderDetailsActionType.Cancel, 'ملغي'));
            SnbcapitalOrderDetailsActionTypeWrapper.allTypes.push(new SnbcapitalOrderDetailsActionTypeWrapper(SnbcapitalOrderDetailsActionType.Execution, 'منفذ'));
        }
        return SnbcapitalOrderDetailsActionTypeWrapper.allTypes;
    };
    SnbcapitalOrderDetailsActionTypeWrapper.fromType = function (type) {
        return SnbcapitalOrderDetailsActionTypeWrapper.getAllTypes().find(function (item) { return item.type == type; });
    };
    SnbcapitalOrderDetailsActionTypeWrapper.getTypeByTypeAsString = function (type) {
        return SnbcapitalOrderDetailsActionTypeWrapper.fromType(+type);
    };
    SnbcapitalOrderDetailsActionTypeWrapper.allTypes = [];
    return SnbcapitalOrderDetailsActionTypeWrapper;
}());
export { SnbcapitalOrderDetailsActionTypeWrapper };
export var SnbcapitalOrderDetailsActionType;
(function (SnbcapitalOrderDetailsActionType) {
    SnbcapitalOrderDetailsActionType[SnbcapitalOrderDetailsActionType["New"] = 1] = "New";
    SnbcapitalOrderDetailsActionType[SnbcapitalOrderDetailsActionType["Modify"] = 2] = "Modify";
    SnbcapitalOrderDetailsActionType[SnbcapitalOrderDetailsActionType["MainModify"] = 3] = "MainModify";
    SnbcapitalOrderDetailsActionType[SnbcapitalOrderDetailsActionType["Cancel"] = 4] = "Cancel";
    SnbcapitalOrderDetailsActionType[SnbcapitalOrderDetailsActionType["Execution"] = 6] = "Execution";
})(SnbcapitalOrderDetailsActionType || (SnbcapitalOrderDetailsActionType = {}));
//# sourceMappingURL=snbcapital-order-details-action-type.js.map