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
import { Injectable } from '@angular/core';
import { AnalysisCenterService } from '../../analysis-center/index';
import { Quote, Quotes } from '../quote';
import { QuoteUpdater } from "./quote-updater";
var AnalysisQuoteUpdater = (function (_super) {
    __extends(AnalysisQuoteUpdater, _super);
    function AnalysisQuoteUpdater(analysisService) {
        var _this = _super.call(this) || this;
        _this.analysisService = analysisService;
        return _this;
    }
    AnalysisQuoteUpdater.prototype.onLoaderDone = function () {
        var _this = this;
        this.analysisService.getAnalysisStreamer()
            .subscribe(function (analysis) {
            _this.onAnalysisUpdate(analysis);
        });
    };
    AnalysisQuoteUpdater.prototype.onAnalysisUpdate = function (analysis) {
        var quote = Quotes.quotes.data[analysis.symbol];
        if (analysis.deleted) {
            Quote.updateAnalysis(quote, null);
        }
        else {
            Quote.updateAnalysis(quote, analysis);
        }
        this.pushQuoteUpdate(analysis.symbol);
    };
    AnalysisQuoteUpdater = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AnalysisCenterService])
    ], AnalysisQuoteUpdater);
    return AnalysisQuoteUpdater;
}(QuoteUpdater));
export { AnalysisQuoteUpdater };
//# sourceMappingURL=analysis-quote-updater.js.map