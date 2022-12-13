import {Injectable} from '@angular/core';
import {DerayahPortfolio, DerayahPortfolioQueue} from '../../../trading/derayah/derayah-order/derayah-portfolio';

@Injectable()
export class DerayahStateService{

    private static STORAGE_KEY:string = 'TC_DERAYAH';

    private storageData:DerayahState;

    constructor(){
        if(localStorage.getItem(DerayahStateService.STORAGE_KEY)){
            this.storageData = JSON.parse(localStorage.getItem(DerayahStateService.STORAGE_KEY));
        }else{
            this.storageData = {
                token: null,
                portfolios: [],
                portfoliosQueue: [],
                validSession: false,
                refreshToken: null
            };
        }
    }

    reset(){
        this.setDerayahToken(null);
        this.setDerayahRefreshToken(null)
        this.setDerayahPortfolios(null);
        this.setDerayahPortfoliosQueue(null);
        this.disableDerayahSession();
    }

    getDerayahToken():string{
        return this.storageData.token;
    }

    setDerayahToken(token:string):void{
        this.storageData.token = token;
        this.write();
    }

    getDerayahRefreshToken(): string {
        return this.storageData.refreshToken;
    }

    setDerayahRefreshToken(refreshToken: string): void {
        this.storageData.refreshToken = refreshToken;
        this.write();
    }

    getDerayahPortfolios():DerayahPortfolio[]{
        return this.storageData.portfolios;
    }

    setDerayahPortfolios(portfolios:DerayahPortfolio[]){
        this.storageData.portfolios = portfolios;
        this.write();
    }

    getDerayahPortfoliosQueue(): DerayahPortfolioQueue[]{
        return this.storageData.portfoliosQueue;
    }

    setDerayahPortfoliosQueue(portfoliosQueue: DerayahPortfolioQueue[]){
        this.storageData.portfoliosQueue = portfoliosQueue;
        this.write();
    }

    enableDerayahSession() {
        this.storageData.validSession = true;
        this.write();
    }

    disableDerayahSession(){
        this.storageData.validSession = false;
        this.write();
    }

    isValidDerayahSession():boolean{
        return this.storageData.validSession;
    }

    /* helpers */

    private write(){
        localStorage[DerayahStateService.STORAGE_KEY] = JSON.stringify(this.storageData);
    }
}

interface DerayahState {
    token: string;
    portfolios: DerayahPortfolio[];
    portfoliosQueue: DerayahPortfolioQueue[];
    validSession: boolean;
    refreshToken: string
}
