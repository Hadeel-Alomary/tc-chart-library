import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Tc, TcTracker} from '../../utils';

@Injectable({
    providedIn: 'root'
})
export class ProxyService {

    private proxyServerUrl = "";
    private pingUrl: string = 'https://tickerchart.com/pingcache';

    constructor(private http: HttpClient) {
    }

    public init(proxyServerUrl: string, cb: () => void): void {

        Tc.info("init proxy server for url: " + proxyServerUrl);

        if(!proxyServerUrl) {
            // no proxy setup, simply return
            TcTracker.trackProxyNoCache();
            cb();
            return;
        }

        this.proxyServerUrl = proxyServerUrl + "?url=";

        let subscription = this.http.get(this.proxyServerUrl + encodeURIComponent(this.pingUrl), {responseType: 'text'}).subscribe(() => {
            // proxy is ping-able, mark it as enabled and return
            TcTracker.trackProxyEnabled();
            cb();
        }, error => {
            // proxy is not reachable (with an exception), so disable proxy, report exception and return
            this.proxyServerUrl = "";
            TcTracker.trackMessage("proxy ping error: " + error.message);
            TcTracker.trackProxyDisabled();
            cb();
        });

        window.setTimeout(() => {
            if(!subscription.closed) {
                subscription.unsubscribe(); // cancel subscription
                // proxy is too slow to connect to, so disable proxy, report that and return
                this.proxyServerUrl = "";
                TcTracker.trackProxyTimeout();
                cb();
            }
        }, 1500);

    }

    public getProxyServerUrl(): string {
        return this.proxyServerUrl;
    }
}
