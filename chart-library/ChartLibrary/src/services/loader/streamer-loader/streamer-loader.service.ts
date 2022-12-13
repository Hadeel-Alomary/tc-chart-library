import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Tc} from '../../../utils/index';

@Injectable()
export class StreamerLoader {

    constructor(private http:HttpClient) {}

    loadStreamerUrl(market:string):Observable<string> {

        let baseUrl:string = null;

        let url:string = `${baseUrl}?market_abbr=${market}&send_domain=1`;

        return this.http.get(Tc.url(url), {responseType: 'text'})
            .pipe(map(response => this.processResponse(response) ));

    }

    //sample response TAD:=:54.229.206.29:=:9006:=:liveeu08.tickerchart.net
    private processResponse(response:string):string {
        /**********************Handle Exception****************************/
        /*Exception Message: Cannot read property 'split' of null */
        if(response == null){
            response = '';
        }
        /*******************************************************************/

        let segments = response.trim().split(':=:');
        return `https://${segments[3]}/streamhub/`;
    }

}
