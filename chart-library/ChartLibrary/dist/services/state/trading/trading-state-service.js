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
import { EnumUtils } from '../../../utils/enum.utils';
import { BrokerType } from '../../trading/broker/broker';
var TradingStateService = (function () {
    function TradingStateService() {
        if (localStorage.getItem(TradingStateService_1.STORAGE_KEY)) {
            this.storageData = JSON.parse(localStorage.getItem(TradingStateService_1.STORAGE_KEY));
            if (!("showExecutedOrders" in this.storageData)) {
                this.storageData.showExecutedOrders = true;
                this.write();
            }
        }
        else {
            this.storageData = {
                toolbarState: { position: { top: 15, left: 100 }, visible: true },
                selectedBroker: EnumUtils.enumValueToString(BrokerType, BrokerType.None),
                useFastOrder: false,
                showPositionDrawings: true,
                showOrderDrawings: true,
                showExecutedOrders: true
            };
        }
    }
    TradingStateService_1 = TradingStateService;
    TradingStateService.prototype.getVirtualTradingFloatingToolbarPosition = function () {
        return this.storageData.toolbarState.position;
    };
    TradingStateService.prototype.setVirtualTradingFloatingToolbarPosition = function (position) {
        this.storageData.toolbarState.position = position;
        this.write();
    };
    TradingStateService.prototype.setVirtualTradingFloatingToolbarVisibility = function (visible) {
        this.storageData.toolbarState.visible = visible;
        this.write();
    };
    TradingStateService.prototype.getVirtualTradingFloatingToolbarVisibility = function () {
        return this.storageData.toolbarState.visible;
    };
    TradingStateService.prototype.setSelectedBroker = function (availableBroker) {
        this.storageData.selectedBroker = availableBroker;
        this.write();
    };
    TradingStateService.prototype.setUseFastOrder = function (value) {
        this.storageData.useFastOrder = value;
        this.write();
    };
    TradingStateService.prototype.getUseFastOrder = function () {
        return this.storageData.useFastOrder;
    };
    TradingStateService.prototype.setShowPositionDrawings = function (value) {
        this.storageData.showPositionDrawings = value;
        this.write();
    };
    TradingStateService.prototype.getShowPositionDrawings = function () {
        return this.storageData.showPositionDrawings;
    };
    TradingStateService.prototype.setShowOrderDrawings = function (value) {
        this.storageData.showOrderDrawings = value;
        this.write();
    };
    TradingStateService.prototype.getShowOrderDrawings = function () {
        return this.storageData.showOrderDrawings;
    };
    TradingStateService.prototype.setShowExecutedOrders = function (value) {
        this.storageData.showExecutedOrders = value;
        this.write();
    };
    TradingStateService.prototype.getShowExecutedOrders = function () {
        return this.storageData.showExecutedOrders;
    };
    TradingStateService.prototype.write = function () {
        localStorage[TradingStateService_1.STORAGE_KEY] = JSON.stringify(this.storageData);
    };
    var TradingStateService_1;
    TradingStateService.STORAGE_KEY = 'TC_TRADING';
    TradingStateService = TradingStateService_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], TradingStateService);
    return TradingStateService;
}());
export { TradingStateService };
//# sourceMappingURL=trading-state-service.js.map