import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Loader, LoaderConfig, LoaderUrlType} from '../services/loader/loader';
import {Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {TcTracker} from './tc-tracker';
import {Tc} from './tc.utils';
import {CredentialsStateService} from '../services/state';

@Injectable()
export class TcAuthenticatedHttpClient {
    private renewTokenUrl: string;

    constructor(private loader:Loader, private credentialsService: CredentialsStateService, private http: HttpClient) {
        this.loader.getConfigStream()
            .subscribe((loaderConfig: LoaderConfig) => {
                if (loaderConfig) {
                    this.onLoaderConfig(loaderConfig);
                }
            });
    }

    private onLoaderConfig(loaderConfig: LoaderConfig): void {
        this.renewTokenUrl = LoaderConfig.url(loaderConfig, LoaderUrlType.RenewToken);
    }

    public getWithAuth(url: string): Observable<Object> {
        return this.http.get(url,this.getTcAuthOptions()).pipe(
            switchMap((response: Object| ErrorResponse) => {
                let isTokenExpired = 'error' in response && (response as ErrorResponse).error === 'invalid-token';
                if (isTokenExpired) {
                    TcTracker.trackMessage('Token is expired');
                    return this.renewToken().pipe(
                        switchMap((success: boolean) => {
                            if (success) {
                                return this.get(url, this.getTcAuthOptions()).pipe(
                                    map((response: Object) => {
                                        return response;
                                    }));
                            }
                            Tc.error('Unable to renew token');
                        }));
                }
                return of(response);
            }));
    }

    public postWithAuth(url: string, body: Object | string): Observable<Object> {
        return this.http.post(url, body, this.getTcAuthOptions()).pipe(
            switchMap((response: Object| ErrorResponse) => {
                let isTokenExpired = 'error' in response && (response as ErrorResponse).error === 'invalid-token';
                if (isTokenExpired) {
                    TcTracker.trackMessage('Token is expired');
                    return this.renewToken().pipe(
                        switchMap((success: boolean) => {
                            if (success) {
                                return this.post(url, body, this.getTcAuthOptions()).pipe(
                                    map((response: Object) => {
                                        return response;
                                    }));
                            }
                            Tc.error('Unable to renew token');
                        }));
                }
                return of(response);
            }));
    }

    private get(url: string, options?: Object): Observable<Object> {
        return this.http.get(url, options).pipe(map(response => response));
    }

    private post(url: string, body:Object|string, options?: Object): Observable<Object> {
        return this.http.post(url, body, options).pipe(map(response => response));
    }

    private renewToken(): Observable<boolean> {
        let data: { [key: string]: string } = {
            username: this.credentialsService.username,
            password: btoa(this.credentialsService.password)
        };
        return this.post(Tc.url(this.renewTokenUrl), data, this.getTcAuthOptions()).pipe(map((response: RenewTokenResponse) => {
            if (!response.success) {
                Tc.assert(false, 'Failed renewToken url');
                return null;
            }
            return true;
        }));
    }

    private getTcAuthOptions(): Object {
        return {
            headers: new HttpHeaders({
                'Authorization': this.loader.getToken()
            })
        }
    }
}

interface ErrorResponse {
    success: boolean;
    error: string;
}

interface RenewTokenResponse {
    success: boolean;
    response: {
        token: string
    }
}
