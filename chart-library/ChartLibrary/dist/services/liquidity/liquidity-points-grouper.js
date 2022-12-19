import { IntervalType } from '../loader';
import { Tc } from '../../utils';
import { IntervalUtils } from '../../utils/interval.utils';
var last = require("lodash/last");
var cloneDeep = require("lodash/cloneDeep");
var LiquidityPointsGrouper = (function () {
    function LiquidityPointsGrouper() {
        this.groupedPointsCache = {};
    }
    LiquidityPointsGrouper.prototype.groupLiquidityPoints = function (marketAbbr, symbol, liquidityPoints, interval) {
        Tc.assert(this.needGrouping(interval), "grouping is called for non-grouped interval");
        var groupedPoints = this.getLastGroupedPoints(symbol, interval);
        groupedPoints.pop();
        var from = 0 < groupedPoints.length ? groupedPoints[groupedPoints.length - 1].time : null;
        this.updateGroupedPointsFromBasePoints(groupedPoints, liquidityPoints, marketAbbr, interval, from);
        return this.groupedPointsCache[symbol][interval.serverInterval];
    };
    LiquidityPointsGrouper.prototype.updateGroupedPointsFromBasePoints = function (groupedPoints, liquidityPoints, marketAbbr, interval, from) {
        var _this = this;
        liquidityPoints.forEach(function (entry) {
            if (from && entry.time <= from) {
                return;
            }
            var groupingTime = IntervalUtils.getGroupingTime(marketAbbr, interval, entry.time);
            var lastEntry = last(groupedPoints);
            var appendToLastGroup = lastEntry && (lastEntry.time == groupingTime);
            if (appendToLastGroup) {
                _this.groupEntry(lastEntry, entry);
            }
            else {
                var newEntry = cloneDeep(entry);
                newEntry.time = groupingTime;
                groupedPoints.push(newEntry);
            }
        });
    };
    LiquidityPointsGrouper.prototype.getLastGroupedPoints = function (symbol, interval) {
        if (!(symbol in this.groupedPointsCache)) {
            this.groupedPointsCache[symbol] = {};
        }
        if (!(interval.serverInterval in this.groupedPointsCache[symbol])) {
            this.groupedPointsCache[symbol][interval.serverInterval] = [];
        }
        return this.groupedPointsCache[symbol][interval.serverInterval];
    };
    LiquidityPointsGrouper.prototype.needGrouping = function (interval) {
        return [IntervalType.TenMinutes, IntervalType.TwentyMinutes, IntervalType.FourHours, IntervalType.Quarter, IntervalType.Year, IntervalType.Custom].includes(interval.type);
    };
    LiquidityPointsGrouper.prototype.groupEntry = function (group, entry) {
        group.inflowAmount += entry.inflowAmount;
        group.inflowVolume += entry.inflowVolume;
        group.outflowAmount += entry.outflowAmount;
        group.outflowVolume += entry.outflowVolume;
        group.percentage += entry.percentage;
        group.netVolume += entry.netVolume;
        group.netAmount += entry.netAmount;
    };
    return LiquidityPointsGrouper;
}());
export { LiquidityPointsGrouper };
//# sourceMappingURL=liquidity-points-grouper.js.map