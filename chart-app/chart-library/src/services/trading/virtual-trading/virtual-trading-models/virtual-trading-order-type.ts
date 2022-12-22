export class VirtualTradingOrderType {
    constructor(
        public value: string,
        public arabic: string,
        public english: string
    ){}

    private static allOrderTypes: {[key: string]: VirtualTradingOrderType} = {
        MANUAL: new VirtualTradingOrderType('MANUAL', 'يدوي', 'Manual'),
        MARKET: new VirtualTradingOrderType('MARKET', 'سعر السوق', 'Market Price'),
        LIMIT: new VirtualTradingOrderType('LIMIT', 'سعر محدد', 'Limit Price'),
        STOP: new VirtualTradingOrderType('STOP', 'توقف', 'Stop Loss')
    };

    public static fromValue(value: string): VirtualTradingOrderType {
        switch (value) {
            case 'MANUAL':
                return VirtualTradingOrderType.allOrderTypes.MANUAL;
            case 'MARKET':
                return VirtualTradingOrderType.allOrderTypes.MARKET;
            case 'LIMIT':
                return VirtualTradingOrderType.allOrderTypes.LIMIT;
            case 'STOP':
                return VirtualTradingOrderType.allOrderTypes.STOP;
            default:
                return null;
        }
    }

    public static allTypes(): VirtualTradingOrderType[] {
        let result: VirtualTradingOrderType[] = [];
        for(let key in VirtualTradingOrderType.allOrderTypes) {
            result.push(VirtualTradingOrderType.allOrderTypes[key]);
        }
        return result;
    }

    public static allBuyTypes(): VirtualTradingOrderType[] {
        return [
            VirtualTradingOrderType.allOrderTypes.LIMIT,
            VirtualTradingOrderType.allOrderTypes.MARKET,
        ]
    }

    public static allSellTypes(): VirtualTradingOrderType[] {
        return [
            VirtualTradingOrderType.allOrderTypes.LIMIT,
            VirtualTradingOrderType.allOrderTypes.MARKET,
            VirtualTradingOrderType.allOrderTypes.STOP
        ]
    }

}
