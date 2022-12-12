import {Streamer} from './streamer.service';
import {Tc, TcTracker} from "../../../utils/index";

import {SharedChannel} from '../../shared-channel';

export class HeartbeatManager {

    private lastReceivedLog:{[market:string]:number} = {};

    private static THRESHOLD:number = 45000;

    private disconnectionCounter: {[market:string]:number} = {};

    private timerId:number;

    constructor(private streamer:Streamer) {
        this.timerId = window.setInterval(() => this.checkHeartbeatTimeout(), 1000);
    }

    monitorMarket(market: string){
        this.lastReceivedLog[market] = Date.now();
        this.disconnectionCounter[market] = 0;
    }

    heartbeatReceived(market:string) {
        this.lastReceivedLog[market] = Date.now();
        this.disconnectionCounter[market] = 0;
    }

    disconnect() {
        window.clearInterval(this.timerId);
    }

    private checkHeartbeatTimeout() {

        let disconnectedMarkets:string[] = [];

        Object.keys(this.lastReceivedLog).forEach(market => {
            if((Date.now() - this.lastReceivedLog[market]) > HeartbeatManager.THRESHOLD) {
                disconnectedMarkets.push(market);
            }
        });

        disconnectedMarkets.every(market => {

            this.disconnectionCounter[market] += 1;

            if(this.disconnectionCounter[market] == 10) {
                // MA too much disconnection, log the user out (we got 1k+ reconnection for some users in the log due to this)
                this.disconnectionCounter[market] = 0;
                this.disconnect();
                Tc.warn(`too much heartbeat disconnection, log out`);
                // this.logoutService.forceLogout(ForceLogoutType.FailToConnect);
                return false; // break the loop
            }

            Tc.warn(`heartbeat disconnection detected for market ${market}, request restart`);
            TcTracker.trackHeartbeatDisconnection(market);
            this.streamer.onHeartbeatTimeout(market);
            // MA reset market timer, so that if another 45 secs passes without being connected,
            // (as in internet disconnection), then keep trying to reconnect again and again.
            this.lastReceivedLog[market] = Date.now();
            return true;
        });

    }

}
