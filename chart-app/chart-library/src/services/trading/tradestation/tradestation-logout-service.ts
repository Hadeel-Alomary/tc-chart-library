import {Injectable} from '@angular/core';
import {ChannelRequestType, SharedChannel} from '../../shared-channel';
import {TradestationCaller, TradestationChannelRequest} from '../../shared-channel/channel-request';
import {Subject} from 'rxjs';
import {TradestationStateService} from '../../state/trading/tradestation';

@Injectable()
export class TradestationLogoutService implements TradestationCaller {
    private cancelBrokerSelectionStream:Subject<void>;
    private logoutStream: Subject<boolean>;

    constructor(private sharedChannel: SharedChannel, private tradestationStateService: TradestationStateService) {
        this.cancelBrokerSelectionStream = new Subject();
        this.logoutStream = new Subject();
    }

    public getLogoutStream(): Subject<boolean> {
        return this.logoutStream;
    }

    public onLogout() {
        this.logoutStream.next(true);
        this.showLogInPage();
    }

    public showLogInPage() {
        let request : TradestationChannelRequest = {type: ChannelRequestType.TradestationConnect, caller: this};
        this.sharedChannel.request(request);
    }

    private getValidSession(): boolean {
        return this.tradestationStateService.isValidTradestationSession();
    }

    public validateLoginSession(cbOnValidLoginSession: () => void) {
        if(!this.getValidSession()){
            //Ehab When Tradestation session being invalid and user clicked on refresh button or open new Tradestation window/modal show Tradestation Login Modal
            window.setTimeout(() => this.onLogout(), 0);
        } else {
            cbOnValidLoginSession();
        }
    }

    public getCancelBrokerSelectionStream(): Subject<void> {
        return this.cancelBrokerSelectionStream;
    }

    onCancelConnection(): void {
        this.cancelBrokerSelectionStream.next();
    }
}
