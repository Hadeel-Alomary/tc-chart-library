var DerayahOrderExecution = (function () {
    function DerayahOrderExecution(type, name) {
        this.type = type;
        this.name = name;
    }
    DerayahOrderExecution.getAllTypes = function () {
        if (!DerayahOrderExecution.allTypes) {
            DerayahOrderExecution.allTypes = [];
            DerayahOrderExecution.allTypes.push(new DerayahOrderExecution(DerayahOrderExecutionType.Market, 'سعر السوق'));
            DerayahOrderExecution.allTypes.push(new DerayahOrderExecution(DerayahOrderExecutionType.Limit, 'سعر محدد'));
        }
        return DerayahOrderExecution.allTypes;
    };
    DerayahOrderExecution.getExecutionByType = function (type) {
        return DerayahOrderExecution.getAllTypes().find(function (item) { return item.type == type; });
    };
    DerayahOrderExecution.getExecutionByTypeAsString = function (type) {
        return DerayahOrderExecution.getExecutionByType(type);
    };
    return DerayahOrderExecution;
}());
export { DerayahOrderExecution };
export var DerayahOrderExecutionType;
(function (DerayahOrderExecutionType) {
    DerayahOrderExecutionType[DerayahOrderExecutionType["Limit"] = 5] = "Limit";
    DerayahOrderExecutionType[DerayahOrderExecutionType["Market"] = 7] = "Market";
})(DerayahOrderExecutionType || (DerayahOrderExecutionType = {}));
//# sourceMappingURL=derayah-order-execution.js.map