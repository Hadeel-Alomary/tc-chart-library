import { Tc } from '../../../../utils';
export var TradestationOrderExecutionType;
(function (TradestationOrderExecutionType) {
    TradestationOrderExecutionType["Market"] = "Market";
    TradestationOrderExecutionType["Limit"] = "Limit";
    TradestationOrderExecutionType["Stop"] = "Stop";
})(TradestationOrderExecutionType || (TradestationOrderExecutionType = {}));
var TradestationOrderExecution = (function () {
    function TradestationOrderExecution(type, arabic, english) {
        this.type = type;
        this.arabic = arabic;
        this.english = english;
    }
    TradestationOrderExecution.getAllTypes = function () {
        if (!TradestationOrderExecution.allTypes) {
            TradestationOrderExecution.allTypes = [];
            TradestationOrderExecution.allTypes.push(new TradestationOrderExecution(TradestationOrderExecutionType.Market, 'سعر السوق', 'Market Price'));
            TradestationOrderExecution.allTypes.push(new TradestationOrderExecution(TradestationOrderExecutionType.Limit, 'سعر محدد', 'Limit Price'));
            TradestationOrderExecution.allTypes.push(new TradestationOrderExecution(TradestationOrderExecutionType.Stop, 'وقف', 'Stop'));
        }
        return TradestationOrderExecution.allTypes;
    };
    TradestationOrderExecution.getOrderExecutionByType = function (type) {
        var orderExecution = TradestationOrderExecution.getAllTypes().find(function (item) { return item.type == type; });
        if (!orderExecution) {
            Tc.error('wrong execution type');
            return null;
        }
        return orderExecution;
    };
    return TradestationOrderExecution;
}());
export { TradestationOrderExecution };
//# sourceMappingURL=tradestation-order-execution.js.map