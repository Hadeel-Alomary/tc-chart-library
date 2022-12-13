import {Injectable} from '@angular/core';
import {TradestationAccountType} from '../../../trading/tradestation/tradestation-account-type';
import {TradestationAccount} from '../../../trading/tradestation/tradestation-accounts';
@Injectable()
export class TradestationStateService{

    private static STORAGE_KEY:string = 'TC_TRADESTATION';


    private storageData:TradestationState;

    constructor(){
        if(localStorage.getItem(TradestationStateService.STORAGE_KEY)){
            this.storageData = JSON.parse(localStorage.getItem(TradestationStateService.STORAGE_KEY));
        }else{
            this.storageData = {
                token: null,
                validSession: false,
                accountKeys: null,
                defaultAccount: null,
                userId: null,
                refreshToken: null,
                accountType: TradestationAccountType.NONE
            };
        }
    }

    reset(){
        this.setTradestationToken(null);
        this.setTradestationRefreshToken(null);
        this.setTradestationAccountKeys([]);
        this.disableTradestationSession();
    }

    getTradestationToken():string{
        return this.storageData.token;
    }

    setTradestationToken(token:string):void{
        this.storageData.token = token;
        this.write();
    }

    getTradestationRefreshToken() {
        return this.storageData.refreshToken;
    }

    setTradestationRefreshToken(refreshToken :string) {
        this.storageData.refreshToken = refreshToken;
        this.write();
    }

    getTradestationUserId():string{
        return this.storageData.userId;
    }

    setTradestationUserId(userId:string):void{
        this.storageData.userId = userId;
        this.write();
    }

    getTradestationAccountKeys(): string {
        return this.storageData.accountKeys;
    }

    setTradestationAccountKeys(keys: number[]) {
        this.storageData.accountKeys = keys.join(',');
        this.write();
    }

    getTradestationDefaultAccount(): TradestationAccount {
        return this.storageData.defaultAccount;
    }

    setTradestationDefaultAccount(account: TradestationAccount) {
        this.storageData.defaultAccount = account;
        this.write();
    }

    getTradestationAccountType():TradestationAccountType {
        return this.storageData.accountType;
    }

    setTradestationAccountType(type:TradestationAccountType) {
        this.storageData.accountType = type;
        this.write();
    }

    enableTradestationSession() {
        this.storageData.validSession = true;
        this.write();
    }

    disableTradestationSession(){
        this.storageData.validSession = false;
        this.write();
    }

    isValidTradestationSession():boolean{
        return this.storageData.validSession;
    }

    private write(){
        localStorage[TradestationStateService.STORAGE_KEY] = JSON.stringify(this.storageData);
    }
}

interface TradestationState {
    token: string;
    validSession: boolean;
    accountKeys: string,
    defaultAccount: TradestationAccount,
    userId: string,
    refreshToken: string,
    accountType: TradestationAccountType
}
