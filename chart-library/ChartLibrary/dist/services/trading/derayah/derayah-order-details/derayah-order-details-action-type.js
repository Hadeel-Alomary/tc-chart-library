var DerayahOrderDetailsActionTypeWrapper = (function () {
    function DerayahOrderDetailsActionTypeWrapper(type, name) {
        this.type = type;
        this.name = name;
    }
    DerayahOrderDetailsActionTypeWrapper.getAllTypes = function () {
        if (DerayahOrderDetailsActionTypeWrapper.allTypes.length == 0) {
            DerayahOrderDetailsActionTypeWrapper.allTypes.push(new DerayahOrderDetailsActionTypeWrapper(DerayahOrderDetailsActionType.New, 'جديد'));
            DerayahOrderDetailsActionTypeWrapper.allTypes.push(new DerayahOrderDetailsActionTypeWrapper(DerayahOrderDetailsActionType.Modify, 'معدل'));
            DerayahOrderDetailsActionTypeWrapper.allTypes.push(new DerayahOrderDetailsActionTypeWrapper(DerayahOrderDetailsActionType.MainModify, 'معدل'));
            DerayahOrderDetailsActionTypeWrapper.allTypes.push(new DerayahOrderDetailsActionTypeWrapper(DerayahOrderDetailsActionType.Cancel, 'ملغي'));
            DerayahOrderDetailsActionTypeWrapper.allTypes.push(new DerayahOrderDetailsActionTypeWrapper(DerayahOrderDetailsActionType.Execution, 'منفذ'));
        }
        return DerayahOrderDetailsActionTypeWrapper.allTypes;
    };
    DerayahOrderDetailsActionTypeWrapper.fromType = function (type) {
        return DerayahOrderDetailsActionTypeWrapper.getAllTypes().find(function (item) { return item.type == type; });
    };
    DerayahOrderDetailsActionTypeWrapper.getTypeByTypeAsString = function (type) {
        return DerayahOrderDetailsActionTypeWrapper.fromType(type);
    };
    DerayahOrderDetailsActionTypeWrapper.allTypes = [];
    return DerayahOrderDetailsActionTypeWrapper;
}());
export { DerayahOrderDetailsActionTypeWrapper };
export var DerayahOrderDetailsActionType;
(function (DerayahOrderDetailsActionType) {
    DerayahOrderDetailsActionType[DerayahOrderDetailsActionType["New"] = 1] = "New";
    DerayahOrderDetailsActionType[DerayahOrderDetailsActionType["Modify"] = 2] = "Modify";
    DerayahOrderDetailsActionType[DerayahOrderDetailsActionType["MainModify"] = 3] = "MainModify";
    DerayahOrderDetailsActionType[DerayahOrderDetailsActionType["Cancel"] = 4] = "Cancel";
    DerayahOrderDetailsActionType[DerayahOrderDetailsActionType["Execution"] = 6] = "Execution";
})(DerayahOrderDetailsActionType || (DerayahOrderDetailsActionType = {}));
//# sourceMappingURL=derayah-order-details-action-type.js.map