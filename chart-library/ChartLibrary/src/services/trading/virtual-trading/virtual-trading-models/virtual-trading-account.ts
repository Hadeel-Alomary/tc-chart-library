import {NotificationMethods, VirtualTradingNotificationMethods} from '../../../data/notification';
import {VirtualTradingAccountResponse} from '../../../loader/trading/virtual-trading';

export class VirtualTradingAccount {
    constructor(
        public id: number,
        public capital: number,
        public commission: number,
        public currency: string,
        public name: string,
        public language: string,
        public purchasePower: number,
        public notificationMethods: VirtualTradingNotificationMethods
    ){}

    public static mapResponseToVirtualTradingAccount(response: VirtualTradingAccountResponse): VirtualTradingAccount {
        return new VirtualTradingAccount(
            response.id,
            response.capital,
            response.commission,
            response.currency,
            response.name,
            response.language,
            response.purchase_power,
            NotificationMethods.fromResponseData(response.notifications)
        );
    }
}
