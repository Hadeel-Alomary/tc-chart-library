import {Injectable} from '@angular/core';

@Injectable()
export class SnbcapitalStateService{

    private static STORAGE_KEY:string = 'TC_SNBCAPITAL';

    private storageData:SnbcapitalState;

    constructor(){
        if(localStorage.getItem(SnbcapitalStateService.STORAGE_KEY)){
            this.storageData = JSON.parse(localStorage.getItem(SnbcapitalStateService.STORAGE_KEY));
        }else{
            this.storageData = {
                snbcapitalUserName: null,
                basicUrl: null,
                validSession: false,
                buySellPortfolioId: null,
                message: null,
            }
        }
    }

    reset(){
        this.disableSnbcapitalSession();
    }

    getSnbcapitalUserName():string{
        return this.storageData.snbcapitalUserName;
    }

    setSnbcapitalUserName(value:string):void{
        this.storageData.snbcapitalUserName = value;
        this.write();
    }

    enableSnbcapitalSession() {
        this.storageData.validSession = true;
        this.write();
    }

    disableSnbcapitalSession(){
        this.storageData.validSession = false;
        this.write();
    }

    isValidSnbcapitalSession():boolean{
        return this.storageData.validSession;
    }

    setSelectedBuySellPortfolioId(portfolioId: string){
        this.storageData.buySellPortfolioId = portfolioId;
        this.write();
    }

    getSessionExpiredMessage(){
        return this.storageData.message;
    }

    setSessionExpiredMessage(sessionExpiredMessage: string){
        this.storageData.message = sessionExpiredMessage;
        this.write();
    }

    getSelectedBuySellPortfolioId():string{
        return this.storageData.buySellPortfolioId ;
    }

    /* helpers */

    private write(){
        localStorage[SnbcapitalStateService.STORAGE_KEY] = JSON.stringify(this.storageData);
    }
}

interface SnbcapitalState {
    snbcapitalUserName: string;
    basicUrl: string;
    validSession: boolean;
    buySellPortfolioId:string;
    message:string;
}
