import { DataSeries, DataSeriesSuffix } from "./DataSeries";
var BarConverter = (function () {
    function BarConverter() {
    }
    BarConverter._setupOhlcDataSeries = function (suffix, dataSeries) {
        var dsSuffix = DataSeriesSuffix;
        dataSeries = dataSeries || {
            open: new DataSeries(suffix + dsSuffix.OPEN),
            high: new DataSeries(suffix + dsSuffix.HIGH),
            low: new DataSeries(suffix + dsSuffix.LOW),
            close: new DataSeries(suffix + dsSuffix.CLOSE)
        };
        dataSeries.open.clear();
        dataSeries.high.clear();
        dataSeries.low.clear();
        dataSeries.close.clear();
        return dataSeries;
    };
    BarConverter._setupBarDataSeries = function (suffix, dataSeries) {
        var dsSuffix = DataSeriesSuffix;
        dataSeries = this._setupOhlcDataSeries(suffix, dataSeries);
        if (dataSeries.date)
            dataSeries.date.clear();
        else
            dataSeries.date = new DataSeries(suffix + dsSuffix.DATE);
        if (dataSeries.volume)
            dataSeries.volume.clear();
        else
            dataSeries.volume = new DataSeries(suffix + dsSuffix.VOLUME);
        return dataSeries;
    };
    BarConverter.convertToHeikinAshi = function (inDataSeries, outDataSeries) {
        var dsSuffix = DataSeriesSuffix;
        outDataSeries = this._setupOhlcDataSeries(dsSuffix.HEIKIN_ASHI, outDataSeries);
        var inOpen = inDataSeries.open.values, inHigh = inDataSeries.high.values, inLow = inDataSeries.low.values, inClose = inDataSeries.close.values, count = inClose.length, outOpen = outDataSeries.open.values, outHigh = outDataSeries.high.values, outLow = outDataSeries.low.values, outClose = outDataSeries.close.values;
        for (var i = 0; i < count; i++) {
            var open_1 = i > 0 ? (outOpen[i - 1] + outClose[i - 1]) / 2 : inOpen[i], close_1 = (inOpen[i] + inHigh[i] + inLow[i] + inClose[i]) / 4, high = Math.max(open_1, close_1, inHigh[i]), low = Math.min(open_1, close_1, inLow[i]);
            outOpen.push(open_1);
            outHigh.push(high);
            outLow.push(low);
            outClose.push(close_1);
        }
        return outDataSeries;
    };
    BarConverter.convertToRenko = function (inDataSeries, boxSize, outDataSeries) {
        var dsSuffix = DataSeriesSuffix;
        outDataSeries = this._setupBarDataSeries(dsSuffix.RENKO, outDataSeries);
        if (!boxSize) {
            return outDataSeries;
        }
        var inDate = inDataSeries.date.values, inOpen = inDataSeries.open.values, inClose = inDataSeries.close.values, inVolume = inDataSeries.volume.values, count = inClose.length, outDate = outDataSeries.date.values, outOpen = outDataSeries.open.values, outHigh = outDataSeries.high.values, outLow = outDataSeries.low.values, outClose = outDataSeries.close.values, outVolume = outDataSeries.volume.values;
        if (count === 0)
            return outDataSeries;
        var time = null, startPrice = Math.floor(inOpen[0] / boxSize) * boxSize, lowBound = startPrice + boxSize, highBound = lowBound - boxSize, volume = 0;
        for (var i = 0; i < count; i++) {
            volume += inVolume[i];
            if (!time) {
                time = new Date(inDate[i].getTime());
            }
            var price = inClose[i];
            if (price - highBound >= boxSize) {
                var bricksCount = Math.trunc((price - highBound) / boxSize);
                for (var j = 0; j < bricksCount; j++) {
                    lowBound = highBound;
                    highBound += boxSize;
                    outDate.push(time);
                    outOpen.push(lowBound);
                    outHigh.push(highBound);
                    outLow.push(lowBound);
                    outClose.push(highBound);
                    outVolume.push(volume);
                    time = new Date(time.getTime() + 1000);
                }
                volume = 0;
                time = null;
            }
            else if (lowBound - price >= boxSize) {
                var bricksCount = Math.trunc((lowBound - price) / boxSize);
                for (var j = 0; j < bricksCount; j++) {
                    highBound = lowBound;
                    lowBound -= boxSize;
                    outDate.push(time);
                    outOpen.push(highBound);
                    outHigh.push(highBound);
                    outLow.push(lowBound);
                    outClose.push(lowBound);
                    outVolume.push(volume);
                    time = new Date(time.getTime() + 1000);
                }
                volume = 0;
                time = null;
            }
        }
        return outDataSeries;
    };
    BarConverter.convertToLineBreak = function (inDataSeries, lines, outDataSeries) {
        var dsSuffix = DataSeriesSuffix;
        outDataSeries = this._setupBarDataSeries(dsSuffix.LINE_BREAK, outDataSeries);
        var inDate = inDataSeries.date.values, inOpen = inDataSeries.open.values, inClose = inDataSeries.close.values, inVolume = inDataSeries.volume.values, count = inClose.length, outDate = outDataSeries.date.values, outOpen = outDataSeries.open.values, outHigh = outDataSeries.high.values, outLow = outDataSeries.low.values, outClose = outDataSeries.close.values, outVolume = outDataSeries.volume.values;
        if (count === 0)
            return outDataSeries;
        var time = null, min = inOpen[0], max = inOpen[0], volume = 0;
        for (var i = 0; i < count; i++) {
            volume += inVolume[i];
            if (time == null) {
                time = new Date(inDate[i].getTime());
            }
            var price = inClose[i], isNewMax = price > max, isNewMin = price < min;
            if (!isNewMax && !isNewMin)
                continue;
            var openPrice = min, outBarsCount = outClose.length;
            if (outBarsCount > 0) {
                openPrice = isNewMax ? outHigh[outBarsCount - 1] : outLow[outBarsCount - 1];
            }
            outOpen.push(openPrice);
            outHigh.push(Math.max(openPrice, price));
            outLow.push(Math.min(openPrice, price));
            outClose.push(price);
            outDate.push(time);
            outVolume.push(volume);
            if (isNewMax) {
                max = price;
                for (var j = outBarsCount - 1; j >= outBarsCount - lines; j--) {
                    if (outClose[j] > outOpen[j]) {
                        min = outLow[j];
                    }
                    else {
                        break;
                    }
                }
            }
            if (isNewMin) {
                min = price;
                for (var j = outBarsCount - 1; j >= outBarsCount - lines; j--) {
                    if (outClose[j] < outOpen[j]) {
                        max = outHigh[j];
                    }
                    else {
                        break;
                    }
                }
            }
            time = volume = null;
        }
        return outDataSeries;
    };
    BarConverter.convertToPointAndFigure = function (inDataSeries, boxSize, reversalAmount, outDataSeries) {
        var dsSuffix = DataSeriesSuffix;
        outDataSeries = this._setupBarDataSeries(dsSuffix.LINE_BREAK, outDataSeries);
        var inDate = inDataSeries.date.values, inOpen = inDataSeries.open.values, inClose = inDataSeries.close.values, inVolume = inDataSeries.volume.values, count = inClose.length, outDate = outDataSeries.date.values, outOpen = outDataSeries.open.values, outHigh = outDataSeries.high.values, outLow = outDataSeries.low.values, outClose = outDataSeries.close.values, outVolume = outDataSeries.volume.values;
        if (count === 0)
            return outDataSeries;
        var time = null, startPrice = inClose[0], reversal = boxSize * reversalAmount, isRaising = false, highBound = startPrice + boxSize / 2, lowBound = highBound - boxSize, volume = 0, i;
        for (i = 0; i < count; i++) {
            var price = inClose[i];
            if (price > highBound) {
                isRaising = true;
                break;
            }
            if (price < lowBound) {
                isRaising = false;
                break;
            }
        }
        for (; i < count; i++) {
            volume += inVolume[i];
            if (time == null) {
                time = new Date(inDate[i].getTime());
            }
            var price = inClose[i];
            if (isRaising) {
                if (price < highBound - reversal) {
                    var newHighBound = highBound - boxSize, newLowBound = lowBound - Math.round((lowBound - price) / boxSize) * boxSize;
                    if (Math.abs(newHighBound - newLowBound) > 1e-4) {
                        outOpen.push(lowBound);
                        outHigh.push(highBound);
                        outLow.push(lowBound);
                        outClose.push(highBound);
                        outVolume.push(volume);
                        outDate.push(time);
                        lowBound = newLowBound;
                        highBound = newHighBound;
                        volume = 0;
                        time = null;
                        isRaising = false;
                    }
                }
                else if (price > highBound) {
                    highBound += Math.round((price - highBound) / boxSize) * boxSize;
                }
            }
            else {
                if (price > lowBound + reversal) {
                    var newLowBound = lowBound + boxSize, newHighBound = highBound + Math.round((price - highBound) / boxSize) * boxSize;
                    if (Math.abs(newHighBound - newLowBound) > 1e-4) {
                        outOpen.push(highBound);
                        outHigh.push(highBound);
                        outLow.push(lowBound);
                        outClose.push(lowBound);
                        outVolume.push(volume);
                        outDate.push(time);
                        lowBound = newLowBound;
                        highBound = newHighBound;
                        volume = 0;
                        time = null;
                        isRaising = true;
                    }
                }
                else if (price < lowBound) {
                    lowBound -= Math.round((lowBound - price) / boxSize) * boxSize;
                }
            }
        }
        if (time) {
            outDate.push(time);
            outOpen.push(isRaising ? lowBound : highBound);
            outHigh.push(highBound);
            outLow.push(lowBound);
            outClose.push(isRaising ? highBound : lowBound);
            outVolume.push(volume);
        }
        return outDataSeries;
    };
    BarConverter.convertToKagi = function (inDataSeries, reversal, outDataSeries) {
        var dsSuffix = DataSeriesSuffix;
        outDataSeries = this._setupBarDataSeries(dsSuffix.LINE_BREAK, outDataSeries);
        var inDate = inDataSeries.date.values, inOpen = inDataSeries.open.values, inClose = inDataSeries.close.values, inVolume = inDataSeries.volume.values, count = inClose.length, outDate = outDataSeries.date.values, outOpen = outDataSeries.open.values, outHigh = outDataSeries.high.values, outLow = outDataSeries.low.values, outClose = outDataSeries.close.values, outVolume = outDataSeries.volume.values;
        if (count === 0)
            return outDataSeries;
        var time = null, volume = 0, checkPrice = inClose[0], prevCheckPrice = inOpen[0], isRaising = checkPrice >= prevCheckPrice;
        for (var i = 0; i < count; i++) {
            if (!time) {
                time = new Date(inDate[i].getTime());
            }
            var price = inClose[i], delta = price - checkPrice, isReversal = isRaising != (delta >= 0);
            if (isReversal && Math.abs(delta) >= reversal) {
                outDate.push(time);
                outOpen.push(prevCheckPrice);
                outHigh.push(Math.max(prevCheckPrice, checkPrice));
                outLow.push(Math.min(prevCheckPrice, checkPrice));
                outClose.push(checkPrice);
                outVolume.push(volume);
                prevCheckPrice = checkPrice;
                checkPrice = price;
                isRaising = !isRaising;
                time = null;
                volume = 0;
            }
            else {
                checkPrice = isRaising ? Math.max(checkPrice, price) : Math.min(checkPrice, price);
                volume += inVolume[0];
            }
        }
        return outDataSeries;
    };
    return BarConverter;
}());
export { BarConverter };
//# sourceMappingURL=BarConverter.js.map