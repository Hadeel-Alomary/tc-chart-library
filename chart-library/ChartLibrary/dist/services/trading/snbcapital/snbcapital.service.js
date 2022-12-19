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
import { throwError as observableThrowError, BehaviorSubject, Subject } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Tc, TcTracker } from '../../../utils/index';
import { SnbcapitalErrorService } from './snbcapital-error.service';
import { ChannelRequestType, SharedChannel } from '../../shared-channel';
import { SnbcapitalLoaderService } from '../../loader/trading/snbcapital-loader/snbcapital-loader.service';
import { SnbcapitalSecurityAccountStatus } from './snbcapital-security-account-status';
import { RSA } from '../../../utils/RSA';
import { SnbcapitalHttpClientService } from './snbcapital-http-client-service';
import { SnbcapitalStreamer } from '../../streaming/streamer/trading/snbcapital/snbcapital-streamer';
import { LanguageService, SnbcapitalStateService } from "../../../services";
var find = require("lodash/find");
var SnbcapitalService = (function () {
    function SnbcapitalService(snbcapitalLoaderService, snbcapitalStateService, snbcapitalErrorService, snbcapitalHttpClientService, sharedChannel, languageService) {
        var _this = this;
        this.snbcapitalLoaderService = snbcapitalLoaderService;
        this.snbcapitalStateService = snbcapitalStateService;
        this.snbcapitalErrorService = snbcapitalErrorService;
        this.snbcapitalHttpClientService = snbcapitalHttpClientService;
        this.sharedChannel = sharedChannel;
        this.languageService = languageService;
        this.snbCapitalPortfolios = [];
        this.useFastOrder = false;
        this.purchasePowers = {};
        this.portfoliosStream = new BehaviorSubject(null);
        this.purchasePowersStream = new BehaviorSubject(null);
        this.showConnectScreenStream = new Subject();
        this.cancelBrokerSelectionStream = new Subject();
        this.disconnectStream = new Subject();
        this.snbcapitalStreamer = new SnbcapitalStreamer();
        this.snbcapitalStreamer.getSnbCapitalPurchasePowerStream()
            .subscribe(function (purchasePowerMessage) {
            _this.updatePurchasePower(purchasePowerMessage);
        });
        this.snbcapitalStreamer.getsnbcapitalNotificationTimeOutStream()
            .subscribe(function () { return _this.onNotificationStreamerHeartbeatTimeout(); });
        this.snbcapitalHttpClientService.getSessionExpiredStream()
            .subscribe(function () {
            _this.snbcapitalStreamer.disconnect();
        });
    }
    Object.defineProperty(SnbcapitalService.prototype, "portfolios", {
        get: function () {
            return this.snbCapitalPortfolios;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnbcapitalService.prototype, "validSession", {
        get: function () {
            return this.snbcapitalStateService.isValidSnbcapitalSession();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnbcapitalService.prototype, "snbcapitalUserName", {
        get: function () {
            return this.snbcapitalStateService.getSnbcapitalUserName();
        },
        enumerable: false,
        configurable: true
    });
    SnbcapitalService.prototype.activate = function () {
        if (this.validSession) {
            this.onSuccessLogin();
        }
        else {
            this.sharedChannel.request({ type: ChannelRequestType.SnbcapitalConnect });
        }
    };
    SnbcapitalService.prototype.appLogout = function () {
        this.sharedChannel.request({ type: ChannelRequestType.Reload });
    };
    SnbcapitalService.prototype.refreshPortfolios = function () {
        var _this = this;
        this.getPortfolios()
            .subscribe(function (response) { return _this.onPortfolios(response); }, function (error) { });
    };
    SnbcapitalService.prototype.onPortfolios = function (portfolios) {
        this.snbcapitalHttpClientService.setGbsCustomerCode(portfolios[0].gBSCustomerCode);
        this.snbCapitalPortfolios = portfolios;
        this.subscribeSnbcapitalTopic();
        this.loadPurchasePower();
        this.portfoliosStream.next(portfolios);
    };
    SnbcapitalService.prototype.refreshPortfolioAfterSecond = function (portfolio) {
        var _this = this;
        setTimeout(function () {
            _this.getSnbcapitalPurchasePower(portfolio).subscribe(function (purchasePower) {
                _this.purchasePowers[portfolio.portfolioId] = purchasePower;
                _this.purchasePowersStream.next(_this.purchasePowers);
            });
            _this.portfoliosStream.next([portfolio]);
        }, 1000);
    };
    SnbcapitalService.prototype.connectToSnbcapital = function (snbcapitalUserName, tickerchartPassword) {
        var _this = this;
        return this.snbcapitalLoaderService.connectToSnbcapital().pipe(switchMap(function (response) {
            var formattedPassword = response.EnablePasswordEncryption ? RSA.encrypt(tickerchartPassword, response.pk_mod, response.pk_exp) : tickerchartPassword;
            return _this.snbcapitalLoaderService.callLogin(snbcapitalUserName, formattedPassword);
        }), catchError(function (error) {
            var snbcapitalError = {
                expiredSession: false,
                message: _this.languageService.translate('مشكلة في الإتصال يرجى المحاولة مرة أخرى.'),
            };
            _this.snbcapitalErrorService.onError(snbcapitalError);
            throw observableThrowError(error);
        }), map(function (response) { return _this.onResponse(response); }), map(function (response) { return _this.onLoginResponse(response, snbcapitalUserName); }));
    };
    SnbcapitalService.prototype.onLoginResponse = function (response, snbcapitalUserName) {
        if (response.ReturnCode !== '0') {
            var error = { message: response.msgDescription, expiredSession: false };
            this.snbcapitalErrorService.onError(error);
            throw observableThrowError(error);
        }
        this.otpEnableEncryption = response.EnablePasswordEncryption;
        this.otpPublicKeyModulus = response.pk_mod;
        this.otpPublicKeyExponent = response.pk_exp;
        this.snbcapitalStateService.setSnbcapitalUserName(snbcapitalUserName);
        if (response.ExecuteSecondStep == "false") {
            this.onSuccessLogin();
        }
        return response;
    };
    SnbcapitalService.prototype.verify = function (mobileCode, password) {
        var _this = this;
        var formattedMobileCode = this.otpEnableEncryption ? RSA.encrypt(mobileCode, this.otpPublicKeyModulus, this.otpPublicKeyExponent) : mobileCode;
        var formattedPassword = this.otpEnableEncryption ? RSA.encrypt(password, this.otpPublicKeyModulus, this.otpPublicKeyExponent) : password;
        return this.snbcapitalLoaderService.verify(formattedMobileCode, this.snbcapitalStateService.getSnbcapitalUserName(), formattedPassword).pipe(map(function (response) { return _this.onResponse(response); }), map(function (response) { return _this.onVerify(response); }));
    };
    SnbcapitalService.prototype.disconnectFromSnbcapital = function () {
        var _this = this;
        this.disconnectStream.next();
        this.getDisconnectFromSnbcapitalApi()
            .subscribe(function () {
            _this.onDisconnectFromSnbcapital();
        }, function (error) {
            _this.onDisconnectFromSnbcapital();
        });
    };
    SnbcapitalService.prototype.snbcapitalRegisterApi = function () {
        var _this = this;
        return this.snbcapitalLoaderService.snbcapitalRegisterApi(this.snbcapitalUserName)
            .pipe(map(function (response) { return _this.onRegisterApi(response); }));
    };
    SnbcapitalService.prototype.loadPurchasePower = function () {
        var _this = this;
        var purchasePowers = {};
        var _loop_1 = function (portfolio) {
            this_1.getSnbcapitalPurchasePower(portfolio).subscribe(function (response) {
                purchasePowers[portfolio.portfolioId] = response;
                if (Object.keys(purchasePowers).length == _this.portfolios.length) {
                    _this.purchasePowers = purchasePowers;
                    _this.purchasePowersStream.next(_this.purchasePowers);
                }
            }, function (error) { });
        };
        var this_1 = this;
        for (var _i = 0, _a = this.portfolios; _i < _a.length; _i++) {
            var portfolio = _a[_i];
            _loop_1(portfolio);
        }
    };
    SnbcapitalService.prototype.getSnbcapitalPurchasePower = function (portfolio) {
        var _this = this;
        return this.snbcapitalLoaderService.getSnbcapitalPurchasePower(portfolio).pipe(map(function (response) { return _this.onResponse(response); }), map(function (response) { return _this.mapPurchasePower(response); }));
    };
    SnbcapitalService.prototype.updatePurchasePower = function (purchasePowerMessage) {
        var portfolio = this.portfolios.find(function (portfolio) { return portfolio.cashAccountCode == purchasePowerMessage.cashAccountCode; });
        this.purchasePowers[portfolio.portfolioId].purchasePower = purchasePowerMessage.purchasePower;
        this.purchasePowers[portfolio.portfolioId].currencyType = purchasePowerMessage.currencyType;
        this.purchasePowersStream.next(this.purchasePowers);
    };
    SnbcapitalService.prototype.getDisconnectFromSnbcapitalApi = function () {
        return this.snbcapitalLoaderService.disconnectFromSnbcapital();
    };
    SnbcapitalService.prototype.getPortfolios = function () {
        var _this = this;
        return this.snbcapitalLoaderService.getPortfolios().pipe(map(function (response) { return _this.onResponse(response); }), map(function (response) { return _this.mapPortfolios(response); }));
    };
    SnbcapitalService.prototype.subscribeSnbcapitalTopic = function () {
        if (this.portfolios) {
            this.snbcapitalStreamer.subscribeSnbCapitalTopics(this.portfolios);
        }
    };
    SnbcapitalService.prototype.disconnectSnbcapitalStreamer = function () {
        this.snbcapitalStreamer.disconnect();
    };
    SnbcapitalService.prototype.onVerify = function (response) {
        if (response['pagLoginOK'] && response['pagLoginOK']['ReturnCode'] === '0') {
            this.onSuccessLogin();
            return response;
        }
        else if (response['ReturnCode'] !== '0') {
            this.otpEnableEncryption = response.EnablePasswordEncryption;
            this.otpPublicKeyModulus = response.pk_mod;
            this.otpPublicKeyExponent = response.pk_exp;
            var error = { message: response['msgDescription'], expiredSession: false };
            this.snbcapitalErrorService.onError(error);
            throw observableThrowError(error);
            return null;
        }
    };
    SnbcapitalService.prototype.getSnbcapitalStreamerUrl = function () {
        return '';
    };
    SnbcapitalService.prototype.onSuccessLogin = function () {
        TcTracker.trackConnectedToSnbcapital();
        this.snbcapitalStateService.enableSnbcapitalSession();
        this.refreshPortfolios();
        this.snbcapitalStreamer.start(this.getSnbcapitalStreamerUrl());
    };
    SnbcapitalService.prototype.onDisconnectFromSnbcapital = function () {
        this.disconnectSnbcapitalStreamer();
        this.snbcapitalStateService.reset();
        this.portfoliosStream.next([]);
    };
    SnbcapitalService.prototype.onRegisterApi = function (response) {
        return response;
    };
    SnbcapitalService.prototype.mapPurchasePower = function (response) {
        return {
            purchasePower: response.caBalance.buyingPower,
            currencyType: response.caBalance.currencyCode,
            cashBalance: response.caBalance.cashBalance,
            bookedAmount: response.caBalance.bookedAmount,
            blockedAmount: response.caBalance.blockedAmount,
            underSettlement: response.caBalance.underSettlement,
            availableForCashOut: response.caBalance.availableForCashOut
        };
    };
    SnbcapitalService.prototype.mapPortfolios = function (response) {
        var portfolios = [];
        for (var _i = 0, _a = response.saList; _i < _a.length; _i++) {
            var securityAccountResponse = _a[_i];
            if (securityAccountResponse.saStatus == "3") {
                continue;
            }
            var securitySubAccount = securityAccountResponse.saSubAccountList[0];
            var cashAccount = securitySubAccount.caList[0];
            var portfolioInfo = {
                gBSCustomerCode: securityAccountResponse.cicCode,
                emailAddress: securityAccountResponse.emailAddress,
                portfolioId: securityAccountResponse.saCode,
                portfolioName: securityAccountResponse.csdCode,
                securityAccountBranchCode: securityAccountResponse.saBranchCode,
                securitySubAccountCode: securitySubAccount.ssaCode,
                cashAccountCode: cashAccount.caCode,
                cashAccountBranchCode: cashAccount.caBranchCode,
                currency: this.getCurrencyResponse(cashAccount.currency),
                securityAccountStatus: this.getSecurityAccountStatus(securityAccountResponse.saStatus)
            };
            portfolios.push(portfolioInfo);
        }
        return portfolios;
    };
    SnbcapitalService.prototype.getCurrencyResponse = function (currency) {
        return {
            CurrencyCode: currency.currencyCode,
            CurrencyDescription: currency.currencyDesc
        };
    };
    SnbcapitalService.prototype.getSecurityAccountStatus = function (securityAccountStatus) {
        switch (securityAccountStatus) {
            case "0":
                return SnbcapitalSecurityAccountStatus.Active;
            case "1":
                return SnbcapitalSecurityAccountStatus.Blocked;
            case "2":
                return SnbcapitalSecurityAccountStatus.Disabled;
            case "4":
                return SnbcapitalSecurityAccountStatus.Inserted;
        }
    };
    SnbcapitalService.prototype.getSnbcapitalStreamer = function () {
        return this.snbcapitalStreamer;
    };
    SnbcapitalService.prototype.getPortfoliosStream = function () {
        return this.portfoliosStream;
    };
    SnbcapitalService.prototype.getPurchasePowersStream = function () {
        return this.purchasePowersStream;
    };
    SnbcapitalService.prototype.getShowConnectScreenStream = function () {
        return this.showConnectScreenStream;
    };
    SnbcapitalService.prototype.pushShowConnectScreenStream = function () {
        this.showConnectScreenStream.next(null);
    };
    SnbcapitalService.prototype.getDisconnectStream = function () {
        return this.disconnectStream;
    };
    SnbcapitalService.prototype.getPortfolio = function (portfolioId) {
        var portfolio = find(this.portfolios, function (portfolio) { return portfolio.portfolioId == portfolioId; });
        Tc.assert(portfolio != null, 'Cannot find portfolio with number ' + portfolioId);
        return portfolio;
    };
    SnbcapitalService.prototype.onResponse = function (response) {
        var error = this.snbcapitalErrorService.errorDataResponseValidation(response);
        if (error) {
            if (error.expiredSession) {
                this.snbcapitalStateService.disableSnbcapitalSession();
                this.disconnectSnbcapitalStreamer();
            }
            this.snbcapitalErrorService.onError(error);
            throw observableThrowError(error);
        }
        return response;
    };
    SnbcapitalService.prototype.getCancelBrokerSelectionStream = function () {
        return this.cancelBrokerSelectionStream;
    };
    SnbcapitalService.prototype.onCancelConnection = function () {
        this.cancelBrokerSelectionStream.next();
    };
    SnbcapitalService.prototype.onNotificationStreamerHeartbeatTimeout = function () {
        this.disconnectSnbcapitalStreamer();
        this.snbcapitalStreamer.start(this.getSnbcapitalStreamerUrl());
        this.subscribeSnbcapitalTopic();
    };
    SnbcapitalService.prototype.setDefaultPortfolioId = function (portfolioId) {
        this.snbcapitalStateService.setSelectedBuySellPortfolioId(portfolioId);
    };
    SnbcapitalService.prototype.getDefaultPortfolioId = function () {
        var _this = this;
        if (this.snbcapitalStateService.getSelectedBuySellPortfolioId()) {
            var filteredPortfolio = this.getPortfoliosStream().getValue().find(function (portfolio) { return portfolio.portfolioId == _this.snbcapitalStateService.getSelectedBuySellPortfolioId(); });
            if (!filteredPortfolio) {
                this.snbcapitalStateService.setSelectedBuySellPortfolioId(null);
                return null;
            }
            return this.snbcapitalStateService.getSelectedBuySellPortfolioId();
        }
        return null;
    };
    SnbcapitalService.prototype.showFastOrderConfirmation = function (cbOnFastOrderValueChanged) {
        var self = this;
        var message1 = this.languageService.translate('ميزة الأمر السريع تتيح إرسال الأمر مباشرة دون إظهار شاشة تأكيد الأمر. ');
        var message2 = this.languageService.translate('يعتبر تفعيل هذه الميزه مخاطرة تقع على مسؤولية المستخدم, لذلك اقتضى التنبيه. ');
        var message3 = this.languageService.translate('هل تريد تفعيل الأمر السريع ؟ ');
        var request = {
            type: ChannelRequestType.Confirmation,
            messageLine: message1,
            messageLine2: message2,
            messageLine3: message3,
            caller: new (function () {
                function class_1() {
                }
                class_1.prototype.onConfirmation = function (confirmed, param) {
                    self.setUseFastOrder(confirmed);
                    cbOnFastOrderValueChanged();
                };
                return class_1;
            }())
        };
        this.sharedChannel.request(request);
    };
    SnbcapitalService.prototype.setUseFastOrder = function (isUseFastOrder) {
        this.useFastOrder = isUseFastOrder;
    };
    SnbcapitalService.prototype.getUseFastOrder = function () {
        return this.useFastOrder;
    };
    SnbcapitalService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [SnbcapitalLoaderService,
            SnbcapitalStateService,
            SnbcapitalErrorService,
            SnbcapitalHttpClientService,
            SharedChannel,
            LanguageService])
    ], SnbcapitalService);
    return SnbcapitalService;
}());
export { SnbcapitalService };
//# sourceMappingURL=snbcapital.service.js.map