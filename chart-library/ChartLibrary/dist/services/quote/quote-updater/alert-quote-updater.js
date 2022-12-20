var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@angular/core";
import { AlertService } from "../../alert/index";
import { Quote, Quotes } from "../quote";
import { Tc } from "../../../utils/index";
import { QuoteUpdater } from './quote-updater';
var AlertQuoteUpdater = (function (_super) {
    __extends(AlertQuoteUpdater, _super);
    function AlertQuoteUpdater(alertService) {
        var _this = _super.call(this) || this;
        _this.alertService = alertService;
        _this.alertService.getAlertsHistoryLoadedStream().subscribe(function (loadingDone) {
            if (loadingDone) {
                _this.onLoaderDone();
            }
        }, function (error) { return Tc.error(error); });
        return _this;
    }
    AlertQuoteUpdater.prototype.onLoaderDone = function () {
        var _this = this;
        for (var _i = 0, _a = this.alertService.getActiveAlerts(); _i < _a.length; _i++) {
            var alert_1 = _a[_i];
            this.updateAlert(alert_1);
        }
        this.alertService.getAlertUpdatedStream().subscribe(function (alert) {
            alert.isActive() ? _this.updateAlert(alert) : _this.deleteAlert(alert);
        });
    };
    AlertQuoteUpdater.prototype.updateAlert = function (alert) {
        if (!alert.isNormalAlert()) {
            return;
        }
        var quote = Quotes.quotes.data[alert.company.symbol];
        Quote.updateAlert(quote, alert);
        this.pushQuoteUpdate(alert.company.symbol);
    };
    AlertQuoteUpdater.prototype.deleteAlert = function (alert) {
        if (!alert.isNormalAlert()) {
            return;
        }
        var quote = Quotes.quotes.data[alert.company.symbol];
        Quote.updateAlert(quote, null);
        this.pushQuoteUpdate(alert.company.symbol);
    };
    AlertQuoteUpdater = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AlertService])
    ], AlertQuoteUpdater);
    return AlertQuoteUpdater;
}(QuoteUpdater));
export { AlertQuoteUpdater };
//# sourceMappingURL=alert-quote-updater.js.map