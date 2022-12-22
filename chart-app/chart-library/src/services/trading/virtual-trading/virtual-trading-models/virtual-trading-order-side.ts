export class VirtualTradingOrderSide {
    constructor(
        public value: string,
        public arabic: string,
        public english: string
    ){}

    private static allOrderSides = {
        BUY: new VirtualTradingOrderSide('BUY', 'شراء', 'Buy'),
        SELL: new VirtualTradingOrderSide('SELL', 'بيع', 'Sell'),
    };

    public static fromValue(value: string): VirtualTradingOrderSide {
        switch (value) {
            case 'BUY':
                return VirtualTradingOrderSide.allOrderSides.BUY;
            case 'SELL':
                return VirtualTradingOrderSide.allOrderSides.SELL;
            default:
                return null;
        }
    }

    public static allSides(): VirtualTradingOrderSide[] {
        return [
            VirtualTradingOrderSide.allOrderSides.BUY,
            VirtualTradingOrderSide.allOrderSides.SELL
        ];
    }

}
