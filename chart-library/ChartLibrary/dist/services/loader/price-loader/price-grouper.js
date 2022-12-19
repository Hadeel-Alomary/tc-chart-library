import { IntervalType } from './interval-type';
import { IntervalUtils } from '../../../utils/interval.utils';
var last = require("lodash/last");
var cloneDeep = require("lodash/cloneDeep");
var PriceGrouper = (function () {
    function PriceGrouper() {
    }
    PriceGrouper.groupPriceData = function (marketAbbr, data, interval) {
        if (!PriceGrouper.needGrouping(interval)) {
            return data;
        }
        var groupedData = [];
        data.forEach(function (entry) {
            var groupingTime = PriceGrouper.getGroupingTime(marketAbbr, interval, entry.time);
            var lastEntry = last(groupedData);
            var appendToLastGroup = lastEntry && (lastEntry.time == groupingTime);
            if (appendToLastGroup) {
                PriceGrouper.groupEntry(lastEntry, entry, true);
            }
            else {
                var newEntry = cloneDeep(entry);
                newEntry.time = groupingTime;
                groupedData.push(newEntry);
            }
        });
        return groupedData;
    };
    PriceGrouper.getGroupingTime = function (marketAbbr, interval, time) {
        if (!PriceGrouper.groupingTimeCache[marketAbbr]) {
            PriceGrouper.groupingTimeCache[marketAbbr] = {};
        }
        if (!PriceGrouper.groupingTimeCache[marketAbbr][interval.serverInterval]) {
            PriceGrouper.groupingTimeCache[marketAbbr][interval.serverInterval] = {};
        }
        if (PriceGrouper.groupingTimeCache[marketAbbr][interval.serverInterval][time]) {
            return PriceGrouper.groupingTimeCache[marketAbbr][interval.serverInterval][time];
        }
        var groupedTime = IntervalUtils.getGroupingTime(marketAbbr, interval, time);
        PriceGrouper.groupingTimeCache[marketAbbr][interval.serverInterval][time] = groupedTime;
        return groupedTime;
    };
    PriceGrouper.groupLastPriceData = function (marketAbbr, interval, lastPriceData, newPriceData) {
        var result;
        var groupingTime = PriceGrouper.getGroupingTime(marketAbbr, interval, newPriceData.time);
        var append = lastPriceData.time == groupingTime;
        if (append) {
            PriceGrouper.groupEntry(lastPriceData, newPriceData, false);
            result = lastPriceData;
        }
        else {
            result = cloneDeep(newPriceData);
            result.time = groupingTime;
        }
        return result;
    };
    PriceGrouper.needGrouping = function (interval) {
        return ![IntervalType.Minute, IntervalType.Day].includes(interval.type);
    };
    PriceGrouper.groupEntry = function (group, entry, groupingBack) {
        if (group.high < entry.high) {
            group.high = entry.high;
        }
        if (entry.low < group.low) {
            group.low = entry.low;
        }
        if (groupingBack) {
            group.open = entry.open;
        }
        else {
            group.close = entry.close;
        }
        group.volume += entry.volume;
        group.amount += entry.amount;
        group.contracts += entry.contracts;
    };
    PriceGrouper.groupingTimeCache = {};
    return PriceGrouper;
}());
export { PriceGrouper };
//# sourceMappingURL=price-grouper.js.map