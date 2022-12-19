import { TechnicalScopeSignal } from '../../services';
import { Tc } from '../../utils/index';
var Quote = (function () {
    function Quote(company, market, companyFlag, sector, isSubscriber) {
        var flag = companyFlag ? companyFlag.flag : '';
        var flagAnnouncement = companyFlag ? companyFlag.announcement : '';
        this.isSubscriber = isSubscriber;
        this.id = company.symbol;
        this.arabic = company.arabic;
        this.english = company.english;
        this.name = company.name;
        this.symbol = company.symbol;
        this.index = company.index;
        this.sector = sector;
        this.flag = flag.toLowerCase();
        this.flagAnnouncement = flagAnnouncement;
        this.flashing = { up: [], down: [] };
        this.changeSet = [];
        this.alert = null;
        this.news = null;
    }
    Quote.updateAlert = function (quote, alert) {
        quote.flashing = { up: [], down: [] };
        quote.changeSet = [];
        quote.alert = alert;
        quote.changeSet.push('alert');
    };
    Quote.updateNews = function (quote, news) {
        quote.flashing = { up: [], down: [] };
        quote.changeSet = [];
        quote.news = news;
        quote.changeSet.push('news');
    };
    Quote.updateAnalysis = function (quote, analysis) {
        quote.flashing = { up: [], down: [] };
        quote.changeSet = [];
        quote.analysis = analysis;
        quote.changeSet.push('analysis');
    };
    Quote.update = function (quote, message, loaderConfig) {
        quote.flashing = { up: [], down: [] };
        quote.changeSet = [];
        Object.keys(message).forEach(function (messageField) {
            if (messageField in Quote.messageToQuoteFieldsMapping) {
                var quoteField = Quote.messageToQuoteFieldsMapping[messageField];
                var newQuoteValue = Quote.nonNumericFields.includes(quoteField) ? message[messageField] : +message[messageField];
                quote.changeSet.push(quoteField);
                if (Quote.flashingFields.includes(quoteField)) {
                    if (newQuoteValue > quote[quoteField]) {
                        quote.flashing.up.push(quoteField);
                    }
                    else if (newQuoteValue < quote[quoteField]) {
                        quote.flashing.down.push(quoteField);
                    }
                }
                var updateValue = true;
                if (!quote.isSubscriber && Quote.subscribersQuoteFields.includes(messageField)) {
                    updateValue = false;
                }
                if (updateValue) {
                    quote[quoteField] = newQuoteValue;
                }
            }
        }, this);
        if (quote.changeSet.includes('liquidityInflowValue') ||
            quote.changeSet.includes('liquidityOutflowValue')) {
            quote.liquidityNet = quote.liquidityInflowValue - quote.liquidityOutflowValue;
            quote.liquidityFlow = quote.liquidityOutflowValue == 0 ? NaN : quote.liquidityInflowValue / quote.liquidityOutflowValue;
            quote.liquidityInflowPercent = (quote.liquidityInflowValue * 100) /
                (quote.liquidityInflowValue + quote.liquidityOutflowValue);
            quote.changeSet.push('liquidityNet', 'liquidityFlow', 'liquidityInflowPercent');
        }
        if (quote.changeSet.includes('alerttype')) {
            var config = loaderConfig.marketAlerts[message.alerttype.toLowerCase()];
            if (config) {
                quote.marketalerts = { arabic: config.arabic, english: config.english, alertType: quote.alerttype, alertEv: quote.alertev, alertTime: quote.alerttime };
                quote.changeSet.push('marketalerts');
            }
        }
        quote.limitUpReached = Quote.isLimitUp(quote);
        quote.limitDownReached = Quote.isLimitDown(quote);
        Quote.runtimeCheckQuoteDataType(quote);
    };
    Quote.isLimitUp = function (quote) {
        if (quote.index) {
            return false;
        }
        if (isNaN(quote.close) || isNaN(quote.high)) {
            return false;
        }
        return quote.limitUp <= quote.close;
    };
    Quote.isLimitDown = function (quote) {
        if (quote.index) {
            return false;
        }
        if (isNaN(quote.close) || isNaN(quote.limitDown)) {
            return false;
        }
        return quote.close <= quote.limitDown;
    };
    Quote.isValidQuote = function (quote) {
        if (isNaN(quote.open) ||
            isNaN(quote.high) ||
            isNaN(quote.low) ||
            isNaN(quote.close) ||
            isNaN(quote.volume) ||
            isNaN(quote.amount) ||
            quote.date.indexOf('#') != -1) {
            return false;
        }
        return true;
    };
    Quote.runtimeCheckQuoteDataType = function (quote) {
        Object.keys(quote).forEach(function (key) {
            Tc.assert(key in Quote.quoteDataGuard, "fail to find runtime attribute in QuoteData: " + key);
        });
        quote.changeSet.forEach(function (key) {
            Tc.assert(key in Quote.quoteDataGuard, "fail to find runtime attribute in QuoteData: " + key);
        });
        quote.flashing.up.forEach(function (key) {
            Tc.assert(key in Quote.quoteDataGuard, "fail to find runtime attribute in QuoteData: " + key);
        });
        quote.flashing.down.forEach(function (key) {
            Tc.assert(key in Quote.quoteDataGuard, "fail to find runtime attribute in QuoteData: " + key);
        });
    };
    Quote.updateTechnicalIndicator = function (quote, colName, val) {
        quote.flashing = { up: [], down: [] };
        quote.changeSet = [];
        quote[colName] = val;
        quote.changeSet.push(colName);
    };
    Quote.updateMarketWatchTechnicalScope = function (quote, signal, value) {
        quote.flashing = { up: [], down: [] };
        quote.changeSet = [];
        quote.technicalscope = TechnicalScopeSignal.evalTechnicalSignalState(signal, value);
        quote.changeSet.push('technicalscope');
    };
    Quote.quoteDataGuard = {
        arabic: null,
        english: null,
        name: null,
        id: null,
        sector: null,
        symbol: null,
        index: null,
        flag: null,
        flagAnnouncement: null,
        flashing: null,
        changeSet: null,
        open: null,
        high: null,
        low: null,
        close: null,
        last: null,
        lastVolume: null,
        previousClose: null,
        previousHigh: null,
        previousLow: null,
        volume: null,
        amount: null,
        trades: null,
        direction: null,
        change: null,
        changePercent: null,
        askVolume: null,
        totalAskVolume: null,
        askPrice: null,
        bidPrice: null,
        bidVolume: null,
        totalBidVolume: null,
        liquidityInflowValue: null,
        liquidityOutflowValue: null,
        liquidityInflowOrders: null,
        liquidityOutflowOrders: null,
        liquidityInflowVolume: null,
        liquidityOutflowVolume: null,
        liquidityNet: null,
        liquidityFlow: null,
        liquidityInflowPercent: null,
        limitUp: null,
        limitDown: null,
        maxLastVolume: null,
        limitUpReached: null,
        limitDownReached: null,
        date: null,
        time: null,
        week52High: null,
        week52Low: null,
        preOpenPrice: null,
        preOpenVolume: null,
        preOpenChange: null,
        preOpenChangePercentage: null,
        fairPrice: null,
        priceInIndex: null,
        changeInIndex: null,
        weightInIndex: null,
        weightInSector: null,
        effectOnIndex: null,
        effectOnSector: null,
        effectIndex: null,
        effectSector: null,
        openingValue: null,
        openingVolume: null,
        openingTrades: null,
        valueOnClosingPrice: null,
        volumeOnClosingPrice: null,
        tradesOnClosingPrice: null,
        alert: null,
        news: null,
        analysis: null,
        issuedshares: null,
        freeshares: null,
        pivot: null,
        range: null,
        support1: null,
        support2: null,
        support3: null,
        support4: null,
        resistance1: null,
        resistance2: null,
        resistance3: null,
        resistance4: null,
        phigh: null,
        plow: null,
        alerttype: null,
        alertev: null,
        alerttime: null,
        marketalerts: null,
        technicalscope: null,
        isSubscriber: null,
    };
    Quote.messageToQuoteFieldsMapping = {
        'open': 'open',
        'high': 'high',
        'low': 'low',
        'last': 'close',
        'volume': 'volume',
        'value': 'amount',
        'lasttradeprice': 'last',
        'lastvolume': 'lastVolume',
        'direction': 'direction',
        'change': 'change',
        'pchange': 'changePercent',
        'askvolume': 'askVolume',
        'askprice': 'askPrice',
        'bidprice': 'bidPrice',
        'bidvolume': 'bidVolume',
        'tbv': 'totalBidVolume',
        'tav': 'totalAskVolume',
        'trades': 'trades',
        'pclose': 'previousClose',
        'phigh': 'previousHigh',
        'plow': 'previousLow',
        'inflowvalue': 'liquidityInflowValue',
        'outflowvalue': 'liquidityOutflowValue',
        'inflowvolume': 'liquidityInflowVolume',
        'outflowvolume': 'liquidityOutflowVolume',
        'infloworders': 'liquidityInflowOrders',
        'outfloworders': 'liquidityOutflowOrders',
        'week52high': 'week52High',
        'week52low': 'week52Low',
        'gclose': 'preOpenPrice',
        'gvolume': 'preOpenVolume',
        'gchange': 'preOpenChange',
        'gpchange': 'preOpenChangePercentage',
        'date': 'date',
        'time': 'time',
        'fairPrice': 'fprice',
        'iclose': 'priceInIndex',
        'ichange': 'changeInIndex',
        'wgi': 'weightInIndex',
        'wsi': 'weightInSector',
        'egi': 'effectOnIndex',
        'esi': 'effectOnSector',
        'gegi': 'effectIndex',
        'gesi': 'effectSector',
        'max': 'limitUp',
        'min': 'limitDown',
        'maxlv': 'maxLastVolume',
        'ovalue': 'openingValue',
        'ovolume': 'openingVolume',
        'otrades': 'openingTrades',
        'cvalue': 'valueOnClosingPrice',
        'cvolume': 'volumeOnClosingPrice',
        'ctrades': 'tradesOnClosingPrice',
        'alerttype': 'alerttype',
        'alertev': 'alertev',
        'alerttime': 'alerttime',
    };
    Quote.subscribersQuoteFields = ['ovalue', 'ovolume', 'otrades', 'cvalue', 'cvolume', 'ctrades'];
    Quote.nonNumericFields = ['direction', 'date', 'time', 'alerttype', 'alertev', 'alerttime'];
    Quote.flashingFields = ['open', 'high', 'low', 'last', 'close', 'bidPrice', 'askPrice'];
    return Quote;
}());
export { Quote };
var Quotes = (function () {
    function Quotes() {
        this.data = {};
        this.list = [];
    }
    Quotes.prototype.length = function () {
        return Object.keys(this.data).length;
    };
    return Quotes;
}());
export { Quotes };
//# sourceMappingURL=quote.js.map