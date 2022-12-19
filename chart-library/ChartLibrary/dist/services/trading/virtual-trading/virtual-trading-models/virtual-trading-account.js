import { NotificationMethods } from '../../../notification';
var VirtualTradingAccount = (function () {
    function VirtualTradingAccount(id, capital, commission, currency, name, language, purchasePower, notificationMethods) {
        this.id = id;
        this.capital = capital;
        this.commission = commission;
        this.currency = currency;
        this.name = name;
        this.language = language;
        this.purchasePower = purchasePower;
        this.notificationMethods = notificationMethods;
    }
    VirtualTradingAccount.mapResponseToVirtualTradingAccount = function (response) {
        return new VirtualTradingAccount(response.id, response.capital, response.commission, response.currency, response.name, response.language, response.purchase_power, NotificationMethods.fromResponseData(response.notifications));
    };
    return VirtualTradingAccount;
}());
export { VirtualTradingAccount };
//# sourceMappingURL=virtual-trading-account.js.map