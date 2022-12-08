import {Tc} from './tc.utils';


export class DerayahUtils{


    static getSymbolWithMarketFromDerayah(derayahMarket:number, derayahSymbol:string):string{
        let market = DerayahUtils.getMarketAbbreviationFromDerayahMarket(derayahMarket);
        return `${derayahSymbol}.${market}`;
    }

    static getAllowedMarketsAbbreviations():string[]{
        return ["TAD"];
    }

    private static getMarketAbbreviationFromDerayahMarket(market:number):string{
        switch(market) {
            case 99:
            case 98:
                return 'TAD';
            default:
                Tc.error('Unknown derayah market ' + market);
        }
    }

}
