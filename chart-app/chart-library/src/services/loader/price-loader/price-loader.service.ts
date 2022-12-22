import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {PriceData} from './price-data';
import {MarketUtils, Tc, TcTracker} from '../../../utils/index';
import {Interval} from './interval';
import {Period} from './period';
import {PriceGrouper} from './price-grouper';

const cloneDeep = require("lodash/cloneDeep");
const round = require("lodash/round");
const clone = require("lodash/clone");

// MA lastPriceData is the last entry of the price data coming from loader "before" grouping.
// it is needed for intraday grouping, in order to know where to start applying TAS
// and also it is needed for daily grouping, in order to know the volume of the last day
// which is needed to compute volume changes when the quote update
export interface GroupedPriceData {
    groupedData: PriceData[],
    lastPriceData: PriceData,
    splits: Split[]
}

export interface Split{
    value:number,
    date:string
}

@Injectable()
export class PriceLoader {

    constructor(private http: HttpClient){}

    // MA TODO few things that should be done here:
    // 2. We need to add the concept of "تجميع" as was described by Darweesh for different intervals
    // 3. pass the password as "encrypted" and not plainly as this (on web, users can easy look into urls)
    // 4. we need to add a flag to prevent this from "being" cached
    // 5. we need to add signing for the urls.
    loadPriceData(baseUrl:string, userName:string ,symbol:string, interval:Interval, period:Period):Observable<GroupedPriceData>{
        return this.loadRawPricesData(baseUrl,userName, symbol, interval, period).pipe(map(data => {
            data.priceData = this.applySplits(data.priceData, cloneDeep(data.splits)); // adjust data
            return {groupedData: this.groupPriceData(MarketUtils.marketAbbr(symbol), data.priceData, interval), lastPriceData: data.priceData[0], splits: data.splits};
        }))
    }

    private loadRawPricesData(baseUrl:string, userName:string , symbol:string, interval:Interval, period:Period , applySplit:boolean = true):Observable<{priceData: PriceData[], splits:Split[]}>{

        let startTime:number = new Date().getTime();

        // MA TODO Add a helper for the url (which add timestamp and such)
        let url:string = baseUrl + '?' +
            `user_name=${userName}&symbol=${symbol}` +
            `&interval=${Interval.mapIntervalToServerInterval(interval).serverInterval}&period=${period.serverPeriod}`;

        Tc.info("request prices history: " + url);
        return this.http.get(Tc.url(url), {responseType: 'text'})
            .pipe(map(( response : string) => {
                this.logSlowRequest(startTime, 'price-loader');
                return this.processPriceData(response, Interval.isDaily(interval));
            }));

    }


    loadTimeAndSale(baseUrl:string, userName:string , symbol:string, period:string, date:string ):Observable<PriceData[]>{

        let startTime:number = new Date().getTime();

        let url:string = baseUrl + '?' +
            `user_name=${userName}&symbol=${symbol}` +
            `&interval=tick&period=${period}`;

        if(date != null) {
            url +=`&historical_trades_date=${date}`;
        }

        Tc.info("request time and sale : " + url);
        return this.http.get(Tc.url(url), {responseType: 'text'})
            .pipe(map( (response : string) => {
                this.logSlowRequest(startTime, 'time-and-sale');
                return this.processPriceData(response, false).priceData;
            }));

    }

    private groupPriceData(marketAbbr:string, data:PriceData[], interval:Interval):PriceData[] {
        return PriceGrouper.groupPriceData(marketAbbr, data, interval);
    }

