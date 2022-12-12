import {Injectable} from "@angular/core";
import {HttpClient} from '@angular/common/http';
import {Tc} from '../../../utils/index';
import {News} from '../../news/news';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CategoryNews} from '../../news/category-news';
import {ProxiedUrlLoader} from '../proxied-url-loader';
import {ProxyService} from "../../../services";

@Injectable()
export class NewsLoader extends ProxiedUrlLoader {

    constructor(private http:HttpClient, private proxyService: ProxyService){
        super(proxyService);
    }

    loadMarketNews(market:string):Observable<News[]> {

        let today:string = moment().format('YYYY-MM-DD');
        let lastWeek:string = moment().subtract(1, 'weeks').format('YYYY-MM-DD');

        let baseUrl:string = null;
        baseUrl = baseUrl.replace('{0}', market);
        
        let url:string = baseUrl + `?from_date=${lastWeek}&to_date=${today}&keyword=&symbol=`;

        Tc.info("market news url:" + url);
        
        return this.http.get(this.getProxyAppliedUrl(url))
            .pipe(map((response: NewsResponse) => this.onData(response)));
    }
    
    loadCompanyNews(symbol:string):Observable<News[]>{
        
        let url:string = null;
        url = url.replace('{0}', symbol);

        Tc.info("news url:" + url);
        
        return this.http.get(this.getProxyAppliedUrl(url))
            .pipe(map((response: NewsResponse) => this.onData(response)));
        
        
    }

    loadCategoryNews(marketId: number, category: number): Observable<CategoryNews[]>{
        let url: string =null;
        url = url.replace('{0}', `${marketId}`);
        url = url.replace('{1}', `${category}`);

        Tc.info("news url:" + url);

        return this.http.get(this.getProxyAppliedUrl(url)).pipe(
            map((response: CategoryNewsResponse[]) => {
                return CategoryNews.fromLoaderData(response);
            })
        );
    }

    loadNewsTitle(newsId: number): Observable<string>{
        let url: string = null;
        url = url.replace('{0}', `${newsId}`);

        Tc.info("news url:" + url);

        return this.http.get(this.getProxyAppliedUrl(url)).pipe(
            map((response: NewsTitleResponse) => {
                return response.title;
            })
        );
    }

    private onData(json: NewsResponse):News[] {

        let news:News[] = [];

        // MA empty result
        if(!json.values.forEach){ return news; }

        // NK json contains: columns, values
        // NK news columns: "news_id", "daily_date", "title", "symbol", "market_abbr"
        json.values.forEach((announcement: string[]) => {
            let market = null;
            news.push(News.fromLoader(announcement, market));
        });

        return news;
    }
}

export interface CategoryNewsResponse {
    news_id: number,
    daily_date: string,
    company_id: number
}

export interface NewsTitleResponse {
    title: string
}

export interface NewsResponse {
    columns: string[],
    values: string[][]
}
