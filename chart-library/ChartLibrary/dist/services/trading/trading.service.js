var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tc } from '../../utils/index';
import { DerayahOrdersService, DerayahPositionsService, DerayahService } from './derayah/index';
import { SnbcapitalOrdersService, SnbcapitalPositionsService, SnbcapitalService } from './snbcapital/index';
import { SharedChannel } from '../shared-channel/index';
import { BrokerType } from './broker/broker';
import { DerayahBroker } from './broker/derayah-broker';
import { SnbcapitalBroker } from './broker/snbcapital-broker';
import { NoBroker } from './broker/no-broker';
import { TradingStateService } from '../state/index';
import { VirtualTradingBroker } from './broker/virtual-trading-broker';
import { VirtualTradingOrdersService, VirtualTradingPositionsService, VirtualTradingService } from './virtual-trading';
import { EnumUtils } from '../../utils/enum.utils';
import { BrokerWatchlistManager } from './broker-watchlist-manager';
import { ChannelRequestType } from '../shared-channel';
import { Subject } from 'rxjs/internal/Subject';
import { TradestationBroker } from './broker/tradestation-broker';
import { TradestationAccountsService, TradestationLogoutService, TradestationOrdersService, TradestationPositionsService, TradestationService } from './tradestation';
import { WatchlistService } from "../../services";
var TradingService = (function () {
    function TradingService(derayahService, derayahOrdersService, derayahPositionService, snbcapitalService, snbcapitalOrdersService, snbcapitalPositionService, virtualTradingService, virtualTradingPositionsService, virtualTradingOrdersService, sharedChannel, tradingStateService, watchlistService, tradestationService, tradestationAccountsService, tradestationLogoutService, tradestationOrdersService, tradestationPositionsService) {
        this.derayahService = derayahService;
        this.derayahOrdersService = derayahOrdersService;
        this.derayahPositionService = derayahPositionService;
        this.snbcapitalService = snbcapitalService;
        this.snbcapitalOrdersService = snbcapitalOrdersService;
        this.snbcapitalPositionService = snbcapitalPositionService;
        this.virtualTradingService = virtualTradingService;
        this.virtualTradingPositionsService = virtualTradingPositionsService;
        this.virtualTradingOrdersService = virtualTradingOrdersService;
        this.sharedChannel = sharedChannel;
        this.tradingStateService = tradingStateService;
        this.watchlistService = watchlistService;
        this.tradestationService = tradestationService;
        this.tradestationAccountsService = tradestationAccountsService;
        this.tradestationLogoutService = tradestationLogoutService;
        this.tradestationOrdersService = tradestationOrdersService;
        this.tradestationPositionsService = tradestationPositionsService;
        this.sessionStream = new BehaviorSubject(false);
        this.brokerSelectionStream = new BehaviorSubject(BrokerType.None);
        this.broker = this.createBroker(BrokerType.None);
        this.brokerRefreshStream = new Subject();
        this.brokerWatchlistManager = new BrokerWatchlistManager(watchlistService, sharedChannel);
    }
    Object.defineProperty(TradingService.prototype, "toolbarVisible", {
        get: function () {
            return this.tradingStateService.getVirtualTradingFloatingToolbarVisibility();
        },
        set: function (visible) {
            this.tradingStateService.setVirtualTradingFloatingToolbarVisibility(visible);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TradingService.prototype, "toolbarPosition", {
        get: function () {
            return this.tradingStateService.getVirtualTradingFloatingToolbarPosition();
        },
        set: function (position) {
            this.tradingStateService.setVirtualTradingFloatingToolbarPosition(position);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TradingService.prototype, "useFastOrder", {
        get: function () {
            return this.tradingStateService.getUseFastOrder();
        },
        set: function (value) {
            this.tradingStateService.setUseFastOrder(value);
            this.brokerRefreshStream.next();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TradingService.prototype, "showPositionDrawings", {
        get: function () {
            return this.tradingStateService.getShowPositionDrawings();
        },
        set: function (value) {
            this.tradingStateService.setShowPositionDrawings(value);
            this.brokerRefreshStream.next();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TradingService.prototype, "showOrderDrawings", {
        get: function () {
            return this.tradingStateService.getShowOrderDrawings();
        },
        set: function (value) {
            this.tradingStateService.setShowOrderDrawings(value);
            this.brokerRefreshStream.next();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TradingService.prototype, "showExecutedOrders", {
        get: function () {
            return this.tradingStateService.getShowExecutedOrders();
        },
        set: function (value) {
            this.tradingStateService.setShowExecutedOrders(value);
            this.brokerRefreshStream.next();
        },
        enumerable: true,
        configurable: true
    });
    TradingService.prototype.openBuyScreen = function (market, symbol, price) {
    };
    TradingService.prototype.openSellScreen = function (market, symbol, price) {
    };
    TradingService.prototype.openStopScreen = function (symbol, price) {
    };
    TradingService.prototype.openSellAllSharesScreen = function (symbol) {
    };
    TradingService.prototype.onBoundPositionClicked = function (position) {
        this.broker.onBoundPositionClicked(position);
    };
    TradingService.prototype.onClosePosition = function (position) {
        this.broker.onClosePosition(position);
    };
    TradingService.prototype.onReversePosition = function (position) {
        this.broker.onReversePosition(position);
    };
    TradingService.prototype.openEditOrderScreen = function (orderId, newPrice, requester) {
        this.broker.openEditOrderScreen(orderId, newPrice, requester);
    };
    TradingService.prototype.openEditTakeProfitScreen = function (orderId, takeProfit, requester) {
        this.broker.openEditTakeProfitScreen(orderId, takeProfit, requester);
    };
    TradingService.prototype.openEditStopLossScreen = function (orderId, stopLoss, requester) {
        this.broker.openEditStopLossScreen(orderId, stopLoss, requester);
    };
    TradingService.prototype.cancelOrder = function (orderId) {
        this.broker.cancelOrder(orderId);
    };
    TradingService.prototype.cancelTakeProfit = function (orderId) {
        this.broker.cancelTakeProfit(orderId);
    };
    TradingService.prototype.cancelStopLoss = function (orderId) {
        this.broker.cancelStopLoss(orderId);
    };
    TradingService.prototype.hasReversePositionOption = function () {
        return this.broker.hasReversePositionOption();
    };
    TradingService.prototype.hasClosePositionOption = function () {
        return this.broker.hasClosePositionOption();
    };
    TradingService.prototype.needToConcatSideTextWithTypeText = function () {
        return this.broker.needToConcatSideTextWithTypeText();
    };
    TradingService.prototype.useDarkLightTextColor = function () {
        return this.broker.useDarkLightTextColor();
    };
    TradingService.prototype.hasCancelOrderOption = function (orderId) {
        return this.broker.hasCancelOrderOption(orderId);
    };
    TradingService.prototype.canMoveOrder = function (orderId) {
        return this.broker.canMoveOrder(orderId);
    };
    TradingService.prototype.isSymbolTradableByBroker = function (symbol) {
        if (!symbol) {
            return false;
        }
        return null;
    };
    TradingService.prototype.isStopOrderSupportedByBroker = function () {
        return this.broker.isStopOrderSupported();
    };
    TradingService.prototype.deselectBroker = function () {
        Tc.assert(this.getBrokerType() != BrokerType.None, "no broker is selected");
        this.broker.deactivate();
        this.broker = this.createBroker(BrokerType.None);
        this.tradingStateService.setSelectedBroker(EnumUtils.enumValueToString(BrokerType, BrokerType.None));
        this.brokerSelectionStream.next(BrokerType.None);
        this.refreshSubscription.unsubscribe();
        this.brokerRefreshSubscription.unsubscribe();
        this.watchlistService.removeAllTradingWatchlists();
        this.sharedChannel.request({ type: ChannelRequestType.WatchlistRefresh });
    };
    TradingService.prototype.selectBroker = function (brokerType, isReconnectMode) {
        var _this = this;
        this.brokerSelectionStream.next(brokerType);
        window.setTimeout(function () {
            _this.broker = _this.createBroker(brokerType);
            _this.broker.getSessionStream().subscribe(function (established) {
                _this.onBrokerSessionEstablished(established);
                _this.sessionStream.next(established);
            });
            _this.broker.activate(isReconnectMode);
            _this.refreshSubscription = _this.broker.getPositionsLoadedStream().subscribe(function () {
                _this.brokerWatchlistManager.refreshTradingWatchlists(_this.broker);
            });
            _this.brokerRefreshSubscription = _this.broker.getRefreshStream().subscribe(function () {
                _this.brokerRefreshStream.next();
            });
            _this.broker.getCancelStream().subscribe(function () {
                if (_this.getBrokerType() == BrokerType.None) {
                    _this.brokerSelectionStream.next(BrokerType.None);
                }
            });
        }, 0);
    };
    TradingService.prototype.hasSelectedBroker = function () {
        return false;
    };
    TradingService.prototype.getBrokerRefreshStream = function () {
        return this.brokerRefreshStream;
    };
    TradingService.prototype.getTradingOrders = function () {
        return this.broker.getTradingOrders();
    };
    TradingService.prototype.getTradingPositions = function () {
        return this.broker.getTradingPositions();
    };
    TradingService.prototype.onBrokerSessionEstablished = function (established) {
        if (established) {
            var brokerTypeAsString = EnumUtils.enumValueToString(BrokerType, this.getBrokerType());
        }
    };
    TradingService.prototype.onLogout = function () {
        this.broker.onLogout();
    };
    TradingService.prototype.getSessionStream = function () {
        return this.sessionStream;
    };
    TradingService.prototype.getBrokerSelectionStream = function () {
        return this.brokerSelectionStream;
    };
    TradingService.prototype.getBrokerType = function () {
        return this.broker.getBrokerType();
    };
    TradingService.prototype.shouldDisplaySettings = function () {
        return this.broker.displaysSettings();
    };
    TradingService.prototype.shouldDisplayAccountBalances = function () {
        return this.broker.displayAccountBalances();
    };
    TradingService.prototype.shouldDisplayAccount = function () {
        return this.broker.displaysAccount();
    };
    TradingService.prototype.shouldDisplayAccountTransactions = function () {
        return this.broker.displayAccountTransactions();
    };
    TradingService.prototype.listAvailableBrokers = function () {
        var brokerTypes = [BrokerType.VirtualTrading];
        return brokerTypes;
    };
    TradingService.prototype.createBroker = function (brokerType) {
        switch (brokerType) {
            case BrokerType.Derayah:
                return new DerayahBroker(this.derayahService, this.derayahPositionService, this.derayahOrdersService, this.sharedChannel);
            case BrokerType.Snbcapital:
                return new SnbcapitalBroker(this.snbcapitalService, this.snbcapitalPositionService, this.snbcapitalOrdersService, this.sharedChannel);
            case BrokerType.VirtualTrading:
                return new VirtualTradingBroker(this.virtualTradingService, this.virtualTradingPositionsService, this.virtualTradingOrdersService, this.sharedChannel);
            case BrokerType.Tradestation:
                return new TradestationBroker(this.tradestationService, this.sharedChannel, this.tradestationAccountsService, this.tradestationLogoutService, this.tradestationOrdersService, this.tradestationPositionsService);
            case BrokerType.None:
                return new NoBroker();
            default:
                Tc.error("should not be here");
        }
    };
    TradingService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [DerayahService,
            DerayahOrdersService,
            DerayahPositionsService,
            SnbcapitalService,
            SnbcapitalOrdersService,
            SnbcapitalPositionsService,
            VirtualTradingService,
            VirtualTradingPositionsService,
            VirtualTradingOrdersService,
            SharedChannel,
            TradingStateService,
            WatchlistService,
            TradestationService,
            TradestationAccountsService,
            TradestationLogoutService,
            TradestationOrdersService,
            TradestationPositionsService])
    ], TradingService);
    return TradingService;
}());
export { TradingService };
//# sourceMappingURL=trading.service.js.map