import {VirtualTradingOrderActionType} from './virtual-trading-order-action-type';
import {VirtualTradingOrderActionResponse} from '../../../loader/trading/virtual-trading';

export class VirtualTradingOrderAction {

    constructor(
        public id: number,
        public actionType: VirtualTradingOrderActionType,
        public createdAt: string,
        public updatedAt: string
    ) {}

    public static mapResponseToVirtualTradingOrderActions(response: VirtualTradingOrderActionResponse[]): VirtualTradingOrderAction[] {
        let result: VirtualTradingOrderAction[] = [];
        for(let responseObject of response) {
            result.push(new VirtualTradingOrderAction(
                responseObject.id,
                VirtualTradingOrderActionType.fromValue(responseObject.action_type),
                responseObject.created_at,
                responseObject.updated_at
            ));
        }
        return result;
    }
}
