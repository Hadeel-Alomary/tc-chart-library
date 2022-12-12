import {MarketTick} from './market-tick';
import {Injectable} from '@angular/core';

@Injectable()
export abstract class MarketsTickSizeService {
    public abstract getTickSize(market:string, price:number):number;
    public abstract  getMarketTickSizes(market:string):MarketTick[];
}

