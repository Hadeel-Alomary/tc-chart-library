import { Tc } from '../../../../utils';
var SnbcapitalOrderExecution = (function () {
    function SnbcapitalOrderExecution(type, name) {
        this.type = type;
        this.name = name;
    }
    SnbcapitalOrderExecution.getAllTypes = function () {
        if (!SnbcapitalOrderExecution.allTypes) {
            SnbcapitalOrderExecution.allTypes = [];
            SnbcapitalOrderExecution.allTypes.push(new SnbcapitalOrderExecution(SnbcapitalOrderExecutionType.Market, 'سعر السوق'));
            SnbcapitalOrderExecution.allTypes.push(new SnbcapitalOrderExecution(SnbcapitalOrderExecutionType.Limit, 'سعر محدد'));
        }
        return SnbcapitalOrderExecution.allTypes;
    };
    SnbcapitalOrderExecution.getExecutionByType = function (type) {
        return SnbcapitalOrderExecution.getAllTypes().find(function (item) { return item.type == type; });
    };
    SnbcapitalOrderExecution.isLimitOrder = function (order) {
        return order.execution.type == SnbcapitalOrderExecutionType.Limit;
    };
    SnbcapitalOrderExecution.getExecutionType = function (type) {
        if (type == 0) {
            Tc.error('order price type is 0 (not specified) which is not supported');
        }
        else if (type == 1) {
            Tc.error('order price type is 1 (opening auction) which is not supported');
        }
        else if (type == 2) {
            return this.getExecutionByType(SnbcapitalOrderExecutionType.Limit);
        }
        else if (type == 3) {
            return this.getExecutionByType(SnbcapitalOrderExecutionType.Market);
        }
        else if (type == 4) {
            Tc.error('order price type is 4 (limited for condional orders) which is not supported');
        }
        else if (type == 5) {
            Tc.error('order price type is 5 (market price for condional orders) which is not supported');
        }
        else {
            Tc.error('unknown price type ' + type);
        }
    };
    return SnbcapitalOrderExecution;
}());
export { SnbcapitalOrderExecution };
export var SnbcapitalOrderExecutionType;
(function (SnbcapitalOrderExecutionType) {
    SnbcapitalOrderExecutionType[SnbcapitalOrderExecutionType["Limit"] = 2] = "Limit";
    SnbcapitalOrderExecutionType[SnbcapitalOrderExecutionType["Market"] = 3] = "Market";
})(SnbcapitalOrderExecutionType || (SnbcapitalOrderExecutionType = {}));
//# sourceMappingURL=snbcapital-order-execution.js.map