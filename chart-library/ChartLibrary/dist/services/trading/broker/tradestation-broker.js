import { BrokerType } from './broker';
import { BehaviorSubject, Subject } from 'rxjs';
import { TradingOrder, TradingPosition } from './models';
import { ChannelRequestType } from '../../shared-channel';
import { TradestationOrder, TradestationOrderType } from '../tradestation';
import { TradestationUtils } from '../../../utils/tradestation.utils';
import { TradestationOrderSideType } from '../../trading/tradestation/tradestation-order/tradestation-order-side-type';
var TradestationBroker = (function () {
    function TradestationBroker(tradestationService, sharedChannel, tradestationAccountsService, tradestationLogoutService, tradestationOrdersService, tradestationPositionsService) {
        var _this = this;
        this.tradestationService = tradestationService;
        this.sharedChannel = sharedChannel;
        this.tradestationAccountsService = tradestationAccountsService;
        this.tradestationLogoutService = tradestationLogoutService;
        this.tradestationOrdersService = tradestationOrdersService;
        this.tradestationPositionsService = tradestationPositionsService;
        this.tradingOrders = [];
        this.sessionStream = new BehaviorSubject(false);
        this.positionsLoadedStream = new Subject();
        this.refreshStream = new Subject();
        this.cancelStream = new Subject();
        this.tradestationAccountsService.getSessionStream().subscribe(function (isActive) {
            _this.sessionStream.next(isActive);
        });
        this.tradestationLogoutService.getCancelBrokerSelectionStream()
            .subscribe(function () {
            _this.cancelStream.next();
        });
        this.tradestationOrdersService.getOrdersStream()
            .subscribe(function (orders) {
            _this.tradingOrders = [];
            if (orders) {
                var defaultAccountOrders = orders.filter(function (order) { return order.accountId == _this.tradestationAccountsService.getDefaultAccount().name; });
                _this.tradingOrders = TradingOrder.fromTradestationOrders(defaultAccountOrders);
            }
            _this.refreshStream.next();
        });
        this.tradestationPositionsService.getPositionsStream()
            .subscribe(function (positions) {
            _this.tradingPositions = [];
            if (positions) {
                var defaultAccountPositions = positions.filter(function (position) { return position.accountId == _this.tradestationAccountsService.getDefaultAccount().name; });
                _this.tradingPositions = TradingPosition.fromTradestationPositions(defaultAccountPositions);
            }
            _this.refreshStream.next();
        });
    }
    TradestationBroker.prototype.activate = function (isReconnectMode) {
        this.tradestationService.activate();
    };
    TradestationBroker.prototype.cancelOrder = function (orderId) {
        var orders = this.tradestationOrdersService.getGroupedOrders();
        var order = orders.find(function (order) { return order.id == orderId; });
        this.tradestationOrdersService.deleteOrderFromChart(order);
    };
    TradestationBroker.prototype.cancelStopLoss = function (orderId) {
    };
    TradestationBroker.prototype.cancelTakeProfit = function (orderId) {
    };
    TradestationBroker.prototype.hasCancelOrderOption = function (orderId) {
        return true;
    };
    TradestationBroker.prototype.canMoveOrder = function (orderId) {
        return true;
    };
    TradestationBroker.prototype.deactivate = function () {
        this.tradestationService.deactiveTradestation();
    };
    TradestationBroker.prototype.displaysAccount = function () {
        return false;
    };
    TradestationBroker.prototype.displayAccountBalances = function () {
        return true;
    };
    TradestationBroker.prototype.displaysSettings = function () {
        return true;
    };
    TradestationBroker.prototype.displayAccountTransactions = function () {
        return false;
    };
    TradestationBroker.prototype.getAccounts = function () {
        return [];
    };
    TradestationBroker.prototype.getBrokerType = function () {
        return BrokerType.Tradestation;
    };
    TradestationBroker.prototype.getPositionSymbols = function (account) {
        return [];
    };
    TradestationBroker.prototype.getPositionsLoadedStream = function () {
        return this.positionsLoadedStream;
    };
    TradestationBroker.prototype.getRefreshStream = function () {
        return this.refreshStream;
    };
    TradestationBroker.prototype.getSessionStream = function () {
        return this.sessionStream;
    };
    TradestationBroker.prototype.getCancelStream = function () {
        return this.cancelStream;
    };
    TradestationBroker.prototype.getTradingOrders = function () {
        return this.tradingOrders;
    };
    TradestationBroker.prototype.getTradingPositions = function () {
        return this.tradingPositions;
    };
    TradestationBroker.prototype.isStopOrderSupported = function () {
        return true;
    };
    TradestationBroker.prototype.isSupportedMarket = function (market) {
        return TradestationUtils.getAllowedMarketsAbbreviations().includes(market.abbreviation);
    };
    TradestationBroker.prototype.onLogout = function () {
    };
    TradestationBroker.prototype.hasReversePositionOption = function () {
        return true;
    };
    TradestationBroker.prototype.hasClosePositionOption = function () {
        return true;
    };
    TradestationBroker.prototype.needToConcatSideTextWithTypeText = function () {
        return true;
    };
    TradestationBroker.prototype.useDarkLightTextColor = function () {
        return true;
    };
    TradestationBroker.prototype.openEditOrderScreen = function (orderId, price, requester) {
        var orders = this.tradestationOrdersService.getGroupedOrders();
        var order = orders.find(function (order) { return order.id == orderId; });
        var openRequest = {
            type: ChannelRequestType.TradestationBuySell,
            order: order,
            price: this.isStopOrderType(order) ? 0 : price,
            stopPrice: this.isStopOrderType(order) ? price : 0,
            requester: requester
        };
        this.sharedChannel.request(openRequest);
    };
    TradestationBroker.prototype.openEditStopLossScreen = function (orderId, stopLoss, requester) {
        var orders = this.tradestationOrdersService.getGroupedOrders();
        var order = orders.find(function (order) { return order.id == orderId; });
        order.stopLossPrice = stopLoss;
        var openRequest = {
            type: ChannelRequestType.TradestationBuySell,
            order: order,
            requester: requester
        };
        this.sharedChannel.request(openRequest);
    };
    TradestationBroker.prototype.openEditTakeProfitScreen = function (orderId, takeProfit, requester) {
        var orders = this.tradestationOrdersService.getGroupedOrders();
        var order = orders.find(function (order) { return order.id == orderId; });
        order.takeProfitPrice = takeProfit;
        var openRequest = {
            type: ChannelRequestType.TradestationBuySell,
            order: order,
            requester: requester
        };
        this.sharedChannel.request(openRequest);
    };
    TradestationBroker.prototype.openSellAllSharesScreen = function (market, company) { };
    TradestationBroker.prototype.onBoundPositionClicked = function (position) {
        var positions = this.tradestationPositionsService.getPositionsStream().getValue();
        var filteredPosition = positions.find(function (order) { return order.id == position.id; });
        var openRequest = {
            type: ChannelRequestType.TradestationBuySell,
            order: TradestationOrder.fromPosition(filteredPosition, TradestationOrderSideType.Sell, TradestationOrderType.Limit),
            closeQuantity: true
        };
        this.sharedChannel.request(openRequest);
    };
    ;
    TradestationBroker.prototype.onClosePosition = function (position) {
        var positions = this.tradestationPositionsService.getPositionsStream().getValue();
        var filteredPosition = positions.find(function (order) { return order.id == position.id; });
        this.tradestationPositionsService.onClosePosition([filteredPosition]);
    };
    ;
    TradestationBroker.prototype.onReversePosition = function (position) {
        var positions = this.tradestationPositionsService.getPositionsStream().getValue();
        var filteredPosition = positions.find(function (order) { return order.id == position.id; });
        this.tradestationPositionsService.onReversePosition(filteredPosition);
    };
    ;
    TradestationBroker.prototype.openBuyScreen = function (market, company, price) {
        this.openTradestationBuyAndSale('Buy', company, price, null, TradestationOrderType.Limit);
    };
    TradestationBroker.prototype.openSellScreen = function (market, company, price) {
        this.openTradestationBuyAndSale('Sell', company, price, null, TradestationOrderType.Limit);
    };
    TradestationBroker.prototype.openStopScreen = function (market, company, price) {
        this.openTradestationBuyAndSale('Sell', company, price, null, TradestationOrderType.StopMarket);
    };
    TradestationBroker.prototype.openTradestationBuyAndSale = function (side, company, price, quantity, orderType) {
        var order = TradestationOrder.newOrder(side, company.symbol, company.name);
        if (quantity) {
            order.quantity = quantity;
        }
        if (orderType) {
            order.type = orderType;
        }
        var openRequest = {
            type: ChannelRequestType.TradestationBuySell,
            order: order,
            price: this.isStopOrderType(order) ? 0 : price,
            stopPrice: this.isStopOrderType(order) ? price : 0
        };
        this.sharedChannel.request(openRequest);
    };
    TradestationBroker.prototype.isStopOrderType = function (order) {
        return TradestationOrder.isStopOrder(order);
    };
    return TradestationBroker;
}());
export { TradestationBroker };
//# sourceMappingURL=tradestation-broker.js.map