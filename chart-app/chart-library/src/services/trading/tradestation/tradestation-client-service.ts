import {TradestationAccountType} from './tradestation-account-type';
import {TradestationStateService} from '../../state/trading/tradestation';
import {Injectable} from '@angular/core';

@Injectable()
export class TradestationClientService {
    constructor(private tradestationStateService: TradestationStateService) {}

    public getBaseUrl(): string {
       return this.tradestationStateService.getTradestationAccountType() == TradestationAccountType.DEMO ? 'https://sim-api.tradestation.com/v2' : 'https://api.tradestation.com/v2';
    }

    public getClientId() {
        return '6BC54EDE-1356-4DC1-B8A5-6095467CBDBB';
    }

    public getClientSecret() {
        return '8fd64de1eea505d84a1369d2e330fb871d7c';
    }
}
