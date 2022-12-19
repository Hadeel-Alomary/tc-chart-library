var TradestationAccount = (function () {
    function TradestationAccount() {
    }
    TradestationAccount.mapResponseToTradestationAccount = function (response) {
        return {
            name: response.Name,
            key: response.Key,
        };
    };
    return TradestationAccount;
}());
export { TradestationAccount };
//# sourceMappingURL=tradestation-account.js.map