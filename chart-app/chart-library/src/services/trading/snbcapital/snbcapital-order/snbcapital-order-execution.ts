import {Tc} from '../../../../utils';
import {SnbcapitalOrder} from './snbcapital-order';

export class SnbcapitalOrderExecution{

    private static allTypes:SnbcapitalOrderExecution[];

    constructor(
        public type:SnbcapitalOrderExecutionType,
        public name:string
    ){}

    public static getAllTypes():SnbcapitalOrderExecution[]{
        if(!SnbcapitalOrderExecution.allTypes){
            SnbcapitalOrderExecution.allTypes = [];
            SnbcapitalOrderExecution.allTypes.push(new SnbcapitalOrderExecution(SnbcapitalOrderExecutionType.Market, 'سعر السوق'));
            SnbcapitalOrderExecution.allTypes.push(new SnbcapitalOrderExecution(SnbcapitalOrderExecutionType.Limit, 'سعر محدد'));
        }

        return SnbcapitalOrderExecution.allTypes;
    }

    public static getExecutionByType(type:SnbcapitalOrderExecutionType):SnbcapitalOrderExecution{
        return SnbcapitalOrderExecution.getAllTypes().find(item => item.type == type);
    }

    public static isLimitOrder(order: SnbcapitalOrder) {
        return order.execution.type == SnbcapitalOrderExecutionType.Limit;
    }

    public static getExecutionType(type: number): SnbcapitalOrderExecution {
        if(type == 0){
            Tc.error('order price type is 0 (not specified) which is not supported')
        }else if (type == 1){
            Tc.error('order price type is 1 (opening auction) which is not supported')
        } else if (type == 2) {
            return this.getExecutionByType(SnbcapitalOrderExecutionType.Limit);
        } else if (type == 3) {
            return this.getExecutionByType(SnbcapitalOrderExecutionType.Market);
        }else if (type == 4) {
            Tc.error('order price type is 4 (limited for condional orders) which is not supported')
        } else if (type == 5) {
            Tc.error('order price type is 5 (market price for condional orders) which is not supported')
        }else {
            Tc.error('unknown price type ' + type)
        }
    }

}

export enum SnbcapitalOrderExecutionType{
    Limit = 2,
    Market = 3
}
