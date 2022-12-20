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
import { TradestationService } from './tradestation.service';
import { BehaviorSubject } from 'rxjs';
import { ChannelRequestType, SharedChannel } from '../../shared-channel';
import { LanguageService } from '../../language';
import { MarketUtils } from '../../../utils';
import { TradestationOrder, TradestationOrderSideType, TradestationOrderSideWrapper, TradestationOrderType } from './tradestation-order';
import { TradestationLoaderService } from '../../loader/trading/tradestation/tradestation-loader.service';
import { map } from 'rxjs/operators';
import { TradestationUtils } from '../../../utils/tradestation.utils';
import { TradestationOrdersService } from './tradestation-orders-service';
import { TradestationAccountsService } from './tradestation-accounts-service';
import { TradestationClosePositionsType } from "../../../data-types/types";
var TradestationPositionsService = (function () {
    function TradestationPositionsService(tradestationService, tradestationLoaderService, tradestationOrdersService, tradestationAccountsService, sharedChannel, languageService) {
        var _this = this;
        this.tradestationService = tradestationService;
        this.tradestationLoaderService = tradestationLoaderService;
        this.tradestationOrdersService = tradestationOrdersService;
        this.tradestationAccountsService = tradestationAccountsService;
        this.sharedChannel = sharedChannel;
        this.languageService = languageService;
        this.positions = [];
        this.closedPositionsCounter = 0;
        this.positionsStream = new BehaviorSubject([]);
        this.tradestationAccountsService.getAccountStream().subscribe(function () {
            _this.refreshPositions();
        });
    }
    TradestationPositionsService.prototype.getPositionsStream = function () {
        return this.positionsStream;
    };
    TradestationPositionsService.prototype.refreshPositions = function () {
        var _this = this;
        this.getPositions().subscribe(function (response) { return _this.onPositions(response); });
    };
    TradestationPositionsService.prototype.getPositions = function () {
        var _this = this;
        return this.tradestationLoaderService.getPositions().pipe(map(function (response) { return _this.mapPositions(response); }));
    };
    TradestationPositionsService.prototype.getPositionQuantity = function (symbol) {
        if (!this.positions) {
            return 0;
        }
        var companyPosition = this.positions.find(function (item) { return item.symbol == symbol; });
        return companyPosition ? companyPosition.quantity : 0;
    };
    TradestationPositionsService.prototype.onPositions = function (response) {
        this.positions = response;
        this.positionsStream.next(this.positions);
    };
    TradestationPositionsService.prototype.mapPositions = function (response) {
        var tradestationPositions = [];
        var positions = response;
        if (positions && positions.length > 0) {
            for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
                var item = positions_1[_i];
                var symbol = TradestationUtils.getSymbolWithMarketFromTradestation(item.Symbol);
            }
        }
        return tradestationPositions;
    };
    TradestationPositionsService.prototype.onClosePosition = function (filteredPositions) {
        var messageLine1 = this.languageService.translate('هل أنت متأكد من إغلاق هذه الصفقة ؟');
        var messageLine2 = this.languageService.translate('سيؤدي هذا أيضا الى إلغاء جميع الأوامر النشطة.');
        this.showClosePositionConfirmationMessage(filteredPositions, [messageLine1, messageLine2]);
    };
    TradestationPositionsService.prototype.showClosePositionConfirmationMessage = function (filteredPositions, messageLines) {
        var self = this;
        var confirmationRequest = {
            type: ChannelRequestType.TradestationConfirmationMessage,
            messageLines: messageLines,
            caller: new (function () {
                function class_1() {
                }
                class_1.prototype.onConfirmation = function (confirmed) {
                    if (confirmed) {
                        self.closedPositionsCounter = 0;
                        self.closePosition(filteredPositions);
                    }
                };
                return class_1;
            }())
        };
        this.sharedChannel.request(confirmationRequest);
    };
    TradestationPositionsService.prototype.closePosition = function (filteredPositions) {
        for (var _i = 0, filteredPositions_1 = filteredPositions; _i < filteredPositions_1.length; _i++) {
            var position = filteredPositions_1[_i];
            this.deleteActiveOrders(position);
            var type = position.type.value == TradestationOrderSideType.Buy ? TradestationOrderSideType.Sell : TradestationOrderSideType.BuyToCover;
            var order = TradestationOrder.fromPosition(position, type, TradestationOrderType.Market);
            order.quantity = Math.abs(order.quantity);
            this.postClosePositionOrder(filteredPositions, order);
        }
    };
    TradestationPositionsService.prototype.onReversePosition = function (position) {
        var warningMessageLines = this.getWarningMessageLines(position);
        var messageLine = this.languageService.translate('هل تريد المتابعة ؟');
        var self = this;
        var openRequest = {
            type: ChannelRequestType.TradestationConfirmationMessage,
            messageLines: [messageLine],
            warningMessageLines: warningMessageLines,
            caller: new (function () {
                function class_2() {
                }
                class_2.prototype.onConfirmation = function (confirmed) {
                    if (confirmed) {
                        self.deleteActiveOrders(position);
                        var reversePositionType1 = position.type.value == TradestationOrderSideType.Buy ? TradestationOrderSideType.Sell : TradestationOrderSideType.BuyToCover;
                        var reversePositionType2 = reversePositionType1 == TradestationOrderSideType.Sell ? TradestationOrderSideType.SellShort : TradestationOrderSideType.Buy;
                        var reversePositionOrder1 = TradestationOrder.fromPosition(position, reversePositionType1, TradestationOrderType.Market);
                        var reversePositionOrder2 = TradestationOrder.fromPosition(position, reversePositionType2, TradestationOrderType.Market);
                        reversePositionOrder1.quantity = Math.abs(reversePositionOrder1.quantity);
                        reversePositionOrder2.quantity = Math.abs(reversePositionOrder2.quantity);
                        self.postReversePositionOrder(reversePositionOrder1, reversePositionOrder2);
                    }
                };
                return class_2;
            }())
        };
        this.sharedChannel.request(openRequest);
    };
    TradestationPositionsService.prototype.getWarningMessageLines = function (position) {
        var orderType = this.getReverseOrderType(position);
        var symbolWithoutMarket = MarketUtils.symbolWithoutMarket(position.symbol);
        var orderType1;
        var orderType2;
        var messageHeader = this.languageService.translate('عكس هذه الصفقة سيؤدي تلقائيا الى :');
        var line1, line2, line3;
        if (this.languageService.arabic) {
            orderType1 = orderType.type1.arabic;
            orderType2 = orderType.type2.arabic;
            line1 = "   1 - \u0625\u0627\u0644\u063A\u0627\u0621 " + symbolWithoutMarket + ". \u062C\u0645\u064A\u0639 \u0627\u0644\u0623\u0648\u0627\u0645\u0631 \u0627\u0644\u0646\u0634\u0637\u0629.";
            line2 = "   2 - \u0625\u0636\u0627\u0641\u0629 \u0627\u0645\u0631 \"" + orderType1 + "\" - " + symbolWithoutMarket + " " + position.quantity + " @ \u0633\u0639\u0631 \u0627\u0644\u0633\u0648\u0642.";
            line3 = "   3 - \u0625\u0636\u0627\u0641\u0629 \u0627\u0645\u0631 \"" + orderType2 + "\" - " + symbolWithoutMarket + " " + position.quantity + " @ \u0633\u0639\u0631 \u0627\u0644\u0633\u0648\u0642.";
        }
        else {
            orderType1 = orderType.type1.english;
            orderType2 = orderType.type2.english;
            line1 = "    1- Cancel \"" + symbolWithoutMarket + "\" all active orders.";
            line2 = "    2- Add \"" + orderType1 + "\" order - " + position.quantity + " " + symbolWithoutMarket + " @ market price.";
            line3 = "    3- Add \"" + orderType2 + "\" order - " + position.quantity + " " + symbolWithoutMarket + " @ market price.";
        }
        return [messageHeader, line1, line2, line3];
    };
    TradestationPositionsService.prototype.getReverseOrderType = function (position) {
        var type1;
        var type2;
        if (position.type.value == TradestationOrderSideType.Buy) {
            type1 = TradestationOrderSideWrapper.fromValue(TradestationOrderSideType.Sell);
            type2 = TradestationOrderSideWrapper.fromValue(TradestationOrderSideType.SellShort);
        }
        else {
            type1 = TradestationOrderSideWrapper.fromValue(TradestationOrderSideType.Buy);
            type2 = TradestationOrderSideWrapper.fromValue(TradestationOrderSideType.BuyToCover);
        }
        return { type1: type1, type2: type2 };
    };
    TradestationPositionsService.prototype.postReversePositionOrder = function (order, osoOrder) {
        var _this = this;
        var osoOrders = osoOrder ? [osoOrder] : [];
        this.tradestationOrdersService.getOrderConfirmation(order, osoOrders).subscribe(function (response) {
            order.confirmationId = response[0].OrderConfirmId;
            osoOrder.confirmationId = response[1].OrderConfirmId;
            _this.tradestationOrdersService.postOrder(order, [osoOrder]).subscribe(function (response) {
                if (response[0].OrderStatus == 'Ok' && response[1].OrderStatus == 'Ok') {
                    _this.showMessageBox([response[0].Message, response[1].Message], false, false);
                }
                else {
                    _this.showMessageBox([response[0].Message, response[1].Message], true, true);
                }
            });
        });
    };
    TradestationPositionsService.prototype.deleteActiveOrders = function (position) {
        var orders = this.tradestationOrdersService.getGroupedOrders().filter(function (order) { return order.accountId == position.accountId; });
        if (orders) {
            var activeOrders = orders.filter(function (order) { return order.symbol == position.symbol && TradestationOrder.isActiveOrder(order); });
            this.tradestationOrdersService.deleteOrdersSequentially(activeOrders).subscribe(function (response) { });
        }
    };
    TradestationPositionsService.prototype.postClosePositionOrder = function (filteredPositions, order) {
        var _this = this;
        this.tradestationOrdersService.getOrderConfirmation(order, []).subscribe(function (response) {
            order.confirmationId = response[0].OrderConfirmId;
            _this.tradestationOrdersService.postOrder(order, []).subscribe(function (response) {
                if (response[0].OrderStatus == 'Ok' && filteredPositions.length == ++_this.closedPositionsCounter) {
                    var message = filteredPositions.length == 1 ? response[0].Message : _this.languageService.translate('.تم إغلاق الصفقات بنجاح');
                    _this.showMessageBox([message], false, false);
                }
                else {
                    _this.showMessageBox([response[0].Message], true, true);
                }
            });
        });
    };
    TradestationPositionsService.prototype.showMessageBox = function (messageLines, isErrorMessage, showWarningMessage) {
        var tradestationMessageChannelRequest = {
            type: ChannelRequestType.TradestationMessage,
            messageLines: messageLines,
            isErrorMessage: isErrorMessage,
            showWarningMessage: showWarningMessage
        };
        this.sharedChannel.request(tradestationMessageChannelRequest);
    };
    TradestationPositionsService.prototype.getPositionsByClosingType = function (closePositionType) {
        switch (closePositionType) {
            case TradestationClosePositionsType.All:
                return this.positions;
            case TradestationClosePositionsType.Long:
                return this.positions.filter(function (position) { return position.type.value == TradestationOrderSideType.Buy; });
            case TradestationClosePositionsType.Short:
                return this.positions.filter(function (position) { return position.type.value == TradestationOrderSideType.SellShort; });
            case TradestationClosePositionsType.Selected:
                return [];
            default:
                return [];
        }
    };
    TradestationPositionsService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [TradestationService, TradestationLoaderService, TradestationOrdersService, TradestationAccountsService, SharedChannel, LanguageService])
    ], TradestationPositionsService);
    return TradestationPositionsService;
}());
export { TradestationPositionsService };
//# sourceMappingURL=tradestation-positions-service.js.map