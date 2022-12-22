import {VirtualTradingOrder} from './virtual-trading-order';
import {VirtualTradingOrderAction} from './virtual-trading-order-action';

export class VirtualTradingOrderDetails {

    constructor(
        public order: VirtualTradingOrder,
        public actions: VirtualTradingOrderAction[]
    ) {}
}
