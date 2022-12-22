import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {Tc} from '../../../utils';
import {TradestationStateService} from '../../state/trading/tradestation';
import {TradestationClientService} from './tradestation-client-service';
import {TradestationLogoutService} from './tradestation-logout-service';

@Injectable()
export class TradestationHttpClientService {
    constructor(private http: HttpClient, private tradestationLogoutService: TradestationLogoutService, private tradestationClientService: TradestationClientService, private tradestationStateService: TradestationStateService) { }

    private getToken(){
        return this.tradestationStateService.getTradestationToken();
    }
    private getRefreshToken(){
        return this.tradestationStateService.getTradestationRefreshToken();
    }

    public getWithAuth(url: string): Observable<Object> {
        return this.http.get(url, this.getTcAuthOptions(this.getToken())).pipe(
            switchMap((response: Object) => {
                return of(response);
            }),
            catchError((error: HttpErrorResponse) => {
                if(error.status == 401){
                    this.onTokenExpired();
                    return this.renewToken().pipe(
                        switchMap((success: boolean) => {
                            if (success) {
                                //Token renewed successfully
                                return this.get(url, this.getTcAuthOptions(this.getToken())).pipe(
                                    map((response: Object) => {
                                        return response;
                                    }));
                            }
                        }));
                }
                Tc.error('Tradestation unknown error');
                return of(error);
            }),
            catchError((error: HttpErrorResponse) => {
                this.onLogout();
                Tc.error('Tradestation unable to renew token');
                return of(error);
            })
        );
    }

    public postWithAuth(url: string, body: Object | string): Observable<Object> {
        return this.http.post(url, body, this.getTcAuthOptions(this.getToken())).pipe(
            switchMap((response: Object) => {
                return of(response);
            }),
            catchError((error: HttpErrorResponse) => {
                if(error.status == 401){
                    this.onTokenExpired();
                    return this.renewToken().pipe(
                        switchMap((success: boolean) => {
                            if (success) {
                                //Token renewed successfully
                                return this.post(url, body, this.getTcAuthOptions(this.getToken())).pipe(
                                    map((response: Object) => {
                                        return response;
                                    }));
                            }
                        }));
                }
                Tc.error('Tradestation unknown error');
                return of(error);
            }),
            catchError((error: HttpErrorResponse) => {
                this.onLogout();
                Tc.error('Tradestation unable to renew token');
                return of(error);
            })
        );
    }

    public putWithAuth(url: string, body: Object | string): Observable<Object> {
        return this.http.put(url, body, this.getTcAuthOptions(this.getToken())).pipe(
            switchMap((response: Object) => {
                return of(response);
            }),
            catchError((error: HttpErrorResponse) => {
                if(error.status == 401){
                    this.onTokenExpired();
                    return this.renewToken().pipe(
                        switchMap((success: boolean) => {
                            if (success) {
                                //Token renewed successfully
                                return this.put(url, body, this.getTcAuthOptions(this.getToken())).pipe(
                                    map((response: Object) => {
                                        return response;
                                    }));
                            }
                        }));
                }
                Tc.error('Tradestation unknown error');
                return of(error);
            }),
            catchError((error: HttpErrorResponse) => {
                this.onLogout();
                Tc.error('Tradestation unable to renew token');
                return of(error);
            })
        );
    }

    public deleteWithAuth(url: string): Observable<Object> {
        return this.http.delete(url, this.getTcAuthOptions(this.getToken())).pipe(
            switchMap((response: Object) => {
                return of(response);
            }),
            catchError((error: HttpErrorResponse) => {
                if(error.status == 401){
                    this.onTokenExpired();
                    return this.renewToken().pipe(
                        switchMap((success: boolean) => {
                            if (success) {
                                //Token renewed successfully
                                return this.delete(url, this.getTcAuthOptions(this.getToken())).pipe(
                                    map((response: Object) => {
                                        return response;
                                    }));
                            }
                        }));
                }
                Tc.error('Tradestation unknown error');
                return of(error);
            }),
            catchError((error: HttpErrorResponse) => {
                this.onLogout();
                Tc.error('Tradestation unable to renew token');
                return of(error);
            })
        );
    }

    private onTokenExpired() {
        this.tradestationStateService.disableTradestationSession();
    }

    private onLogout() {
        this.onTokenExpired();
        this.tradestationLogoutService.onLogout();
    }

    private get(url: string, options?: Object): Observable<Object> {
        return this.http.get(url, options).pipe(map(response => response));
    }

    private post(url: string, body:Object|string, options?: Object): Observable<Object> {
        return this.http.post(url, body, options).pipe(map(response => response));
    }

    private put(url: string, body:Object|string, options?: Object): Observable<Object>{
        return this.http.put(url , body, options).pipe(map(response => response));
    }

    private delete(url: string, options?: Object): Observable<Object> {
        return this.http.delete(url, options).pipe(map(response => response));
    }

    private renewToken(): Observable<boolean> {
        let headers = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
            })
        };

        let data = `refresh_token=${this.getRefreshToken()}&client_id=${this.tradestationClientService.getClientId()}&client_secret=${this.tradestationClientService.getClientSecret()}&grant_type=refresh_token&response_type=token`;

        return this.post(Tc.url(`${this.tradestationClientService.getBaseUrl()}/security/authorize`), data, headers).pipe(map((response: TradestationRefreshTokenResponse) => {
            if (response.access_token) {
                this.tradestationStateService.setTradestationToken(response.access_token);
                this.tradestationStateService.enableTradestationSession();
                return true;
            }
            Tc.assert(false, 'Tradestation Renew Token is failed');
            return null;
        }));
    }

    private getTcAuthOptions(token: string): Object {
        return {
            headers: new HttpHeaders({
                'Authorization': 'Bearer' + ' ' + token
            })
        }
    }
}

interface TradestationRefreshTokenResponse {
    access_token: string,
    expires_in: number,
    token_type: string,
    userid: string,
}
