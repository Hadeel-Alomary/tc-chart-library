import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {MarketUtils, Tc} from '../../../utils';
import {LiquidityPoint} from '../../liquidity/liquidity-point';
import {map} from 'rxjs/operators';
import {ProxiedUrlLoader} from '../proxied-url-loader';
import {ProxyService} from "../../../services";

@Injectable()
export class LiquidityLoaderService extends ProxiedUrlLoader{

    constructor(private http:HttpClient, private proxyService: ProxyService) {
        super(proxyService);
    }

    public loadSymbolHistory(url:string, symbol: string, market: string, intervalString: string, date: string): Observable<LiquidityPoint[]> {
        let symbolWithoutMarket: string = MarketUtils.symbolWithoutMarket(symbol);

        url = url.replace('{0}', market);
        url = url.replace('{1}', symbolWithoutMarket);
        url = url.replace('{2}', intervalString);
        url = url.replace('{3}', date);

        return this.http.get(this.getProxyAppliedUrl(url)).pipe(
            map((response: string[]) => {
                return LiquidityPoint.fromLoaderData(response);
            })
        );
    }
}
