import {Interval, IntervalType} from '../../loader';
import {LiquidityPoint} from '../../data/liquidity';
import {Tc} from '../../../utils';
import {IntervalUtils} from '../../../utils/interval.utils';

const last = require("lodash/last");
const cloneDeep = require("lodash/cloneDeep");

export class LiquidityPointsGrouper {

    private groupedPointsCache: {[symbol: string]: {[interval: string]: LiquidityPoint[]}} = {};

    public groupLiquidityPoints(marketAbbr: string, symbol: string, liquidityPoints: LiquidityPoint[], interval: Interval): LiquidityPoint[] {

        Tc.assert(this.needGrouping(interval), "grouping is called for non-grouped interval");

        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        // MA maintain a cache for grouped points to speed up their computation when requested
        // (and avoid recompute them always from scratch).
        // cache works as follow, whenever grouped points are requested, we get last computed points from the cache,
        // and remove the last computed "value" as it may need to be recomputed again because of any recent updates.
        // then we compute the new values again (and append them on the grouped points), and at the end, we
        // return it back and store it the cache for future requests.
        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        let groupedPoints = this.getLastGroupedPoints(symbol, interval);

        groupedPoints.pop(); // remove last point to force it to be recomputed again

        let from = 0 < groupedPoints.length ? groupedPoints[groupedPoints.length - 1].time : null; // from date from which we compute

        this.updateGroupedPointsFromBasePoints(groupedPoints, liquidityPoints, marketAbbr, interval, from);

        return this.groupedPointsCache[symbol][interval.serverInterval];

    }

    private updateGroupedPointsFromBasePoints(groupedPoints: LiquidityPoint[], liquidityPoints: LiquidityPoint[], marketAbbr: string, interval: Interval, from:string): void {

        liquidityPoints.forEach(entry => {

            if (from && entry.time <= from) {
                return;
            }

            let groupingTime: string = IntervalUtils.getGroupingTime(marketAbbr, interval, entry.time);

            let lastEntry: LiquidityPoint = last(groupedPoints);

            let appendToLastGroup: boolean = lastEntry && (lastEntry.time == groupingTime);

            if (appendToLastGroup) {
                this.groupEntry(lastEntry, entry);
            } else {
                let newEntry: LiquidityPoint = cloneDeep(entry);
                newEntry.time = groupingTime;
                groupedPoints.push(newEntry);
            }

        });

    }

    private getLastGroupedPoints(symbol: string, interval: Interval): LiquidityPoint[] {
        if (!(symbol in this.groupedPointsCache)) {
            this.groupedPointsCache[symbol] = {};
        }
        if (!(interval.serverInterval in this.groupedPointsCache[symbol])) {
            this.groupedPointsCache[symbol][interval.serverInterval] = [];
        }
        return this.groupedPointsCache[symbol][interval.serverInterval];
    }

    public needGrouping(interval:Interval): boolean {
        return [IntervalType.TenMinutes, IntervalType.TwentyMinutes, IntervalType.FourHours, IntervalType.Quarter, IntervalType.Year, IntervalType.Custom].includes(interval.type);
    }

    private groupEntry(group: LiquidityPoint, entry: LiquidityPoint): void {
        group.inflowAmount += entry.inflowAmount;
        group.inflowVolume += entry.inflowVolume;
        group.outflowAmount += entry.outflowAmount;
        group.outflowVolume += entry.outflowVolume;
        group.percentage += entry.percentage;
        group.netVolume += entry.netVolume;
        group.netAmount += entry.netAmount;
    }

}
