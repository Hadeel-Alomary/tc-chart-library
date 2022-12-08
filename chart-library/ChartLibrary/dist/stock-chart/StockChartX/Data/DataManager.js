import { DataSeries, DataSeriesSuffix } from "./DataSeries";
var DataManager = (function () {
    function DataManager() {
        this._dataSeries = {};
    }
    Object.defineProperty(DataManager.prototype, "dateDataSeries", {
        get: function () {
            return this.getDataSeries(DataSeriesSuffix.DATE);
        },
        enumerable: false,
        configurable: true
    });
    DataManager.prototype.findDataSeries = function (suffix) {
        var series = this._dataSeries;
        for (var prop in series) {
            if (series.hasOwnProperty(prop)) {
                var pos = prop.lastIndexOf(suffix);
                if (pos >= 0 && pos === prop.length - suffix.length)
                    return series[prop];
            }
        }
        return null;
    };
    DataManager.prototype.getDataSeries = function (name, addIfNotFound) {
        if (addIfNotFound === void 0) { addIfNotFound = false; }
        var dataSeries = this._dataSeries[name];
        if (dataSeries)
            return dataSeries;
        return addIfNotFound ? this.addDataSeries(name) : null;
    };
    DataManager.prototype.addBarDataSeries = function (symbol) {
        if (symbol === void 0) { symbol = ''; }
        var dsSuffix = DataSeriesSuffix;
        return {
            date: this.addDataSeries(symbol + dsSuffix.DATE),
            open: this.addDataSeries(symbol + dsSuffix.OPEN),
            high: this.addDataSeries(symbol + dsSuffix.HIGH),
            low: this.addDataSeries(symbol + dsSuffix.LOW),
            close: this.addDataSeries(symbol + dsSuffix.CLOSE),
            volume: this.addDataSeries(symbol + dsSuffix.VOLUME),
        };
    };
    DataManager.prototype.clearDataSeries = function (dataSeries) {
        if (!dataSeries) {
            var series = this._dataSeries;
            for (var prop in series) {
                if (series.hasOwnProperty(prop))
                    series[prop].clear();
            }
        }
        else if (typeof dataSeries === 'string') {
            var series = this.getDataSeries(dataSeries);
            if (series)
                series.clear();
        }
        else {
            dataSeries.clear();
        }
    };
    DataManager.prototype.trimDataSeries = function (maxLength) {
        var series = this._dataSeries;
        for (var prop in series) {
            if (series.hasOwnProperty(prop)) {
                series[prop].trim(maxLength);
            }
        }
    };
    DataManager.prototype.barDataSeries = function (prefix, createIfNotFound) {
        if (prefix === void 0) { prefix = ''; }
        if (createIfNotFound === void 0) { createIfNotFound = false; }
        var dsSuffix = DataSeriesSuffix;
        return {
            date: this.getDataSeries(prefix + dsSuffix.DATE, createIfNotFound),
            open: this.getDataSeries(prefix + dsSuffix.OPEN, createIfNotFound),
            high: this.getDataSeries(prefix + dsSuffix.HIGH, createIfNotFound),
            low: this.getDataSeries(prefix + dsSuffix.LOW, createIfNotFound),
            close: this.getDataSeries(prefix + dsSuffix.CLOSE, createIfNotFound),
            volume: this.getDataSeries(prefix + dsSuffix.VOLUME, createIfNotFound),
        };
    };
    DataManager.prototype.ohlcDataSeries = function (prefix, createIfNotFound) {
        if (prefix === void 0) { prefix = ''; }
        if (createIfNotFound === void 0) { createIfNotFound = false; }
        var dsSuffix = DataSeriesSuffix;
        return {
            open: this.getDataSeries(prefix + dsSuffix.OPEN, createIfNotFound),
            high: this.getDataSeries(prefix + dsSuffix.HIGH, createIfNotFound),
            low: this.getDataSeries(prefix + dsSuffix.LOW, createIfNotFound),
            close: this.getDataSeries(prefix + dsSuffix.CLOSE, createIfNotFound),
        };
    };
    DataManager.prototype.addDataSeries = function (dataSeries, replaceIfExists) {
        if (replaceIfExists === void 0) { replaceIfExists = false; }
        if (!dataSeries)
            throw new Error("Data series is not specified.");
        if (typeof dataSeries === 'string') {
            return this.addDataSeries(new DataSeries(dataSeries), replaceIfExists);
        }
        if (!(dataSeries instanceof DataSeries))
            throw new TypeError("Invalid data series. Name or data series object expected.");
        var name = dataSeries.name;
        if (!name || typeof name !== 'string')
            throw new TypeError("Data series name must be non-empty string.");
        if (this.getDataSeries(name) && !replaceIfExists)
            throw new Error("Data series '" + name + "' exists already.");
        this._dataSeries[name] = dataSeries;
        return dataSeries;
    };
    DataManager.prototype.removeDataSeries = function (dataSeries) {
        if (!dataSeries) {
            this._dataSeries = {};
        }
        else {
            var name_1;
            if (typeof dataSeries === 'string') {
                name_1 = dataSeries;
            }
            else {
                name_1 = dataSeries.name;
            }
            delete this._dataSeries[name_1];
        }
    };
    DataManager.prototype.appendBars = function (bars) {
        var dataSeries = this.barDataSeries();
        var addBar = function (bar) {
            dataSeries.date.add(bar.date);
            dataSeries.open.add(bar.open);
            dataSeries.high.add(bar.high);
            dataSeries.low.add(bar.low);
            dataSeries.close.add(bar.close);
            dataSeries.volume.add(bar.volume);
        };
        if (Array.isArray(bars)) {
            for (var _i = 0, bars_1 = bars; _i < bars_1.length; _i++) {
                var bar = bars_1[_i];
                addBar(bar);
            }
        }
        else {
            addBar(bars);
        }
    };
    DataManager.prototype.bar = function (index) {
        var dataSeries = this.barDataSeries();
        return {
            date: dataSeries.date.valueAtIndex(index),
            open: dataSeries.open.valueAtIndex(index),
            high: dataSeries.high.valueAtIndex(index),
            low: dataSeries.low.valueAtIndex(index),
            close: dataSeries.close.valueAtIndex(index),
            volume: dataSeries.volume.valueAtIndex(index),
        };
    };
    return DataManager;
}());
export { DataManager };
//# sourceMappingURL=DataManager.js.map