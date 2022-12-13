import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {DerayahClientService} from './derayah-client.service';
import {DerayahStateService} from '../../state/trading/derayah';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {Tc} from '../../../utils';
import {DerayahLogoutService} from './derayah-logout.service';
import {LanguageService} from '../../language';
import {DerayahAuthorizeResponse} from '../../loader/trading/derayah-loader/derayah-loader.service';

@Injectable()
export class DerayahHttpClientService {

  constructor(private http: HttpClient,private derayahClientService: DerayahClientService, private derayahStateService: DerayahStateService, private derayahLogoutService: DerayahLogoutService, private languageService: LanguageService) { }

    private getToken() {
        return this.derayahStateService.getDerayahToken();
    }

    private getRefreshToken(){
        return this.derayahStateService.getDerayahRefreshToken();
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
                Tc.error('Derayah unknown error');
                return of(error);
            }),
            catchError((error: HttpErrorResponse) => {
                if(error.status == 400) {
                    this.onLogout();
                }
                Tc.error('Derayah unable to renew token');
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
                Tc.error('Derayah unknown error');
                return of(error);
            }),
            catchError((error: HttpErrorResponse) => {
                if(error.status == 400) {
                    this.onLogout();
                }
                Tc.error('Derayah unable to renew token');
                return of(error);
            })
        );
    }

    private getTcAuthOptions(token: string): Object {
        return {
            headers: new HttpHeaders({
                'Authorization': 'Bearer' + ' ' + token,
                'Accept-Language': this.languageService.arabic ? 'ar' : 'en'
            })
        };
    }

    private get(url: string, options?: Object): Observable<Object> {
        return this.http.get(url, options).pipe(map(response => response));
    }

    private post(url: string, body:Object|string, options?: Object): Observable<Object> {
        return this.http.post(url, body, options).pipe(map(response => response));
    }

    public renewToken(): Observable<boolean> {
        let headers = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
            })
        };

        let data: string = `client_id=${this.derayahClientService.getClientId()}&client_secret=${this.derayahClientService.getClientSecretId()}&grant_type=refresh_token&refresh_token=${this.getRefreshToken()}`
	  return this.post(null,data,headers).pipe(map((response: DerayahAuthorizeResponse) => {
        // return this.post(this.derayahClientService.getDerayahTokenUrl(),data,headers).pipe(map((response: DerayahAuthorizeResponse) => {
            if(response.access_token){
                this.derayahStateService.setDerayahToken(response.access_token);
                this.derayahStateService.setDerayahRefreshToken(response.refresh_token);
                this.derayahStateService.enableDerayahSession();
                return true;
            }
            Tc.assert(false, 'Derayah Renew Token is failed');
            return null;
        }))
  }

    private onLogout() {
      this.onTokenExpired();
      this.derayahLogoutService.onLogout();
  }

    private onTokenExpired() {
        this.derayahStateService.disableDerayahSession();
    }
}
