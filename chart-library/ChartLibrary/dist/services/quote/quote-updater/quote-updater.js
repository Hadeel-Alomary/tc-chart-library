import { Subject } from 'rxjs';
var QuoteUpdater = (function () {
    function QuoteUpdater() {
        this.quoteUpdaterStream = new Subject();
    }
    QuoteUpdater.prototype.getQuoteUpdaterStream = function () {
        return this.quoteUpdaterStream;
    };
    QuoteUpdater.prototype.pushQuoteUpdate = function (symbol) {
        this.quoteUpdaterStream.next(symbol);
    };
    return QuoteUpdater;
}());
export { QuoteUpdater };
//# sourceMappingURL=quote-updater.js.map