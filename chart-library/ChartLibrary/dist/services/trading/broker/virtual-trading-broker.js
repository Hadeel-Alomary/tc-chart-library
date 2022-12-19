import { BrokerType } from './broker';
import { BehaviorSubject, Subject } from 'rxjs/index';
import { ChannelRequestType } from '../../shared-channel';
import { VirtualTradingOrder, VirtualTradingOrderType } from '../virtual-trading';
import { TradingOrder, TradingPosition } from './models';
var VirtualTradingBroker = (function () {
    function VirtualTradingBroker(vtService, virtualTradingPositionsService, virtualTradingOrdersService, sharedChannel) {
        var _this = this;
        this.vtService = vtService;
        this.virtualTradingPositionsService = virtualTradingPositionsService;
        this.virtualTradingOrdersService = virtualTradingOrdersService;
        this.sharedChannel = sharedChannel;
        this.sessionStream = new BehaviorSubject(false);
        this.positionsLoadedStream = new Subject();
        this.refreshStream = new Subject();
        this.cancelStream = new Subject();
        this.vtService.getAccountStream()
            .subscribe(function (account) {
            _this.sessionStream.next(account != null);
        });
        this.virtualTradingPositionsService.getPositionsLoadedStream()
            .subscribe(function () {
            _this.positionsLoadedStream.next();
        });
        this.virtualTradingPositionsService.getPositionsStream()
            .subscribe(function (positions) {
            _this.tradingPositions = [];
            if (positions) {
                _this.tradingPositions = TradingPosition.fromVirtualTradingPositions(positions);
            }
            _this.refreshStream.next();
        });
        this.virtualTradingOrdersService.getOrdersStream()
            .subscribe(function (orders) {
            _this.tradingOrders = [];
            if (orders) {
                _this.tradingOrders = TradingOrder.fromVirtualTradingOrders(orders);
            }
            _this.refreshStream.next();
        });
    }
    VirtualTradingBroker.prototype.deactivate = function () {
        this.vtService.disconnectFromVirtualTrading();
    };
    VirtualTradingBroker.prototype.getBrokerType = function () {
        return BrokerType.VirtualTrading;
    };
    VirtualTradingBroker.prototype.isStopOrderSupported = function () {
        return true;
    };
    VirtualTradingBroker.prototype.isSupportedMarket = function (market) {
        return this.vtService.isSupportedMarket(market);
    };
    VirtualTradingBroker.prototype.onBoundPositionClicked = function (position) {
        return;
    };
    ;
    VirtualTradingBroker.prototype.onClosePosition = function (position) {
        return;
    };
    ;
    VirtualTradingBroker.prototype.onReversePosition = function (position) {
        return;
    };
    ;
    VirtualTradingBroker.prototype.hasReversePositionOption = function () {
        return false;
    };
    VirtualTradingBroker.prototype.hasClosePositionOption = function () {
        return false;
    };
    VirtualTradingBroker.prototype.needToConcatSideTextWithTypeText = function () {
        return false;
    };
    VirtualTradingBroker.prototype.useDarkLightTextColor = function () {
        return false;
    };
    VirtualTradingBroker.prototype.openBuyScreen = function (market, company, price) {
        this.openVTBuyAndSale('BUY', market, company, price, null, VirtualTradingOrderType.fromValue('LIMIT'));
    };
    VirtualTradingBroker.prototype.openSellScreen = function (market, company, price) {
        this.openVTBuyAndSale('SELL', market, company, price, null, VirtualTradingOrderType.fromValue('LIMIT'));
    };
    VirtualTradingBroker.prototype.openStopScreen = function (market, company, price) {
        this.openVTBuyAndSale('SELL', market, company, price, null, VirtualTradingOrderType.fromValue('STOP'));
    };
    VirtualTradingBroker.prototype.openSellAllSharesScreen = function (market, company) {
        var positions = this.virtualTradingPositionsService.getPositionsStream().getValue();
        var position = positions.find(function (position) { return position.symbol == company.symbol; });
        if (position) {
            this.openVTBuyAndSale('SELL', market, company, null, position.quantity, VirtualTradingOrderType.fromValue('LIMIT'));
        }
    };
    VirtualTradingBroker.prototype.openEditOrderScreen = function (orderId, price, requester) {
        var orders = this.virtualTradingOrdersService.getOrdersStream().getValue();
        var order = orders.find(function (order) { return order.id == orderId; });
        var openRequest = {
            type: ChannelRequestType.VirtualTradingBuySell,
            order: order,
            price: price,
            requester: requester
        };
        this.sharedChannel.request(openRequest);
    };
    VirtualTradingBroker.prototype.openEditTakeProfitScreen = function (orderId, takeProfit, requester) {
        var orders = this.virtualTradingOrdersService.getOrdersStream().getValue();
        var order = orders.find(function (order) { return order.id == orderId; });
        order.takeProfit = takeProfit;
        var openRequest = {
            type: ChannelRequestType.VirtualTradingBuySell,
            order: order,
            requester: requester
        };
        this.sharedChannel.request(openRequest);
    };
    VirtualTradingBroker.prototype.openEditStopLossScreen = function (orderId, stopLoss, requester) {
        var orders = this.virtualTradingOrdersService.getOrdersStream().getValue();
        var order = orders.find(function (order) { return order.id == orderId; });
        order.stopPrice = stopLoss;
        var openRequest = {
            type: ChannelRequestType.VirtualTradingBuySell,
            order: order,
            requester: requester
        };
        this.sharedChannel.request(openRequest);
    };
    VirtualTradingBroker.prototype.cancelOrder = function (orderId) {
        var orders = this.virtualTradingOrdersService.getOrdersStream().getValue();
        var order = orders.find(function (order) { return order.id == orderId; });
        this.virtualTradingOrdersService.deleteOrder(order);
    };
    VirtualTradingBroker.prototype.cancelTakeProfit = function (orderId) {
        var orders = this.virtualTradingOrdersService.getOrdersStream().getValue();
        var order = orders.find(function (order) { return order.id == orderId; });
        order.takeProfit = null;
        this.virtualTradingOrdersService.updateOrder(order).subscribe();
    };
    VirtualTradingBroker.prototype.cancelStopLoss = function (orderId) {
        var orders = this.virtualTradingOrdersService.getOrdersStream().getValue();
        var order = orders.find(function (order) { return order.id == orderId; });
        order.stopPrice = null;
        this.virtualTradingOrdersService.updateOrder(order).subscribe();
    };
    VirtualTradingBroker.prototype.hasCancelOrderOption = function () {
        return true;
    };
    VirtualTradingBroker.prototype.canMoveOrder = function (orderId) {
        return true;
    };
    VirtualTradingBroker.prototype.getSessionStream = function () {
        return this.sessionStream;
    };
    VirtualTradingBroker.prototype.openVTBuyAndSale = function (side, market, company, price, quantity, orderType) {
        var accountId = this.vtService.getAccountStream().getValue().id;
        var commission = this.vtService.getAccountStream().getValue().commission;
        var order = VirtualTradingOrder.newOrder(side, company.symbol, company.name, accountId, commission, market);
        if (quantity) {
            order.quantity = quantity;
        }
        if (orderType) {
            order.orderType = orderType;
        }
        var openRequest = {
            type: ChannelRequestType.VirtualTradingBuySell,
            order: order,
            price: price
        };
        this.sharedChannel.request(openRequest);
    };
    VirtualTradingBroker.prototype.activate = function (isReconnectMode) {
        this.vtService.activateSettings();
    };
    VirtualTradingBroker.prototype.displaysSettings = function () {
        return true;
    };
    VirtualTradingBroker.prototype.displayAccountTransactions = function () {
        return true;
    };
    VirtualTradingBroker.prototype.displayAccountBalances = function () {
        return false;
    };
    VirtualTradingBroker.prototype.displaysAccount = function () {
        return true;
    };
    VirtualTradingBroker.prototype.onLogout = function () {
    };
    VirtualTradingBroker.prototype.getPositionsLoadedStream = function () {
        return this.positionsLoadedStream;
    };
    VirtualTradingBroker.prototype.getRefreshStream = function () {
        return this.refreshStream;
    };
    VirtualTradingBroker.prototype.getCancelStream = function () {
        return this.cancelStream;
    };
    VirtualTradingBroker.prototype.getTradingOrders = function () {
        return this.tradingOrders;
    };
    VirtualTradingBroker.prototype.getTradingPositions = function () {
        return this.tradingPositions;
    };
    VirtualTradingBroker.prototype.getAccounts = function () {
        var accounts = [];
        if (this.vtService.getAccount()) {
            accounts.push({ id: this.vtService.getAccount().id.toString(), name: this.vtService.getAccount().name });
        }
        return accounts;
    };
    VirtualTradingBroker.prototype.getPositionSymbols = function (account) {
        var symbols = [];
        this.virtualTradingPositionsService.getPositionsStream().getValue().forEach(function (position) {
            symbols.push(position.symbol);
        });
        return symbols;
    };
    return VirtualTradingBroker;
}());
export { VirtualTradingBroker };
//# sourceMappingURL=virtual-trading-broker.js.map