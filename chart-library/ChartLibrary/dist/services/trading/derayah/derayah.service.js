var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { throwError as observableThrowError, BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { DerayahStateService } from '../../state/index';
import { DerayahLoaderService } from '../../loader/index';
import { Tc, TcTracker, } from '../../../utils/index';
import { DerayahErrorService, } from './derayah-error.service';
import { SharedChannel } from '../../shared-channel';
import { DerayahLogoutService } from './derayah-logout.service';
import { DerayahStreamer } from '../../streaming/streamer/trading/derayah/derayah-streamer';
var find = require('lodash/find');
var clone = require('lodash/clone');
var DerayahService = (function () {
    function DerayahService(derayahLoaderService, derayahStateService, derayahErrorService, sharedChannel, derayahLogoutService) {
        var _this = this;
        this.derayahLoaderService = derayahLoaderService;
        this.derayahStateService = derayahStateService;
        this.derayahErrorService = derayahErrorService;
        this.sharedChannel = sharedChannel;
        this.derayahLogoutService = derayahLogoutService;
        this.derayahStreamerUrl = '';
        this._maxAllowedTriesToCreateNewQueue = 10;
        this._currentTryToCreateQueueIndex = 0;
        this._notFoundQueueInProgress = false;
        this.portfoliosStream = new BehaviorSubject(null);
        this.cancelBrokerSelectionStream = new Subject();
        this.derayahStreamer = new DerayahStreamer();
        this.derayahStreamer.getDerayahNotificationTimeOutStream()
            .subscribe(function () { return _this.onNotificationStreamerHeartbeatTimeout(); });
        this.derayahStreamer.getDerayahNotFoundQueueStream()
            .subscribe(function () { return _this.onNotFoundQueueId(); });
        this.derayahLogoutService.getLogoutStream()
            .subscribe(function () { return _this.disconnectDerayahStreamer(); });
    }
    Object.defineProperty(DerayahService.prototype, "token", {
        get: function () {
            return this.derayahStateService.getDerayahToken();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DerayahService.prototype, "connected", {
        get: function () {
            return this.token != null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DerayahService.prototype, "portfolios", {
        get: function () {
            return this.derayahStateService.getDerayahPortfolios();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DerayahService.prototype, "validSession", {
        get: function () {
            return this.derayahStateService.isValidDerayahSession();
        },
        enumerable: false,
        configurable: true
    });
    DerayahService.prototype.getToken = function () {
        return this.derayahStateService.getDerayahToken();
    };
    DerayahService.prototype.StartOAuthConnection = function () {
        this.startOauthWindowListener();
        window.open(this.derayahLoaderService.getLoginPageLink(), '_blank');
    };
    DerayahService.prototype.startOauthWindowListener = function () {
        var _this = this;
        window.addEventListener('message', function (event) {
            var code = event.data;
            if (code) {
                _this.derayahLoaderService.getAccessToken(code).subscribe(function (response) {
                    if (response.access_token) {
                        _this.derayahStateService.setDerayahToken(response.access_token);
                        _this.derayahStateService.setDerayahRefreshToken(response.refresh_token);
                        _this.derayahStateService.enableDerayahSession();
                        _this.derayahStreamer.start(_this.derayahStreamerUrl);
                        _this.refreshPortfolios(true);
                    }
                });
            }
        });
    };
    DerayahService.prototype.activate = function (isReconnectMode) {
        if (this.getToken() && this.validSession) {
            TcTracker.trackConnectedToDerayah();
            this.derayahStreamer.start(this.derayahStreamerUrl);
            this.refreshPortfolios(false);
        }
        else {
            this.derayahLogoutService.showLogInPage(isReconnectMode);
        }
    };
    DerayahService.prototype.deactivate = function () {
        this.disconnectFromDerayah();
    };
    DerayahService.prototype.refreshPortfolios = function (callIntegrationLink) {
        var _this = this;
        this.getPortfolios()
            .subscribe(function (response) { return _this.onPortfolios(response, callIntegrationLink); }, function (error) {
        });
    };
    DerayahService.prototype.onPortfolios = function (response, callIntegrationLink) {
        var portfolios = response.result;
        this.derayahStateService.setDerayahPortfolios(portfolios);
        if (callIntegrationLink) {
            this.callDerayahIntegration(portfolios.length);
        }
        var getQueueIdsFromStorage = this.isAllPortfoliosQueueIdsFound();
        this.handleDerayahTopicSubscriptions(getQueueIdsFromStorage);
        this.portfoliosStream.next(portfolios);
    };
    DerayahService.prototype.isAllPortfoliosQueueIdsFound = function () {
        var portfolios = this.portfolios;
        var portfoliosQueue = this.derayahStateService.getDerayahPortfoliosQueue() || [];
        var portfoliosNumbers = portfolios.map(function (portfolio) { return portfolio.portfolioNumber; });
        var portfoliosQueueNumbers = portfoliosQueue.map(function (portfolio) { return portfolio.portfolioNumber; });
        for (var _i = 0, portfoliosNumbers_1 = portfoliosNumbers; _i < portfoliosNumbers_1.length; _i++) {
            var portfoliosNumber = portfoliosNumbers_1[_i];
            if (portfoliosQueueNumbers.indexOf(portfoliosNumber) == -1) {
                return false;
            }
        }
        return true;
    };
    DerayahService.prototype.callDerayahIntegration = function (portfolioNum) {
        this.derayahLoaderService.callDerayahIntegrationLink(portfolioNum)
            .subscribe(function () {
        }, function (error) {
        });
    };
    DerayahService.prototype.getDerayahPurchasePower = function (portfolio, exchangeCode, symbol) {
        var _this = this;
        return this.derayahLoaderService.getDerayahPurchasePower(portfolio, exchangeCode, symbol).pipe(map(function (response) { return _this.mapPurchasePower(response); }));
    };
    DerayahService.prototype.getPortfolios = function () {
        return this.derayahLoaderService.getPortfolios().pipe(map(function (response) {
            return { result: clone(response.data) };
        }));
    };
    DerayahService.prototype.getPortfolioQueue = function (portfolioId) {
        return this.derayahLoaderService.getPortfolioQueue(portfolioId).pipe(map(function (response) {
            return { data: response.data };
        }));
    };
    DerayahService.prototype.disconnectFromDerayah = function () {
        this.disconnectDerayahStreamer();
        this.derayahStateService.reset();
        this.portfoliosStream.next(this.portfolios);
    };
    DerayahService.prototype.mapPurchasePower = function (response) {
        var result = response.data;
        return { result: { purchasePower: +result.purchasepower, currencyType: +result.ppcurrency } };
    };
    DerayahService.prototype.getPortfoliosStream = function () {
        return this.portfoliosStream;
    };
    DerayahService.prototype.getPortfolioName = function (portfolioNumber) {
        var portfolio = find(this.portfolios, function (portfolio) { return portfolio.portfolioNumber == portfolioNumber; });
        Tc.assert(portfolio != null, 'Cannot find portfolio with number ' + portfolioNumber);
        return portfolio.portfolioName;
    };
    DerayahService.prototype.onResponse = function (response) {
        if (!response['isSuccess']) {
            var error = this.derayahErrorService.extractErrorResponse(response);
            if (error.expiredSession) {
                this.derayahStateService.disableDerayahSession();
            }
            this.derayahErrorService.onError(error);
            throw observableThrowError(error);
        }
        return response;
    };
    DerayahService.prototype.handleDerayahTopicSubscriptions = function (getQueueIdsFromStorage) {
        var _this = this;
        if (getQueueIdsFromStorage) {
            this.subscribeToDerayahTopics(this.getStoragePortfoliosQueueIds());
            TcTracker.trackMessage('subscribe derayah topics from storage: ' + JSON.stringify(this.getStoragePortfoliosQueueIds()));
        }
        else {
            var portfoliosQueueIds_1 = [];
            this.portfolios.forEach(function (portfolio) {
                _this.getPortfolioQueue(portfolio.portfolioNumber).subscribe(function (queue) {
                    TcTracker.trackMessage('get derayah portfolio queue id: ' + portfolio.portfolioNumber);
                    if (queue.data) {
                        portfoliosQueueIds_1.push({ portfolioNumber: portfolio.portfolioNumber, portfolioQueueId: queue.data });
                    }
                    else {
                        TcTracker.trackMessage('derayah queue id is null for portfolio id: ' + portfolio.portfolioNumber);
                    }
                    if (portfoliosQueueIds_1.length == _this.portfolios.length) {
                        _this.derayahStateService.setDerayahPortfoliosQueue(portfoliosQueueIds_1);
                        var storagePortfoliosQueueIds = portfoliosQueueIds_1.map(function (portfoliosQueue) { return portfoliosQueue.portfolioQueueId; });
                        _this.subscribeToDerayahTopics(storagePortfoliosQueueIds);
                        TcTracker.trackMessage('subscribe derayah topics: ' + JSON.stringify(storagePortfoliosQueueIds));
                    }
                });
            });
        }
    };
    DerayahService.prototype.getStoragePortfoliosQueueIds = function () {
        var storagePortfoliosQueue = this.derayahStateService.getDerayahPortfoliosQueue();
        if (!storagePortfoliosQueue) {
            return [];
        }
        var portfoliosQueueNumbers = storagePortfoliosQueue.map(function (portfolio) { return portfolio.portfolioQueueId; });
        return portfoliosQueueNumbers;
    };
    DerayahService.prototype.subscribeToDerayahTopics = function (derayahPortfolioQueueIds) {
        for (var _i = 0, derayahPortfolioQueueIds_1 = derayahPortfolioQueueIds; _i < derayahPortfolioQueueIds_1.length; _i++) {
            var portfolioQueueId = derayahPortfolioQueueIds_1[_i];
            this.derayahStreamer.subscribeDerayahTopic(portfolioQueueId, null);
        }
    };
    DerayahService.prototype.disconnectDerayahStreamer = function () {
        this.derayahStreamer.unSubscribederayahTopics(this.getStoragePortfoliosQueueIds(), null);
        this.derayahStreamer.disconnect();
    };
    DerayahService.prototype.onNotificationStreamerHeartbeatTimeout = function () {
        this.disconnectDerayahStreamer();
        this.derayahStreamer.start(this.derayahStreamerUrl);
        var getQueueIdsFromStorage = true;
        this.handleDerayahTopicSubscriptions(getQueueIdsFromStorage);
    };
    DerayahService.prototype.onNotFoundQueueId = function () {
        var _this = this;
        if (!this._notFoundQueueInProgress && this._currentTryToCreateQueueIndex < this._maxAllowedTriesToCreateNewQueue) {
            this._notFoundQueueInProgress = true;
            this._currentTryToCreateQueueIndex++;
            window.setTimeout(function () {
                _this.derayahStreamer.unSubscribederayahTopics(_this.getStoragePortfoliosQueueIds(), null);
                var getQueueIdsFromStorage = false;
                _this.handleDerayahTopicSubscriptions(getQueueIdsFromStorage);
                _this._notFoundQueueInProgress = false;
            }, 5000);
        }
    };
    DerayahService.prototype.getDerayahStreamer = function () {
        return this.derayahStreamer;
    };
    DerayahService.prototype.getCancelBrokerSelectionStream = function () {
        return this.cancelBrokerSelectionStream;
    };
    DerayahService.prototype.onCancelConnection = function () {
        this.cancelBrokerSelectionStream.next();
    };
    DerayahService.prototype.ngOnDestroy = function () {
    };
    DerayahService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [DerayahLoaderService,
            DerayahStateService,
            DerayahErrorService,
            SharedChannel,
            DerayahLogoutService])
    ], DerayahService);
    return DerayahService;
}());
export { DerayahService };
//# sourceMappingURL=derayah.service.js.map