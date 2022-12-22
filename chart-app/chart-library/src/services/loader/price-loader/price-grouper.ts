import {Interval} from './interval';
import {IntervalType} from './interval-type';
import {PriceData} from './price-data';
import {IntervalUtils} from '../../../utils/interval.utils';

const last = require("lodash/last");
const cloneDeep = require("lodash/cloneDeep");

export class PriceGrouper {

    private static groupingTimeCache:{[key:string]:{[key:string]:{[key:string]:string}}} = {};

    public static groupPriceData(marketAbbr:string, data:PriceData[], interval:Interval):PriceData[] {

        if(!PriceGrouper.needGrouping(interval)) {return data;} // no need for grouping

        let groupedData:PriceData[] = [];

        // MA idea of grouping, we map the time of the entry to a "grouping" time,
        // and we group the entries according to their grouping time
        data.forEach(entry => {

            let groupingTime:string = PriceGrouper.getGroupingTime(marketAbbr, interval, entry.time);

            let lastEntry:PriceData = last(groupedData); // get latest grouped entry

            let appendToLastGroup:boolean = lastEntry && (lastEntry.time == groupingTime);

            if(appendToLastGroup ) {
                // if latest grouped entry has same groupingTime as new entry, then do grouping
                PriceGrouper.groupEntry(lastEntry, entry, true);
            } else {
                // different grouping time, start new entry
                let newEntry:PriceData = cloneDeep(entry); // clone needed so not to change original data
                newEntry.time = groupingTime;
                groupedData.push(newEntry);
            }
        });

        return groupedData;

    }

    private static getGroupingTime(marketAbbr: string, interval: Interval, time:string) {
        // MA this caching is added as it takes around 500 msec to do the mapping of large amount of dates (from price loader)
        // and for the "volume profiler", this could be requested more frequently to update volume profiler indicator. Since
        // such values are, kind of, static, then I added a cache concept to avoid keep recomputing them again and again.
        if(!PriceGrouper.groupingTimeCache[marketAbbr]) {
            PriceGrouper.groupingTimeCache[marketAbbr] = {};
        }
        if(!PriceGrouper.groupingTimeCache[marketAbbr][interval.serverInterval]) {
            PriceGrouper.groupingTimeCache[marketAbbr][interval.serverInterval] = {};
        }
        if(PriceGrouper.groupingTimeCache[marketAbbr][interval.serverInterval][time]){
            return PriceGrouper.groupingTimeCache[marketAbbr][interval.serverInterval][time];
        }
        let groupedTime = IntervalUtils.getGroupingTime(marketAbbr, interval, time);
        PriceGrouper.groupingTimeCache[marketAbbr][interval.serverInterval][time] = groupedTime;
        return groupedTime;
    }

    public static groupLastPriceData(marketAbbr:string, interval:Interval, lastPriceData:PriceData, newPriceData:PriceData):PriceData {

        let result:PriceData;

        let groupingTime:string = PriceGrouper.getGroupingTime(marketAbbr, interval, newPriceData.time);

        let append:boolean = lastPriceData.time == groupingTime;

        if(append) {
            PriceGrouper.groupEntry(lastPriceData, newPriceData, false); // append newPriceData to lastPriceData
            result = lastPriceData;
        } else {
            result = cloneDeep(newPriceData); // clone needed so not to change original data
            result.time = groupingTime; // adjust newPriceData time to match groupingTime and return it
        }

        return result;

    }

    private static needGrouping(interval:Interval) {
        return ![IntervalType.Minute, IntervalType.Day].includes(interval.type);
    }

    private static groupEntry(group:PriceData, entry:PriceData, groupingBack:boolean) {
        if(group.high < entry.high) {
            group.high = entry.high;
        }
        if(entry.low < group.low) {
            group.low = entry.low;
        }
        if(groupingBack){
            group.open = entry.open; // group back (entry is eariler in group), update open
        } else {
            group.close = entry.close; // group forward (entry is latest in group), update close
        }
        group.volume += entry.volume;
        group.amount += entry.amount;
        group.contracts += entry.contracts;
    }
}
