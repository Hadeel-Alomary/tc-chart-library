import { BrokerType } from './broker';
import { SnbcapitalOrder, SnbcapitalOrderExecution, SnbcapitalOrderStatus, SnbcapitalOrderStatusGroupType, SnbcapitalOrderType } from '../snbcapital/index';
import { ChannelRequestType } from '../../shared-channel/index';
import { BehaviorSubject, Subject } from 'rxjs/index';
import { TradingOrderSide, TradingOrderStatus, TradingOrderTypeWrapper } from './models';
import { TradingOrderSideType } from './models/trading-order-side';
import { TradingOrderType } from './models/trading-order-type';
import { TradingOrderStatusType } from './models/trading-order-status';
var SnbcapitalBroker = (function () {
    function SnbcapitalBroker(snbcapitalService, snbcapitalPositionService, snbcapitalOrdersService, sharedChannel) {
        var _this = this;
        this.snbcapitalService = snbcapitalService;
        this.snbcapitalPositionService = snbcapitalPositionService;
        this.snbcapitalOrdersService = snbcapitalOrdersService;
        this.sharedChannel = sharedChannel;
        this.sessionStream = new BehaviorSubject(false);
        this.positionsLoadedStream = new Subject();
        this.refreshStream = new Subject();
        this.cancelStream = new Subject();
        this.snbcapitalService.getPortfoliosStream()
            .subscribe(function (portfolios) {
            _this.sessionStream.next(portfolios != null && 0 < Object.keys(portfolios).length);
        });
        this.snbcapitalService.getCancelBrokerSelectionStream()
            .subscribe(function () {
            _this.cancelStream.next();
        });
        this.snbcapitalPositionService.getPositionsLoadedStream()
            .subscribe(function (portfolio) {
            _this.positionsLoadedStream.next();
        });
        this.snbcapitalPositionService.getPositionsStream().subscribe(function () {
            _this.refreshStream.next();
        });
        this.snbcapitalOrdersService.getOrdersStream().subscribe(function () {
            _this.refreshStream.next();
        });
    }
    SnbcapitalBroker.prototype.deactivate = function () {
        this.snbcapitalService.disconnectFromSnbcapital();
    };
    SnbcapitalBroker.prototype.getBrokerType = function () {
        return BrokerType.Snbcapital;
    };
    SnbcapitalBroker.prototype.isStopOrderSupported = function () {
        return false;
    };
    SnbcapitalBroker.prototype.isSupportedMarket = function (market) {
        return market.abbreviation == 'TAD';
    };
    SnbcapitalBroker.prototype.openBuyScreen = function (market, company, price) {
        this.openSnbcapitalBuyAndSale(SnbcapitalOrderType.Buy, company, price);
    };
    SnbcapitalBroker.prototype.openSellScreen = function (market, company, price) {
        this.openSnbcapitalBuyAndSale(SnbcapitalOrderType.Sell, company, price);
    };
    SnbcapitalBroker.prototype.openStopScreen = function (market, company, price) {
    };
    SnbcapitalBroker.prototype.openSellAllSharesScreen = function (market, company) {
        var filteredPosition = this.snbcapitalPositionService.getPositions().find(function (position) { return position.symbol == company.symbol; });
        ;
        var openRequest = { type: ChannelRequestType.SnbcapitalBuySell, order: SnbcapitalOrder.fromPosition(filteredPosition, company.name) };
        this.sharedChannel.request(openRequest);
    };
    SnbcapitalBroker.prototype.openEditOrderScreen = function (orderId, price, requester) {
        var _this = this;
        var order = this.snbcapitalOrdersService.getOrders().find(function (order) { return order.id == orderId; });
        if (order) {
            var portfolio = this.snbcapitalService.getPortfolio(order.portfolioId);
            this.snbcapitalOrdersService.getOrderDetails(order, portfolio)
                .subscribe(function (response) {
                SnbcapitalOrder.updateOrderWithOrderDetails(order, response);
                if (SnbcapitalOrder.canEditOrder(order)) {
                    var openRequest = {
                        type: ChannelRequestType.SnbcapitalBuySell,
                        order: order,
                        price: price,
                        requester: requester
                    };
                    _this.sharedChannel.request(openRequest);
                }
                else {
                    _this.showMessageBox('لا يمكنك تعديل هذا الامر');
                }
            }, function (error) {
            });
        }
    };
    SnbcapitalBroker.prototype.openEditTakeProfitScreen = function (orderId, takeProfit, requester) {
        return;
    };
    SnbcapitalBroker.prototype.openEditStopLossScreen = function (orderId, stopLoss, requester) {
        return;
    };
    SnbcapitalBroker.prototype.onBoundPositionClicked = function (position) {
        return;
    };
    ;
    SnbcapitalBroker.prototype.onClosePosition = function (position) {
        return;
    };
    ;
    SnbcapitalBroker.prototype.onReversePosition = function (position) {
        return;
    };
    ;
    SnbcapitalBroker.prototype.hasReversePositionOption = function () {
        return false;
    };
    SnbcapitalBroker.prototype.hasClosePositionOption = function () {
        return false;
    };
    SnbcapitalBroker.prototype.needToConcatSideTextWithTypeText = function () {
        return true;
    };
    SnbcapitalBroker.prototype.useDarkLightTextColor = function () {
        return false;
    };
    SnbcapitalBroker.prototype.cancelOrder = function (orderId) {
        var _this = this;
        var snbcapitalOrder = this.snbcapitalOrdersService.getOrders().find(function (order) { return order.id == orderId; });
        if (snbcapitalOrder) {
            var portfolio_1 = this.snbcapitalService.getPortfolio(snbcapitalOrder.portfolioId);
            this.snbcapitalOrdersService.deleteOrder(snbcapitalOrder, portfolio_1)
                .subscribe(function (response) {
                _this.showMessageBox('تم إرسال طلب الإلغاء بنجاح');
                _this.snbcapitalService.refreshPortfolioAfterSecond(portfolio_1);
            }, function (error) { });
        }
    };
    SnbcapitalBroker.prototype.showMessageBox = function (message) {
        var request = { type: ChannelRequestType.MessageBox, messageLine: message };
        this.sharedChannel.request(request);
    };
    SnbcapitalBroker.prototype.cancelTakeProfit = function (orderId) {
        return;
    };
    SnbcapitalBroker.prototype.cancelStopLoss = function (orderId) {
        return;
    };
    SnbcapitalBroker.prototype.hasCancelOrderOption = function (orderId) {
        var order = this.snbcapitalOrdersService.getOrders().find(function (order) { return order.id == orderId; });
        if (order) {
            return order.isOpen;
        }
        return false;
    };
    SnbcapitalBroker.prototype.canMoveOrder = function (orderId) {
        var order = this.snbcapitalOrdersService.getOrders().find(function (order) { return order.id == orderId; });
        if (order) {
            return order.priceCanBeModified;
        }
        return false;
    };
    SnbcapitalBroker.prototype.getSessionStream = function () {
        return this.sessionStream;
    };
    SnbcapitalBroker.prototype.getCancelStream = function () {
        return this.cancelStream;
    };
    SnbcapitalBroker.prototype.openSnbcapitalBuyAndSale = function (type, company, price) {
        var _this = this;
        var portfolios = this.snbcapitalService.getPortfoliosStream().getValue();
        var defaultPortfolio = this.snbcapitalService.getDefaultPortfolioId() ?
            portfolios.find(function (portfolio) { return portfolio.portfolioId == _this.snbcapitalService.getDefaultPortfolioId(); }) : portfolios[0];
        var openRequest = {
            type: ChannelRequestType.SnbcapitalBuySell,
            order: SnbcapitalOrder.newOrder(type, company.symbol, defaultPortfolio, company.name),
            price: price
        };
        this.sharedChannel.request(openRequest);
    };
    SnbcapitalBroker.prototype.activate = function () {
        this.snbcapitalService.activate();
    };
    SnbcapitalBroker.prototype.displaysSettings = function () {
        return true;
    };
    SnbcapitalBroker.prototype.displayAccountTransactions = function () {
        return false;
    };
    SnbcapitalBroker.prototype.displayAccountBalances = function () {
        return true;
    };
    SnbcapitalBroker.prototype.displaysAccount = function () {
        return false;
    };
    SnbcapitalBroker.prototype.onLogout = function () {
        this.snbcapitalService.disconnectFromSnbcapital();
    };
    SnbcapitalBroker.prototype.getPositionsLoadedStream = function () {
        return this.positionsLoadedStream;
    };
    SnbcapitalBroker.prototype.getRefreshStream = function () {
        return this.refreshStream;
    };
    SnbcapitalBroker.prototype.getTradingOrders = function () {
        var tradingOrders = [];
        this.snbcapitalOrdersService.getOrders().filter(function (order) { return order.isOpen && SnbcapitalOrderExecution.isLimitOrder(order); }).forEach(function (snbcapitalOrder) {
            tradingOrders.push({
                id: snbcapitalOrder.id,
                symbol: snbcapitalOrder.symbol,
                price: snbcapitalOrder.price,
                quantity: snbcapitalOrder.quantity,
                side: TradingOrderSide.fromType(snbcapitalOrder.type.type == SnbcapitalOrderType.Buy ? TradingOrderSideType.BUY : TradingOrderSideType.SELL),
                type: TradingOrderTypeWrapper.fromType(TradingOrderType.LIMIT),
                status: TradingOrderStatus.fromType(SnbcapitalOrderStatus.filterStatusType(snbcapitalOrder, SnbcapitalOrderStatusGroupType.Active) ? TradingOrderStatusType.ACTIVE : TradingOrderStatusType.EXECUTED),
                takeProfit: 0,
                stopLoss: 0,
                executionPrice: 0,
                executionTime: null
            });
        });
        return tradingOrders;
    };
    SnbcapitalBroker.prototype.getTradingPositions = function () {
        var tradingPositions = [];
        this.snbcapitalPositionService.getPositions().forEach(function (position) {
            tradingPositions.push({
                id: position.id,
                brokerType: BrokerType.Snbcapital,
                symbol: position.symbol,
                averagePrice: position.cost,
                quantity: position.quantity,
                totalCost: position.totalCost,
                currentTotalCost: position.currentTotalCost
            });
        });
        return tradingPositions;
    };
    SnbcapitalBroker.prototype.getAccounts = function () {
        var accounts = [];
        this.snbcapitalService.getPortfoliosStream().getValue().forEach(function (portfolio) {
            accounts.push({ id: portfolio.portfolioId, name: portfolio.portfolioName });
        });
        return accounts;
    };
    SnbcapitalBroker.prototype.getPositionSymbols = function (account) {
        var symbols = [];
        var snbcapitalPositions = this.snbcapitalPositionService.getPositionsStream().getValue();
        if (account.id in snbcapitalPositions) {
            snbcapitalPositions[account.id].forEach(function (position) {
                symbols.push(position.symbol);
            });
        }
        return symbols;
    };
    return SnbcapitalBroker;
}());
export { SnbcapitalBroker };
//# sourceMappingURL=snbcapital-broker.js.map