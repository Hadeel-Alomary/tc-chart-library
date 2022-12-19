import { BrokerType } from './broker';
import { DerayahOrder, DerayahOrderExecutionType, DerayahOrderStatus, DerayahOrderStatusGroupType, DerayahOrderType } from '../derayah/index';
import { ChannelRequestType } from '../../shared-channel/index';
import { DerayahUtils } from '../../../utils/index';
import { BehaviorSubject, Subject } from 'rxjs/index';
import { TradingOrderSide, TradingOrderStatus, TradingOrderTypeWrapper } from './models';
import { TradingOrderSideType } from './models/trading-order-side';
import { TradingOrderType } from './models/trading-order-type';
import { TradingOrderStatusType } from './models/trading-order-status';
var DerayahBroker = (function () {
    function DerayahBroker(derayahService, derayahPositionService, derayahOrdersService, sharedChannel) {
        var _this = this;
        this.derayahService = derayahService;
        this.derayahPositionService = derayahPositionService;
        this.derayahOrdersService = derayahOrdersService;
        this.sharedChannel = sharedChannel;
        this.sessionStream = new BehaviorSubject(false);
        this.positionsLoadedStream = new Subject();
        this.refreshStream = new Subject();
        this.cancelStream = new Subject();
        this.derayahService.getPortfoliosStream()
            .subscribe(function (portfolios) {
            _this.sessionStream.next(portfolios != null && 0 < Object.keys(portfolios).length);
        });
        this.derayahService.getCancelBrokerSelectionStream()
            .subscribe(function () {
            _this.cancelStream.next();
        });
        this.derayahPositionService.getPositionsLoadedStream()
            .subscribe(function (portfolio) {
            _this.positionsLoadedStream.next();
        });
        this.derayahPositionService.getPositionsStream().subscribe(function () {
            _this.refreshStream.next();
        });
        this.derayahOrdersService.getOrdersStream().subscribe(function () {
            _this.refreshStream.next();
        });
    }
    DerayahBroker.prototype.deactivate = function () {
        this.derayahService.disconnectFromDerayah();
    };
    DerayahBroker.prototype.getBrokerType = function () {
        return BrokerType.Derayah;
    };
    DerayahBroker.prototype.isStopOrderSupported = function () {
        return false;
    };
    DerayahBroker.prototype.isSupportedMarket = function (market) {
        return DerayahUtils.getAllowedMarketsAbbreviations().includes(market.abbreviation);
    };
    DerayahBroker.prototype.openBuyScreen = function (market, company, price) {
        this.openDerayahBuyAndSale(DerayahOrderType.Buy, company, price);
    };
    DerayahBroker.prototype.openSellScreen = function (market, company, price) {
        this.openDerayahBuyAndSale(DerayahOrderType.Sell, company, price);
    };
    DerayahBroker.prototype.openStopScreen = function (market, company, price) {
    };
    DerayahBroker.prototype.openSellAllSharesScreen = function (market, company) {
        var derayahPosition = this.derayahPositionService.getPositions().find(function (position) { return position.symbol == company.symbol; });
        if (derayahPosition) {
            var isNomuMarket = company.categoryId == 303;
            var openRequest = { type: ChannelRequestType.DerayahSell, order: DerayahOrder.fromPosition(derayahPosition, company.name, isNomuMarket) };
            this.sharedChannel.request(openRequest);
        }
    };
    DerayahBroker.prototype.openEditOrderScreen = function (orderId, price, requester) {
        var _this = this;
        var order = this.derayahOrdersService.getOrders().find(function (order) { return order.id == orderId; });
        if (order) {
            this.derayahOrdersService.getOrderDetails(order)
                .subscribe(function (response) {
                DerayahOrder.updateOrderWithOrderDetails(order, response.result);
                if (DerayahOrder.canEditOrder(order)) {
                    var editRequest = {
                        type: order.type.type == DerayahOrderType.Buy ? ChannelRequestType.DerayahBuy : ChannelRequestType.DerayahSell,
                        order: order,
                        onDone: function () {
                            if (requester) {
                                requester.onRequestComplete();
                            }
                        }
                    };
                    if (price) {
                        editRequest.price = price;
                    }
                    _this.sharedChannel.request(editRequest);
                }
            });
        }
    };
    DerayahBroker.prototype.openEditTakeProfitScreen = function (orderId, takeProfit, requester) {
        return;
    };
    DerayahBroker.prototype.openEditStopLossScreen = function (orderId, stopLoss, requester) {
        return;
    };
    DerayahBroker.prototype.onBoundPositionClicked = function (position) {
        return;
    };
    ;
    DerayahBroker.prototype.onClosePosition = function (position) {
        return;
    };
    ;
    DerayahBroker.prototype.onReversePosition = function (position) {
        return;
    };
    ;
    DerayahBroker.prototype.hasReversePositionOption = function () {
        return false;
    };
    DerayahBroker.prototype.hasClosePositionOption = function () {
        return false;
    };
    DerayahBroker.prototype.needToConcatSideTextWithTypeText = function () {
        return false;
    };
    DerayahBroker.prototype.useDarkLightTextColor = function () {
        return false;
    };
    DerayahBroker.prototype.cancelOrder = function (orderId) {
        var derayahOrder = this.derayahOrdersService.getOrders().find(function (order) { return order.id == orderId; });
        if (derayahOrder) {
            this.derayahOrdersService.deleteOrder(derayahOrder).subscribe();
        }
    };
    DerayahBroker.prototype.cancelTakeProfit = function (orderId) {
        return;
    };
    DerayahBroker.prototype.cancelStopLoss = function (orderId) {
        return;
    };
    DerayahBroker.prototype.hasCancelOrderOption = function (orderId) {
        return true;
    };
    DerayahBroker.prototype.canMoveOrder = function (orderId) {
        return true;
    };
    DerayahBroker.prototype.getSessionStream = function () {
        return this.sessionStream;
    };
    DerayahBroker.prototype.getCancelStream = function () {
        return this.cancelStream;
    };
    DerayahBroker.prototype.openDerayahBuyAndSale = function (type, company, price) {
        var portfolioNumber = this.derayahService.getPortfoliosStream().getValue()[0].portfolioNumber;
        var openRequest = {
            type: type == DerayahOrderType.Buy ? ChannelRequestType.DerayahBuy : ChannelRequestType.DerayahSell,
            order: DerayahOrder.newOrder(type, company.symbol, portfolioNumber, company.name, company.categoryId == 303),
            price: price
        };
        this.sharedChannel.request(openRequest);
    };
    DerayahBroker.prototype.activate = function (isReconnectMode) {
        this.derayahService.activate(isReconnectMode);
    };
    DerayahBroker.prototype.displaysSettings = function () {
        return false;
    };
    DerayahBroker.prototype.displayAccountTransactions = function () {
        return false;
    };
    DerayahBroker.prototype.displayAccountBalances = function () {
        return false;
    };
    DerayahBroker.prototype.displaysAccount = function () {
        return false;
    };
    DerayahBroker.prototype.onLogout = function () {
        this.derayahService.disconnectFromDerayah();
    };
    DerayahBroker.prototype.getPositionsLoadedStream = function () {
        return this.positionsLoadedStream;
    };
    DerayahBroker.prototype.getRefreshStream = function () {
        return this.refreshStream;
    };
    DerayahBroker.prototype.getTradingOrders = function () {
        var tradingOrders = [];
        this.derayahOrdersService.getOrders().filter(function (order) {
            return DerayahOrderStatus.filterStatusType(order.status.type, DerayahOrderStatusGroupType.Executed) ||
                DerayahOrderStatus.filterStatusType(order.status.type, DerayahOrderStatusGroupType.OutStanding) ||
                order.execution.type != DerayahOrderExecutionType.Market;
        }).forEach(function (derayahOrder) {
            tradingOrders.push({
                id: derayahOrder.id,
                symbol: derayahOrder.symbol,
                price: derayahOrder.price,
                quantity: derayahOrder.quantity,
                side: TradingOrderSide.fromType(derayahOrder.type.type == DerayahOrderType.Buy ? TradingOrderSideType.BUY : TradingOrderSideType.SELL),
                type: TradingOrderTypeWrapper.fromType(derayahOrder.execution.type == DerayahOrderExecutionType.Limit ? TradingOrderType.LIMIT : TradingOrderType.MARKET),
                status: TradingOrderStatus.fromType(DerayahOrderStatus.filterStatusType(derayahOrder.status.type, DerayahOrderStatusGroupType.OutStanding) ? TradingOrderStatusType.ACTIVE : TradingOrderStatusType.EXECUTED),
                takeProfit: 0,
                stopLoss: 0,
                executionPrice: 0,
                executionTime: null
            });
        });
        return tradingOrders;
    };
    DerayahBroker.prototype.getTradingPositions = function () {
        var tradingPositions = [];
        var tradingOrders = [];
        this.derayahPositionService.getPositions().forEach(function (position) {
            tradingPositions.push({
                id: position.id,
                brokerType: BrokerType.Derayah,
                symbol: position.symbol,
                averagePrice: position.cost,
                quantity: position.quantity,
                totalCost: position.totalCost,
                currentTotalCost: position.currentTotalCost
            });
        });
        return tradingPositions;
    };
    DerayahBroker.prototype.getAccounts = function () {
        var accounts = [];
        this.derayahService.getPortfoliosStream().getValue().forEach(function (portfolio) {
            accounts.push({ id: portfolio.portfolioNumber, name: portfolio.portfolioName });
        });
        return accounts;
    };
    DerayahBroker.prototype.getPositionSymbols = function (account) {
        var symbols = [];
        var derayahPositions = this.derayahPositionService.getPositionsStream().getValue();
        if (account.id in derayahPositions) {
            derayahPositions[account.id].forEach(function (position) {
                symbols.push(position.symbol);
            });
        }
        return symbols;
    };
    return DerayahBroker;
}());
export { DerayahBroker };
//# sourceMappingURL=derayah-broker.js.map