    private processPriceData(response:string, daily:boolean):{priceData: PriceData[], splits:Split[] } {

        let priceData:PriceData[] = [];

        let state:string = 'none';

        let splits:Split[] = [];

        /**********************Handle Exception****************************/
        /*Exception Message: Cannot read property 'split' of null */
        if(response == null){
            response = '';
        }
        /*******************************************************************/

        response.split('\n').forEach((line:string) => {
            line = line.trim();

            if(line == '') { return; }

            if(line == 'HistoricalData'){
                Tc.assert(state == 'none', "invalid state");
                state = 'price';
            } else if(line == 'SPLIT'){
                Tc.assert(state == 'none', "invalid state");
                state = 'split'
            } else if(line == 'END'){
                Tc.assert(state != 'none', "invalid state");
                state = 'none';
            } else if(state == 'price') {
                priceData.push(daily ? this.processDailyPriceLine(line) : this.processIntraDayPriceLine(line));
            } else if(state == 'split') {
                splits.push({date: line.split(',')[0], value: +line.split(',')[1]});
            } else {
                Tc.error("should never be here - " + line);
            }
        }, this);

        if(state != 'none'){ // MA we haven't got a complete response from server, ignore
            Tc.warn("price loading response wasnot complete");
            return {priceData: [], splits: []};
        }
        //NK clone it because we need the original one

        return {priceData: priceData, splits: splits};

    }


    private processDailyPriceLine(line:string): PriceData {

        // 1day: 2016-06-23          ,6532.42 ,6554.19 ,6521.30 ,6550.97 ,214995810 ,3352782233.30 ,71670 ,0

        var fields = line.split(",");

        return  {
            time: fields[0],
            open: +fields[1],
            high: +fields[2],
            low: +fields[3],
            close: +fields[4],
            volume: +fields[5],
            amount: +fields[6],
            contracts: +fields[7]
        };
    }

    private processIntraDayPriceLine(line:string): PriceData {

        // 1min: 2016-06-26 14:23:00 ,6461.51 ,6462.34 ,6456.99 ,6458.12 ,880879    ,27255360.50   ,sell  ,269763 ,+ ,374
        // tick: 2016-06-27 12:23:47 ,81.75   ,81.75   ,81.75   ,81.75   ,1222      ,99898.50      ,sell  ,44779  ,= ,1
        // st:   2016-05-30 12:54:14 ,76.75   ,76.75   ,76.75   ,76.75   ,15000     ,1151250.00    ,sell  ,52859  ,= ,1 ,true ,st

        var fields = line.split(",");

        let priceData:PriceData =  {
            time: fields[0],
            open: +fields[1],
            high: +fields[2],
            low: +fields[3],
            close: +fields[4],
            volume: +fields[5],
            amount: +fields[6],
            state: fields[7],
            contracts: +fields[10],
            direction: fields[9],
            id: +fields[8],
            specialTrade: false,
        };


        if(fields[12] && fields[12] == 'st'){ // special trade
            priceData.specialTrade = true;
        }

        return priceData;

    }

    private applySplits(prices:PriceData[], splits:Split[]):PriceData[] {

        if(!splits.length){ // no splits, bye!
            return prices;
        }

        splits.reverse(); // have latest splits first

        let splitFactor = 1;

        let adjustedPrices = prices.map(price => {

            let date = 10 < price.time.length ? price.time.substr(0, 10) : price.time; // if time, trim it to date

            if(splits.length && date < splits[0].date) { // update splits factor if there are splits after price date
                splitFactor *= splits[0].value;
                splits.shift();
            }

            if(splitFactor == 1) { // no split factor, return price (save computation)
                return price;
            }

            // MA picked 3 digits for other markets, and since chart object showsn 3 digits also
            let adjustedPrice = clone(price);
            adjustedPrice.open = round(adjustedPrice.open / splitFactor, 3);
            adjustedPrice.high = round(adjustedPrice.high / splitFactor, 3);
            adjustedPrice.low = round(adjustedPrice.low / splitFactor, 3);
            adjustedPrice.close = round(adjustedPrice.close / splitFactor, 3);
            adjustedPrice.volume = round(adjustedPrice.volume * splitFactor);

            return adjustedPrice;

        });

        return adjustedPrices;

    }


    private logSlowRequest(startTime:number, type:string) {
        let endTime:number = new Date().getTime();
        // for now, changing it to 50msec in order to log everything (and have a better feeling of the speed)
        // MA revert it back later.
        if( 1500 < (endTime - startTime) ){
            if(TcTracker.isEnabled()) {
                TcTracker.trackSlowRequest(type, endTime - startTime);
            }
        }
    }


}
