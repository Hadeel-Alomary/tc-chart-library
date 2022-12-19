import { BrokerType } from './broker';
import { Tc } from '../../../utils/index';
import { BehaviorSubject, Subject } from 'rxjs/index';
var NoBroker = (function () {
    function NoBroker() {
        this.sessionStream = new BehaviorSubject(false);
        this.positionsLoadedStream = new Subject();
        this.refreshStream = new Subject();
        this.cancelStream = new Subject();
    }
    NoBroker.prototype.isToolbarVisible = function () {
        return false;
    };
    NoBroker.prototype.setToolbarVisible = function (value) { };
    NoBroker.prototype.getToolbarPosition = function () {
        return { top: 0, left: 0 };
    };
    NoBroker.prototype.setToolbarPosition = function (value) { };
    NoBroker.prototype.openBuyScreen = function (market, company, price) {
        Tc.error("should not be here");
    };
    NoBroker.prototype.openSellScreen = function (market, company, price) {
        Tc.error("should not be here");
    };
    NoBroker.prototype.openStopScreen = function (market, company, price) {
        Tc.error("should not be here");
    };
    NoBroker.prototype.openSellAllSharesScreen = function (market, company) {
        Tc.error("should not be here");
    };
    NoBroker.prototype.openEditOrderScreen = function (orderId, price, requester) {
        Tc.error("should not be here");
    };
    NoBroker.prototype.openEditTakeProfitScreen = function (orderId, takeProfit, requester) {
        Tc.error("should not be here");
    };
    NoBroker.prototype.openEditStopLossScreen = function (orderId, stopLoss, requester) {
        Tc.error("should not be here");
    };
    NoBroker.prototype.onBoundPositionClicked = function (position) {
        Tc.error("should not be here");
    };
    ;
    NoBroker.prototype.onClosePosition = function (position) {
        Tc.error("should not be here");
    };
    ;
    NoBroker.prototype.onReversePosition = function (position) {
        Tc.error("should not be here");
    };
    ;
    NoBroker.prototype.cancelOrder = function (orderId) {
        Tc.error("should not be here");
    };
    NoBroker.prototype.cancelTakeProfit = function (orderId) {
        Tc.error("should not be here");
    };
    NoBroker.prototype.cancelStopLoss = function (orderId) {
        Tc.error("should not be here");
    };
    NoBroker.prototype.hasReversePositionOption = function () {
        return false;
    };
    NoBroker.prototype.hasClosePositionOption = function () {
        return false;
    };
    NoBroker.prototype.hasCancelOrderOption = function (orderId) {
        return false;
    };
    NoBroker.prototype.canMoveOrder = function (orderId) {
        return false;
    };
    NoBroker.prototype.needToConcatSideTextWithTypeText = function () {
        return false;
    };
    NoBroker.prototype.useDarkLightTextColor = function () {
        return false;
    };
    NoBroker.prototype.isStopOrderSupported = function () {
        return false;
    };
    NoBroker.prototype.isSupportedMarket = function (market) {
        return false;
    };
    NoBroker.prototype.deactivate = function () { };
    NoBroker.prototype.getBrokerType = function () {
        return BrokerType.None;
    };
    NoBroker.prototype.getSessionStream = function () {
        return this.sessionStream;
    };
    NoBroker.prototype.activate = function (isReconnectMode) { };
    NoBroker.prototype.displaysSettings = function () {
        return false;
    };
    NoBroker.prototype.displayAccountTransactions = function () {
        return false;
    };
    NoBroker.prototype.displayAccountBalances = function () {
        return false;
    };
    NoBroker.prototype.displaysAccount = function () {
        return false;
    };
    NoBroker.prototype.onLogout = function () {
    };
    NoBroker.prototype.getPositionsLoadedStream = function () {
        return this.positionsLoadedStream;
    };
    NoBroker.prototype.getRefreshStream = function () {
        return this.refreshStream;
    };
    NoBroker.prototype.getCancelStream = function () {
        return this.cancelStream;
    };
    NoBroker.prototype.getTradingOrders = function () {
        return [];
    };
    NoBroker.prototype.getTradingPositions = function () {
        return [];
    };
    NoBroker.prototype.getAccounts = function () {
        return [];
    };
    NoBroker.prototype.getPositionSymbols = function (account) {
        return [];
    };
    return NoBroker;
}());
export { NoBroker };
//# sourceMappingURL=no-broker.js.map