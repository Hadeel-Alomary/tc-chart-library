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
import { QuoteUpdater } from './quote-updater';
import { Quote, Quotes } from '../quote';
import { TechnicalIndicatorColumns } from "../../../services";
var TechnicalIndicatorQuoteUpdater = (function (_super) {
    __extends(TechnicalIndicatorQuoteUpdater, _super);
    function TechnicalIndicatorQuoteUpdater(technicalIndicatorQuoteService) {
        var _this = _super.call(this) || this;
        _this.technicalIndicatorQuoteService = technicalIndicatorQuoteService;
        return _this;
    }
    TechnicalIndicatorQuoteUpdater.prototype.onReceivingTechnicalIndicatorData = function (messages) {
        var splitTopic = messages['topic'].split('.');
        var topic = splitTopic[1];
        var marketAbbreviation = splitTopic[2];
        if (topic) {
            var colName = TechnicalIndicatorColumns.getColNameByTopic(topic);
            for (var _i = 0, _a = Object.keys(messages); _i < _a.length; _i++) {
                var key = _a[_i];
                if (key != 'topic') {
                    var symbol = key + '.' + marketAbbreviation;
                    var quote = Quotes.quotes.data[symbol];
                    var value = messages[key];
                    if (quote) {
                        Quote.updateTechnicalIndicator(quote, colName, value);
                        this.pushQuoteUpdate(symbol);
                    }
                }
            }
        }
    };
    return TechnicalIndicatorQuoteUpdater;
}(QuoteUpdater));
export { TechnicalIndicatorQuoteUpdater };
//# sourceMappingURL=technical-indicator-quote-updater.js.map