var AlertOperator = (function () {
    function AlertOperator(id, name, operationSymbol) {
        this.id = id;
        this.name = name;
        this.operationSymbol = operationSymbol;
    }
    AlertOperator.getOperators = function () {
        if (AlertOperator.operators.length <= 0) {
            AlertOperator.operators.push(new AlertOperator('GT', 'أكبر من', '>'));
            AlertOperator.operators.push(new AlertOperator('LT', 'أقل من', '<'));
            AlertOperator.operators.push(new AlertOperator('EQ', 'يساوي', '='));
            AlertOperator.operators.push(new AlertOperator('GE', 'أكبر أو يساوي', '>='));
            AlertOperator.operators.push(new AlertOperator('LE', 'أقل أو يساوي', '<='));
        }
        return AlertOperator.operators;
    };
    AlertOperator.fromOperationSymbol = function (operationSymbol) {
        for (var _i = 0, _a = AlertOperator.getOperators(); _i < _a.length; _i++) {
            var operation = _a[_i];
            if (operation.operationSymbol == operationSymbol) {
                return operation;
            }
        }
        return null;
    };
    AlertOperator.fromId = function (id) {
        for (var _i = 0, _a = AlertOperator.getOperators(); _i < _a.length; _i++) {
            var operation = _a[_i];
            if (operation.id == id) {
                return operation;
            }
        }
        return null;
    };
    AlertOperator.operators = [];
    return AlertOperator;
}());
export { AlertOperator };
//# sourceMappingURL=alert-operator.js.map