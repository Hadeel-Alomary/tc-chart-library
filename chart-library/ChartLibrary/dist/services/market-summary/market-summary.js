var MarketSummary = (function () {
    function MarketSummary(market, date, time, trades, volume, amount, change, percentChange, index, liquidity, status, traded, advanced, declined, nochange) {
        this.market = market;
        this.date = date;
        this.time = time;
        this.trades = trades;
        this.volume = volume;
        this.amount = amount;
        this.change = change;
        this.percentChange = percentChange;
        this.index = index;
        this.liquidity = liquidity;
        this.status = status;
        this.traded = traded;
        this.advanced = advanced;
        this.declined = declined;
        this.nochange = nochange;
    }
    return MarketSummary;
}());
export { MarketSummary };
export var MarketSummaryStatus = {
    PRE_OPEN: "pre open",
    OPEN: "open",
    PRE_CLOSE: "pre close",
    CLOSED: "closed",
    CLOSING_AUCTION: "closing auction",
    TRADE_AT_LAST: "trade at last"
};
//# sourceMappingURL=market-summary.js.map