import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {ChannelRequestType, SharedChannel} from '../../shared-channel';
import {DerayahStateService} from '../../state/trading/derayah';
import {DerayahLoginChannelRequest} from '../../../components/modals/trading/derayah/derayah-login/derayah-login.component';

@Injectable()

export class DerayahLogoutService{

    private logoutStream: Subject<boolean>;

    constructor(private sharedChannel: SharedChannel, private derayahStateService: DerayahStateService) {
        this.logoutStream = new Subject();
    }

    public getLogoutStream(): Subject<boolean> {
        return this.logoutStream;
    }

    public validateLoginSession(cbOnValidLoginSession: () => void) {
        if(!this.getValidSession()){
            //Ehab When Derayah session being invalid and user clicked on refresh button or open new Derayah window/modal show Derayah Login Modal
            window.setTimeout(() => this.onLogout(), 0);
        } else {
            cbOnValidLoginSession();
        }
    }

    private getValidSession(): boolean {
        return this.derayahStateService.isValidDerayahSession();
    }

    public onLogout() {
        this.logoutStream.next(true);
        this.showLogInPage(true);
    }

    public showLogInPage(isReconnectMode: boolean) {
        let request: DerayahLoginChannelRequest = {type: ChannelRequestType.DerayahConnect, isReconnectMode: isReconnectMode}
        this.sharedChannel.request(request);
    }
}
