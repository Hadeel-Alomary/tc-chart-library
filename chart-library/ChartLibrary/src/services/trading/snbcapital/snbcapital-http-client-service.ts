import {Injectable, OnDestroy} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SnbcapitalErrorService} from './snbcapital-error.service';
import {SnbcapitalStateService} from '../../state/trading/snbcapital';

@Injectable()
export class SnbcapitalHttpClientService implements OnDestroy {

    private snbcapitalSessionExpiredStream: Subject<boolean>;

    private basicUrl: string;
    private customerCode: string;
    private timerId: number;
    private keepAliveLastCallSeconds: number = 0;

    constructor(private http: HttpClient, private snbcapitalStateService: SnbcapitalStateService, private snbcapitalErrorService: SnbcapitalErrorService) {

        this.fillBasicUrl();
        this.snbcapitalSessionExpiredStream = new Subject();

        // this.loader.getConfigStream()
        //     .subscribe((loaderConfig: LoaderConfig) => {
        //         if(loaderConfig){
        //             this.initializeKeepAliveTimer();
        //         }
        //     });
    }

    public getSessionExpiredStream() {
        return this.snbcapitalSessionExpiredStream;
    }

    private fillBasicUrl(){
        //Todo return back this to get from loader.
        this.basicUrl = '/IntegrationLayerTC/tcbridge';
        // if(!Config.isProd()) {
        //     this.basicUrl = `https://tickerchart-web/IntegrationLayerTC/tcbridge`;
        // }
    }

    private getHeaders() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            }),
            withCredentials: true
        };
    }

    public setGbsCustomerCode(customerCode: string){
        this.customerCode = customerCode;
    }

    private initializeKeepAliveTimer() {
        if(!this.timerId) {
            this.timerId = window.setInterval(() => {
                if(this.snbcapitalStateService.isValidSnbcapitalSession() && this.customerCode && this.keepAliveLastCallSeconds >= 30) {
                    // Send Keep alive after 30 seconds from the last request.
                    this.resetKeepAliveLastCallSeconds();
                    this.callKeepAlive();
                }
                this.keepAliveLastCallSeconds++;
            }, 1 * 1000);
        }
    }

    public clearRefreshTimer(): void {
        window.clearInterval(this.timerId);
        this.timerId = null;
    }

    private callKeepAlive(): void{
        this.http.post<SnbcapitalKeepAliveResponse>(this.basicUrl, `NameXsl=KEEPALIVE&JavaClient=JSON&GUserTrace=${this.customerCode}`, this.getHeaders())
            .subscribe((response: SnbcapitalKeepAliveResponse) => this.onKeepAliveResponse(response));
    }

    private onKeepAliveResponse(response: SnbcapitalKeepAliveResponse){
        if(response.status == 1){
            this.snbcapitalSessionExpiredStream.next(true);
            this.snbcapitalStateService.disableSnbcapitalSession();
            this.snbcapitalErrorService.emitSessionExpiredError();
        }
        return response;
    }

    private resetKeepAliveLastCallSeconds(){
        this.keepAliveLastCallSeconds = 0;
    }

    public get(): Observable<Object> {
        this.resetKeepAliveLastCallSeconds();
        return this.http.get(this.basicUrl, this.getHeaders()).pipe(map(response => response));
    }

    public post(body: Object|string): Observable<Object> {
        this.resetKeepAliveLastCallSeconds();
        return this.http.post(this.basicUrl, body, this.getHeaders()).pipe(map(response => response));
    }

    ngOnDestroy(): void {
        if (this.timerId) {
            this.clearRefreshTimer();
        }
    }
}

export interface SnbcapitalKeepAliveResponse {
    status: number
}
