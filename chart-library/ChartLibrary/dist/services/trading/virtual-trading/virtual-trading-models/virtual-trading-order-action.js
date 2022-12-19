import { VirtualTradingOrderActionType } from './virtual-trading-order-action-type';
var VirtualTradingOrderAction = (function () {
    function VirtualTradingOrderAction(id, actionType, createdAt, updatedAt) {
        this.id = id;
        this.actionType = actionType;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    VirtualTradingOrderAction.mapResponseToVirtualTradingOrderActions = function (response) {
        var result = [];
        for (var _i = 0, response_1 = response; _i < response_1.length; _i++) {
            var responseObject = response_1[_i];
            result.push(new VirtualTradingOrderAction(responseObject.id, VirtualTradingOrderActionType.fromValue(responseObject.action_type), responseObject.created_at, responseObject.updated_at));
        }
        return result;
    };
    return VirtualTradingOrderAction;
}());
export { VirtualTradingOrderAction };
//# sourceMappingURL=virtual-trading-order-action.js.map