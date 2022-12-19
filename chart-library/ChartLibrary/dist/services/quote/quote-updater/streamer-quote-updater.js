var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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
import { Streamer } from "../../streaming/index";
import { Quote, Quotes } from "../quote";
import { Tc } from '../../../utils/index';
import { QuoteUpdater } from './quote-updater';
var StreamerQuoteUpdater = (function (_super) {
    __extends(StreamerQuoteUpdater, _super);
    function StreamerQuoteUpdater(streamer) {
        var _this = _super.call(this) || this;
        _this.streamer = streamer;
        return _this;
    }
    StreamerQuoteUpdater.prototype.onMarketData = function (market) {
        var _this = this;
        this.streamer.getQuoteMessageStream(market.abbreviation)
            .subscribe(function (message) { return _this.onReceivingQuoteMessage(message); }, function (error) { return Tc.error(error); });
    };
    StreamerQuoteUpdater.prototype.onReceivingQuoteMessage = function (message) {
        this.updateQuote(message);
        this.pushQuoteUpdate(message.symbol);
    };
    StreamerQuoteUpdater.prototype.updateQuote = function (message) {
        var quote = Quotes.quotes.data[message.symbol];
        Quote.update(quote, message, this.loaderConfig);
    };
    StreamerQuoteUpdater = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Streamer])
    ], StreamerQuoteUpdater);
    return StreamerQuoteUpdater;
}(QuoteUpdater));
export { StreamerQuoteUpdater };
//# sourceMappingURL=streamer-quote-updater.js.map