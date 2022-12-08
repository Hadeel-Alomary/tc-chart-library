export class VirtualTradingOrderStatus {
    constructor(
        public value: string,
        public arabic: string,
        public english: string
    ){}

    private static allOrderStatuses: {[key: string]: VirtualTradingOrderStatus} = {
        ALL: new VirtualTradingOrderStatus('ALL', 'الكل', 'All'),
        ACTIVE: new VirtualTradingOrderStatus('ACTIVE', 'مفعّل', 'Active'),
        DELETED: new VirtualTradingOrderStatus('DELETED', 'ملغي', 'Deleted'),
        EXECUTED: new VirtualTradingOrderStatus('EXECUTED','منفّذ', 'Executed'),
        REJECTED: new VirtualTradingOrderStatus('REJECTED','مرفوض', 'Rejected')
    };

    public static fromValue(value: string): VirtualTradingOrderStatus {
        switch (value) {
            case 'ALL':
                return VirtualTradingOrderStatus.allOrderStatuses.ALL;
            case 'ACTIVE':
                return VirtualTradingOrderStatus.allOrderStatuses.ACTIVE;
            case 'DELETED':
            case 'EXPIRED':
                return VirtualTradingOrderStatus.allOrderStatuses.DELETED;
            case 'EXECUTED':
                return VirtualTradingOrderStatus.allOrderStatuses.EXECUTED;
            case 'REJECTED':
                return VirtualTradingOrderStatus.allOrderStatuses.REJECTED;
            default:
                return null;
        }
    }

    public static allStatuses(): VirtualTradingOrderStatus[] {
        let result: VirtualTradingOrderStatus[] = [];
        for(let key in VirtualTradingOrderStatus.allOrderStatuses) {
            result.push(VirtualTradingOrderStatus.allOrderStatuses[key]);
        }
        return result;
    }

}
